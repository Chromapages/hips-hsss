import { mkdir, readFile, writeFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";

type VoiceEvalManifest = {
  name?: string;
  sampleRate?: number;
  utterances?: Array<{
    id: string;
    speakerId?: string;
    language?: string;
    path?: string;
    anonymizedPath?: string;
    reference?: string;
    referencePath?: string;
    hypothesis?: string;
    hypothesisPath?: string;
  }>;
  trials?: Array<{
    id?: string;
    enrollmentSpeakerId?: string;
    enrollmentUtteranceId?: string;
    trialUtteranceId?: string;
    target: boolean;
    condition?: string;
    genderCondition?: string;
    score?: number;
  }>;
};

type Args = {
  manifest: string;
  outDir: string;
  requireAudio: boolean;
};

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifestPath = resolve(args.manifest);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as VoiceEvalManifest;
  const utterances = manifest.utterances ?? [];
  const trials = manifest.trials ?? [];

  if (utterances.length === 0) {
    throw new Error("manifest.utterances must contain at least one utterance");
  }

  const outDir = resolve(args.outDir);
  const originalDir = join(outDir, "kaldi", "original");
  const anonymizedDir = join(outDir, "kaldi", "anonymized");
  const trialsDir = join(outDir, "trials");

  const originalEntries = utterances
    .filter((utterance) => utterance.path)
    .map((utterance) => ({
      id: utterance.id,
      speakerId: utterance.speakerId ?? utterance.id,
      path: toAbsPath(utterance.path!, manifestPath),
      text: utterance.reference,
    }));

  const anonymizedEntries = utterances
    .filter((utterance) => utterance.anonymizedPath)
    .map((utterance) => ({
      id: utterance.id,
      speakerId: utterance.speakerId ?? utterance.id,
      path: toAbsPath(utterance.anonymizedPath!, manifestPath),
      text: utterance.hypothesis ?? utterance.reference,
    }));

  if (args.requireAudio && originalEntries.length === 0) {
    throw new Error("No utterance.path entries found for VoicePAT export");
  }

  await writeKaldiDataDir(originalDir, originalEntries);
  if (anonymizedEntries.length > 0) {
    await writeKaldiDataDir(anonymizedDir, anonymizedEntries);
  }

  await mkdir(trialsDir, { recursive: true });
  await writeFile(join(trialsDir, "trials"), renderTrials(trials), "utf8");
  await writeFile(join(trialsDir, "trials.with_condition.tsv"), renderConditionTrials(trials), "utf8");

  const exportManifest = {
    generatedAt: new Date().toISOString(),
    sourceManifest: manifestPath,
    sourceName: manifest.name ?? null,
    sampleRate: manifest.sampleRate ?? null,
    voicepat: {
      originalDataDir: originalEntries.length > 0 ? "kaldi/original" : null,
      anonymizedEvalDataDir: anonymizedEntries.length > 0 ? "kaldi/anonymized" : null,
      trialsFile: "trials/trials",
      conditionTrialsFile: "trials/trials.with_condition.tsv",
    },
    counts: {
      utterances: utterances.length,
      originalAudio: originalEntries.length,
      anonymizedAudio: anonymizedEntries.length,
      trials: trials.length,
    },
    notes: [
      "This is a bridge export for VoicePAT-style evaluation.",
      "Point VoicePAT eval_data_dir at kaldi/anonymized when anonymizedPath entries are present.",
      "Point original data references at kaldi/original when required by the selected VoicePAT config.",
      "Generated files contain paths and transcripts only; source audio must remain outside git.",
    ],
  };

  await writeJson(join(outDir, "voicepat-export.json"), exportManifest);
  await writeFile(join(outDir, "README.md"), renderReadme(exportManifest), "utf8");

  console.log(JSON.stringify({ outDir, ...exportManifest.counts }, null, 2));
}

