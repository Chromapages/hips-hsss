# Voice Evaluation Workspace

**Status:** scaffold  
**Purpose:** measure H.I.P.S. voice masking candidates before any production
anonymization claims are made.

This workspace is the future home for VoicePrivacy-style evaluation. It should
compare the current DSP fallback, the CPU DSP worker, and future neural
candidates against the same datasets and attacker models.

## Required Metrics

| Metric | Purpose | Direction |
|---|---|---|
| EER | speaker re-identification resistance | higher is better |
| WER | linguistic content preservation | lower is better |
| UAR | emotion/prosody preservation | higher is better |
| RTF | inference speed relative to real time | must be `< 1.0` |
| Added latency | live conversation cost | lower is better |
| MOS | human perceived quality | higher is better |

## Candidate Systems

Each benchmark run should include:

- original reference audio
- browser Effects Mode DSP
- `services/voice-worker` CPU DSP
- offline neural prototypes
- streaming neural candidates

## Attack Models

Minimum attacker coverage:

- lazy-informed attacker: knows the anonymization method, no clean enrollment
- semi-informed attacker: has clean enrollment samples for the target speaker
- adapted attacker: trained or tuned against anonymized outputs

The release score should be the lowest EER across attacker families, not the
most favorable result.

## Dataset Manifest

The first implementation should use a manifest format similar to:

```json
{
  "name": "vpc-track1-smoke",
  "sampleRate": 16000,
  "utterances": [
    {
      "id": "speakerA_0001",
      "speakerId": "speakerA",
      "language": "en",
      "emotion": "neutral",
      "path": "data/input/speakerA_0001.wav"
    }
  ],
  "trials": [
    {
      "enrollmentSpeakerId": "speakerA",
      "trialUtteranceId": "speakerA_0001",
      "target": true,
      "condition": "same-gender"
    }
  ]
}
```

Do not commit source audio or derived participant-like audio to the repo.
Datasets should live in ignored local storage or controlled object storage with
license and consent records.

## Output Shape

Each candidate should emit:

```text
tools/voice-eval/runs/<run-id>/
  manifest.json
  system.json
  metrics.json
  latency.json
  notes.md
```

`metrics.json` should include at least:

```json
{
  "eer": {
    "lazyInformed": null,
    "semiInformed": null,
    "adapted": null
  },
  "wer": null,
  "uar": null,
  "mos": null,
  "rtf": null
}
```

## First Build Tasks

1. Done: add a tiny synthetic/smoke fixture generator.
2. Done: add a runner that invokes the current CPU DSP worker logic in batch
   mode.
3. Done: add initial latency instrumentation around worker-frame processing.
4. In progress: add adapters for ASV, ASR, and emotion-recognition tools.
   - Done: transcript-level WER adapter scaffold using optional `jiwer`.
   - Done: score-level EER adapter scaffold with optional NeMo ECAPA audio mode.
5. Add real, licensed evaluation manifests outside git.
6. Produce the first VoicePrivacy-style baseline report for current DSP.

## Smoke Runner

Run the current CPU DSP smoke benchmark with:

```bash
corepack pnpm voice:eval:smoke
```

The runner uses synthetic PCM only. It writes ignored artifacts to:

```text
tools/voice-eval/runs/<run-id>/
```

Current smoke metrics include frame counts, speech/silence counts, RTF,
input/output RMS, transform delta, and processing latency percentiles. EER,
WER, UAR, and MOS are intentionally `null` until the ASV/ASR/SER and listening
test adapters exist.

## WER Adapter

The first ASR utility adapter scores transcripts with `jiwer`. It does not run
ASR itself; future Whisper, ESPnet, or VoicePAT adapters should write
hypothesis transcripts and then reuse this scorer.

Install optional local dependencies with:

```bash
python3 -m pip install -r tools/voice-eval/requirements-asr.txt
```

Run the transcript-only smoke manifest with:

