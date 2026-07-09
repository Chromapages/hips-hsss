import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

type Args = {
  voicepatDir: string;
  runDir: string;
};

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const voicepatDir = resolve(args.voicepatDir);
  const runDir = resolve(args.runDir);
  const importDir = join(runDir, "voicepat");

  const imported = await importVoicePatMetrics(voicepatDir);
  await mkdir(importDir, { recursive: true });
  await writeJson(join(importDir, "import.json"), imported);

  const metricsPatch: Record<string, unknown> = {};
  if (typeof imported.metrics.eer === "number") {
    metricsPatch.eer = {
      lazyInformed: null,
      semiInformed: imported.metrics.eer,
      adapted: null,
    };
  }
  if (typeof imported.metrics.wer === "number") {
    metricsPatch.wer = imported.metrics.wer;
  }
  metricsPatch.voicepatDetail = {
    artifact: "voicepat/import.json",
    sourceDir: voicepatDir,
    importedFiles: imported.files,
    metrics: imported.metrics,
  };

  await mergeMetrics(runDir, metricsPatch);
  console.log(JSON.stringify({ runDir, imported: imported.metrics }, null, 2));
}

async function importVoicePatMetrics(voicepatDir: string) {
  const candidates = await findCandidateFiles(voicepatDir);
  const metrics: Record<string, number> = {};
  const files: string[] = [];

  for (const file of candidates) {
    const content = await readFile(file, "utf8");
    const parsed = parseMetricContent(content, file);
    if (Object.keys(parsed).length === 0) continue;
    files.push(file);
    Object.assign(metrics, parsed);
  }

  return {
    generatedAt: new Date().toISOString(),
    sourceDir: voicepatDir,
    files,
    metrics,
    note: "Generic VoicePAT import. Verify metric semantics against the exact VoicePAT config before using as a release gate.",
  };
}

async function findCandidateFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const output: string[] = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      output.push(...await findCandidateFiles(path));
      continue;
    }

    const lower = entry.name.toLowerCase();
    if (
      lower === "metrics.json" ||
      lower === "results.json" ||
      lower === "summary.json" ||
      lower.endsWith(".metrics.tsv") ||
      lower.endsWith(".metrics.csv") ||
      lower.includes("eer") ||
      lower.includes("wer")
    ) {
      output.push(path);
    }
  }

  return output;
}

function parseMetricContent(content: string, file: string): Record<string, number> {
  const lowerName = basename(file).toLowerCase();
  const trimmed = content.trim();
  if (!trimmed) return {};

  if (lowerName.endsWith(".json")) {
    const parsed = JSON.parse(trimmed) as unknown;
    return extractMetricsFromJson(parsed);
  }

  const metrics: Record<string, number> = {};
  for (const line of trimmed.split(/\r?\n/)) {
    const fields = line.split(/[,\t ]+/).filter(Boolean);
    if (fields.length < 2) continue;
    const key = normalizeMetricKey(fields[0]!);
    const value = Number(fields[1]);
    if (key && Number.isFinite(value)) metrics[key] = value;
  }
  return metrics;
}

function extractMetricsFromJson(value: unknown): Record<string, number> {
  const metrics: Record<string, number> = {};

  function visit(node: unknown, path: string[]) {
    if (typeof node === "number" && Number.isFinite(node)) {
      const key = normalizeMetricKey(path[path.length - 1] ?? "");
      if (key) metrics[key] = node;
      return;
    }
    if (!node || typeof node !== "object" || Array.isArray(node)) return;
    for (const [key, child] of Object.entries(node)) {
      visit(child, [...path, key]);
    }
  }

  visit(value, []);
  return metrics;
}

function normalizeMetricKey(key: string): string | null {
  const normalized = key.toLowerCase().replace(/[^a-z0-9]+/g, "");
  if (normalized === "eer" || normalized.endsWith("eer")) return "eer";
  if (normalized === "wer" || normalized.endsWith("wer")) return "wer";
  if (normalized === "uar" || normalized.endsWith("uar")) return "uar";
  if (normalized === "mos" || normalized.endsWith("mos")) return "mos";
  return null;
}

async function mergeMetrics(runDir: string, patch: Record<string, unknown>) {
  const metricsPath = join(runDir, "metrics.json");
  let metrics: Record<string, unknown>;
  try {
    metrics = JSON.parse(await readFile(metricsPath, "utf8")) as Record<string, unknown>;
  } catch {
    metrics = {
      eer: {
        lazyInformed: null,
        semiInformed: null,
        adapted: null,
      },
      wer: null,
      uar: null,
      mos: null,
      rtf: null,
    };
  }

  await writeJson(metricsPath, { ...metrics, ...patch });
}

function parseArgs(argv: string[]): Args {
  const args: Partial<Args> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--") continue;
    if (value === "--voicepat-dir") args.voicepatDir = argv[++index];
    else if (value === "--run-dir") args.runDir = argv[++index];
    else throw new Error(`Unknown argument: ${value}`);
  }

  if (!args.voicepatDir) throw new Error("--voicepat-dir is required");
  if (!args.runDir) throw new Error("--run-dir is required");
  return args as Args;
}

async function writeJson(path: string, value: unknown) {
  await mkdir(resolve(path, ".."), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
