#!/usr/bin/env python3
"""Score ASR utility with jiwer and write H.I.P.S. voice-eval artifacts.

This adapter intentionally accepts transcripts rather than running ASR itself.
Future adapters can generate hypotheses with Whisper, ESPnet, or VoicePAT and
then feed those transcripts here for consistent WER reporting.
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def main() -> int:
    args = parse_args()
    manifest_path = Path(args.manifest)
    run_dir = Path(args.run_dir) if args.run_dir else default_run_dir()
    asr_dir = run_dir / "asr"
    asr_dir.mkdir(parents=True, exist_ok=True)

    manifest = read_json(manifest_path)

    try:
        from jiwer import collect_error_counts, process_words
    except ModuleNotFoundError:
        if not args.allow_missing_jiwer:
            print(
                "jiwer is required for WER scoring. Install optional eval deps with "
                "`python3 -m pip install -r tools/voice-eval/requirements-asr.txt`.",
                file=sys.stderr,
            )
            return 2

        unavailable = {
            "adapter": "jiwer",
            "available": False,
            "reason": "jiwer is not installed",
            "generatedAt": now_iso(),
            "manifest": str(manifest_path),
        }
        write_json(asr_dir / "wer.json", unavailable)
        merge_metrics(run_dir, {"wer": None})
        print(json.dumps(unavailable, indent=2))
        return 0

    items = load_items(manifest, manifest_path.parent)
    references = [item["reference"] for item in items]
    hypotheses = [item["hypothesis"] for item in items]
    corpus = process_words(references, hypotheses)
    substitutions, insertions, deletions = collect_error_counts(corpus)

    per_utterance = []
    for item in items:
        output = process_words(item["reference"], item["hypothesis"])
        per_utterance.append({
            "id": item["id"],
            "speakerId": item.get("speakerId"),
            "language": item.get("language"),
            "wer": output.wer,
            "mer": output.mer,
            "wil": output.wil,
            "wip": output.wip,
            "hits": output.hits,
            "substitutions": output.substitutions,
            "insertions": output.insertions,
            "deletions": output.deletions,
        })

    result = {
        "adapter": "jiwer",
        "available": True,
        "generatedAt": now_iso(),
        "manifest": str(manifest_path),
        "utteranceCount": len(items),
        "corpus": {
            "wer": corpus.wer,
            "mer": corpus.mer,
            "wil": corpus.wil,
            "wip": corpus.wip,
            "hits": corpus.hits,
            "substitutions": corpus.substitutions,
            "insertions": corpus.insertions,
            "deletions": corpus.deletions,
        },
        "errorCounts": {
            "substitutions": stringify_tuple_keys(substitutions),
            "insertions": insertions,
            "deletions": deletions,
        },
        "utterances": per_utterance,
    }

    write_json(asr_dir / "wer.json", result)
    merge_metrics(run_dir, {
        "wer": corpus.wer,
        "werDetail": {
            "adapter": "jiwer",
            "utteranceCount": len(items),
            "mer": corpus.mer,
            "wil": corpus.wil,
            "wip": corpus.wip,
            "substitutions": corpus.substitutions,
            "insertions": corpus.insertions,
            "deletions": corpus.deletions,
            "artifact": "asr/wer.json",
        },
    })

    print(json.dumps({"runDir": str(run_dir), "wer": corpus.wer, "utteranceCount": len(items)}, indent=2))
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Score WER for a voice-eval transcript manifest.")
    parser.add_argument("--manifest", required=True, help="Path to ASR transcript manifest JSON.")
    parser.add_argument("--run-dir", help="Existing or new tools/voice-eval/runs/<run-id> directory.")
    parser.add_argument(
        "--allow-missing-jiwer",
        action="store_true",
        help="Write an unavailable artifact instead of failing when jiwer is not installed.",
    )
    return parser.parse_args()


def default_run_dir() -> Path:
    run_id = "wer-smoke-" + datetime.now(timezone.utc).isoformat().replace(":", "-").replace(".", "-")
    return Path.cwd() / "tools" / "voice-eval" / "runs" / run_id


def read_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        value = json.load(handle)
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(value, handle, indent=2)
        handle.write("\n")


def load_items(manifest: dict[str, Any], base_dir: Path) -> list[dict[str, Any]]:
    raw_items = manifest.get("utterances")
    if not isinstance(raw_items, list) or not raw_items:
        raise ValueError("manifest.utterances must be a non-empty array")

    items: list[dict[str, Any]] = []
    for index, raw in enumerate(raw_items):
        if not isinstance(raw, dict):
            raise ValueError(f"utterances[{index}] must be an object")

        reference = read_text_or_value(raw, "reference", "referencePath", base_dir)
        hypothesis = read_text_or_value(raw, "hypothesis", "hypothesisPath", base_dir)
        item_id = raw.get("id")
        if not isinstance(item_id, str) or not item_id:
            item_id = f"utt_{index:04d}"

        items.append({
            "id": item_id,
            "speakerId": raw.get("speakerId"),
            "language": raw.get("language"),
            "reference": reference,
            "hypothesis": hypothesis,
        })

    return items


def read_text_or_value(raw: dict[str, Any], value_key: str, path_key: str, base_dir: Path) -> str:
    value = raw.get(value_key)
    if isinstance(value, str):
        return value.strip()

    path_value = raw.get(path_key)
    if isinstance(path_value, str) and path_value:
        path = Path(path_value)
        if not path.is_absolute():
            path = base_dir / path
        return path.read_text(encoding="utf-8").strip()

    raise ValueError(f"utterance {raw.get('id', '<unknown>')} missing {value_key} or {path_key}")


def merge_metrics(run_dir: Path, patch: dict[str, Any]) -> None:
    metrics_path = run_dir / "metrics.json"
    if metrics_path.exists():
        metrics = read_json(metrics_path)
    else:
        metrics = {
            "eer": {
                "lazyInformed": None,
                "semiInformed": None,
                "adapted": None,
            },
            "wer": None,
            "uar": None,
            "mos": None,
            "rtf": None,
        }

    metrics.update(patch)
    write_json(metrics_path, metrics)


def stringify_tuple_keys(value: dict[Any, Any]) -> dict[str, Any]:
    output: dict[str, Any] = {}
    for key, count in value.items():
        if isinstance(key, tuple):
            output[" -> ".join(str(part) for part in key)] = count
        else:
            output[str(key)] = count
    return output


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


if __name__ == "__main__":
    raise SystemExit(main())