```bash
corepack pnpm voice:eval:wer:smoke
```

For real scoring, provide a licensed local manifest and run:

```bash
corepack pnpm voice:eval:wer -- --manifest /path/to/asr-manifest.json --run-dir tools/voice-eval/runs/<run-id>
```

Manifest entries may include inline transcripts:

```json
{
  "utterances": [
    {
      "id": "speakerA_0001",
      "speakerId": "speakerA",
      "language": "en",
      "reference": "ground truth words",
      "hypothesis": "recognized words"
    }
  ]
}
```

or text file paths relative to the manifest:

```json
{
  "utterances": [
    {
      "id": "speakerA_0001",
      "referencePath": "references/speakerA_0001.txt",
      "hypothesisPath": "hypotheses/speakerA_0001.masked.txt"
    }
  ]
}
```

The adapter writes `asr/wer.json` and merges `wer` plus `werDetail` into the
run's `metrics.json`. Source audio and derived participant-like audio must
remain outside git.

## EER Adapter

The first ASV adapter computes equal error rate from speaker-verification trial
scores. It can also extract scores from audio when optional NeMo dependencies
and model weights are available.

Run the score-only smoke manifest with:

```bash
corepack pnpm voice:eval:eer:smoke
```

For audio-mode ECAPA scoring, install optional local dependencies after
reviewing Python/CUDA compatibility:

```bash
python3 -m pip install -r tools/voice-eval/requirements-asv.txt
```

Then provide a licensed local manifest:

```json
{
  "trials": [
    {
      "id": "speakerA_trial_0001",
      "target": true,
      "condition": "semiInformed",
      "genderCondition": "same-gender",
      "enrollmentPath": "enroll/speakerA.wav",
      "trialPath": "masked/speakerA_0001.wav"
    }
  ]
}
```

or precomputed cosine scores:

```json
{
  "trials": [
    {
      "id": "speakerA_trial_0001",
      "target": true,
      "condition": "semiInformed",
      "score": 0.72
    }
  ]
}
```

The adapter writes `asv/eer.json` and merges `eer` plus `eerDetail` into the
run's `metrics.json`. The launch score should remain the lowest EER across
configured attacker families.

## VoicePAT Bridge

VoicePAT uses configuration files and Kaldi-style data directories. The bridge
export writes enough structure for adapting a VoicePAT evaluation config
without making VoicePAT a hard dependency of this repo.

Run the smoke export with:

```bash
corepack pnpm voice:eval:voicepat:smoke
```

For a real local manifest:

```bash
corepack pnpm voice:eval:voicepat:export -- \
  --manifest /path/to/voice-eval-manifest.json \
  --out-dir tools/voice-eval/runs/<run-id>/voicepat-export
```

The export writes:

```text
voicepat-export/
  kaldi/original/wav.scp
  kaldi/original/utt2spk
  kaldi/original/spk2utt
  kaldi/original/text
  kaldi/anonymized/wav.scp
  kaldi/anonymized/utt2spk
  kaldi/anonymized/spk2utt
  kaldi/anonymized/text
  trials/trials
  trials/trials.with_condition.tsv
  voicepat-export.json
```

After running VoicePAT externally, import generic result artifacts back into a
H.I.P.S. run with:

```bash
corepack pnpm voice:eval:voicepat:import -- \
  --voicepat-dir /path/to/voicepat/results \
  --run-dir tools/voice-eval/runs/<run-id>
```

The importer looks for JSON/CSV/TSV files containing EER/WER/UAR/MOS-like keys,
writes `voicepat/import.json`, and merges discovered values into `metrics.json`.
Verify metric semantics against the exact VoicePAT config before using imported
values as release gates.

## Release Rule

No H.I.P.S. implementation graduates from `Effects Mode` or `POC` to
`Enhanced Neural Masking` until this workspace can produce repeatable EER, WER,
UAR, RTF, and latency reports for that implementation.