async function writeKaldiDataDir(
  dir: string,
  entries: Array<{ id: string; speakerId: string; path: string; text?: string }>,
) {
  await mkdir(dir, { recursive: true });
  const sorted = [...entries].sort((a, b) => a.id.localeCompare(b.id));
  const speakerMap = new Map<string, string[]>();

  for (const entry of sorted) {
    const utteranceIds = speakerMap.get(entry.speakerId) ?? [];
    utteranceIds.push(entry.id);
    speakerMap.set(entry.speakerId, utteranceIds);
  }

  await writeFile(join(dir, "wav.scp"), sorted.map((entry) => `${entry.id} ${entry.path}`).join("\n") + "\n", "utf8");
  await writeFile(join(dir, "utt2spk"), sorted.map((entry) => `${entry.id} ${entry.speakerId}`).join("\n") + "\n", "utf8");
  await writeFile(
    join(dir, "spk2utt"),
    [...speakerMap.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([speakerId, utteranceIds]) => `${speakerId} ${utteranceIds.sort().join(" ")}`)
      .join("\n") + "\n",
    "utf8",
  );

  const textEntries = sorted.filter((entry) => entry.text);
  if (textEntries.length > 0) {
    await writeFile(
      join(dir, "text"),
      textEntries.map((entry) => `${entry.id} ${normalizeText(entry.text!)}`).join("\n") + "\n",
      "utf8",
    );
  }
}

function renderTrials(trials: NonNullable<VoiceEvalManifest["trials"]>): string {
  if (trials.length === 0) return "";

  return trials
    .map((trial) => {
      const enrollment = trial.enrollmentUtteranceId ?? trial.enrollmentSpeakerId;
      if (!enrollment || !trial.trialUtteranceId) {
        return null;
      }
      return `${enrollment} ${trial.trialUtteranceId} ${trial.target ? "target" : "nontarget"}`;
    })
    .filter((line): line is string => Boolean(line))
    .join("\n") + "\n";
}

function renderConditionTrials(trials: NonNullable<VoiceEvalManifest["trials"]>): string {
  if (trials.length === 0) return "";

  return [
    "id\tenrollment\ttrial\ttarget\tcondition\tgenderCondition\tscore",
    ...trials.map((trial, index) => {
      const id = trial.id ?? `trial_${String(index).padStart(4, "0")}`;
      const enrollment = trial.enrollmentUtteranceId ?? trial.enrollmentSpeakerId ?? "";
      const score = typeof trial.score === "number" ? String(trial.score) : "";
      return [
        id,
        enrollment,
        trial.trialUtteranceId ?? "",
        trial.target ? "target" : "nontarget",
        trial.condition ?? "",
        trial.genderCondition ?? "",
        score,
      ].join("\t");
    }),
  ].join("\n") + "\n";
}

function renderReadme(exportManifest: Record<string, unknown>): string {
  return [
    "# VoicePAT Bridge Export",
    "",
    "This directory was generated from a H.I.P.S. voice-eval manifest.",
    "",
    "Use the paths in `voicepat-export.json` when adapting a VoicePAT evaluation config:",
    "",
    "- `kaldi/original` for original/reference audio when required",
    "- `kaldi/anonymized` for anonymized evaluation audio when available",
    "- `trials/trials` for simple target/non-target trials",
    "- `trials/trials.with_condition.tsv` for H.I.P.S. condition metadata",
    "",
    "Do not commit source audio or participant-like derived audio.",
    "",
    "```json",
    JSON.stringify(exportManifest, null, 2),
    "```",
    "",
  ].join("\n");
}

function parseArgs(argv: string[]): Args {
  const args: Partial<Args> = {
    requireAudio: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--") continue;
    if (value === "--manifest") args.manifest = argv[++index];
    else if (value === "--out-dir") args.outDir = argv[++index];
    else if (value === "--require-audio") args.requireAudio = true;
    else throw new Error(`Unknown argument: ${value}`);
  }

  if (!args.manifest) throw new Error("--manifest is required");
  if (!args.outDir) throw new Error("--out-dir is required");
  return args as Args;
}

function toAbsPath(value: string, manifestPath: string): string {
  return isAbsolute(value) ? value : resolve(join(manifestPath, ".."), value);
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

async function writeJson(path: string, value: unknown) {
  await mkdir(resolve(path, ".."), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
