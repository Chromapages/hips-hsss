#!/usr/bin/env python3
"""Score ASV privacy with EER and optional NeMo ECAPA embeddings.

The adapter supports two modes:

1. Score mode: trials contain precomputed similarity scores.
2. Audio mode: trials reference enrollment/trial WAV files and the adapter
   extracts embeddings with NeMo's EncDecSpeakerLabelModel.

Audio mode is intentionally optional so production app and worker runtimes do
not inherit heavyweight research dependencies.
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def main() -> int:
    args = parse_args()
    manifest_path = Path(args.manifest)
    run_dir = Path(args.run_dir) if args.run_dir else default_run_dir()
    asv_dir = run_dir / "asv"
    asv_dir.mkdir(parents=True, exist_ok=True)

    manifest = read_json(manifest_path)
    trials = load_trials(manifest, manifest_path.parent)

    if any("score" not in trial for trial in trials):
        model = load_nemo_model(args.model_name, args.allow_missing_model)
        if model is None:
            unavailable = {
                "adapter": "ecapa-tdnn",
                "available": False,
                "reason": "NeMo speaker model is not installed or unavailable",
                "generatedAt": now_iso(),
                "manifest": str(manifest_path),
            }
            write_json(asv_dir / "eer.json", unavailable)
            merge_metrics(run_dir, {"eer": default_eer()})
            print(json.dumps(unavailable, indent=2))
            return 0 if args.allow_missing_model else 2

        embedding_cache: dict[str, list[float]] = {}
        for trial in trials:
            if "score" in trial:
                continue
            enrollment_path = trial.get("enrollmentPath")
            trial_path = trial.get("trialPath")
            if not isinstance(enrollment_path, str) or not isinstance(trial_path, str):
                raise ValueError(f"trial {trial['id']} must include score or enrollmentPath/trialPath")
            enrollment_embedding = get_embedding(model, enrollment_path, embedding_cache)
            trial_embedding = get_embedding(model, trial_path, embedding_cache)
            trial["score"] = cosine_similarity(enrollment_embedding, trial_embedding)

    scored_trials = [trial for trial in trials if isinstance(trial.get("score"), (int, float))]
    if not scored_trials:
        raise ValueError("No scored ASV trials available")

    grouped: dict[str, list[dict[str, Any]]] = {}
    grouped["all"] = scored_trials
    for trial in scored_trials:
        condition = trial.get("condition")
        if isinstance(condition, str) and condition:
            grouped.setdefault(condition, []).append(trial)

    eer_by_group = {
        group: compute_eer([(float(trial["score"]), bool(trial["target"])) for trial in group_trials])
        for group, group_trials in grouped.items()
    }

    metrics_eer = default_eer()
    if "lazyInformed" in eer_by_group:
        metrics_eer["lazyInformed"] = eer_by_group["lazyInformed"]["eer"]
    if "semiInformed" in eer_by_group:
        metrics_eer["semiInformed"] = eer_by_group["semiInformed"]["eer"]
    if "adapted" in eer_by_group:
        metrics_eer["adapted"] = eer_by_group["adapted"]["eer"]

    result = {
        "adapter": "ecapa-tdnn",
        "available": True,
        "generatedAt": now_iso(),
        "manifest": str(manifest_path),
        "modelName": args.model_name,
        "trialCount": len(scored_trials),
        "eer": eer_by_group,
        "trials": [
            {
                "id": trial["id"],
                "target": bool(trial["target"]),
                "condition": trial.get("condition"),
                "genderCondition": trial.get("genderCondition"),
                "score": float(trial["score"]),
            }
            for trial in scored_trials
        ],
    }

    write_json(asv_dir / "eer.json", result)
    merge_metrics(run_dir, {
        "eer": metrics_eer,
        "eerDetail": {
            "adapter": "ecapa-tdnn",
            "modelName": args.model_name,
            "trialCount": len(scored_trials),
            "artifact": "asv/eer.json",
            "groups": eer_by_group,
        },
    })

    print(json.dumps({"runDir": str(run_dir), "eer": metrics_eer, "trialCount": len(scored_trials)}, indent=2))
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Score ASV EER for a voice-eval trial manifest.")
    parser.add_argument("--manifest", required=True, help="Path to ASV trial manifest JSON.")
    parser.add_argument("--run-dir", help="Existing or new tools/voice-eval/runs/<run-id> directory.")
    parser.add_argument("--model-name", default="ecapa_tdnn", help="NeMo speaker model name for audio mode.")
    parser.add_argument(
        "--allow-missing-model",
        action="store_true",
        help="Write an unavailable artifact instead of failing when NeMo/model deps are missing.",
    )
    return parser.parse_args()


def load_nemo_model(model_name: str, allow_missing: bool) -> Any | None:
    try:
        import nemo.collections.asr as nemo_asr
    except ModuleNotFoundError:
        if allow_missing:
            return None
        print(
            "NeMo is required for audio-mode ASV scoring. Install optional eval deps with "
            "`python3 -m pip install -r tools/voice-eval/requirements-asv.txt`.",
            file=sys.stderr,
        )
        return None

    return nemo_asr.models.EncDecSpeakerLabelModel.from_pretrained(model_name=model_name)


def get_embedding(model: Any, path: str, cache: dict[str, list[float]]) -> list[float]:
    if path in cache:
        return cache[path]

    raw_embedding = model.get_embedding(path)
    if hasattr(raw_embedding, "detach"):
        raw_embedding = raw_embedding.detach().cpu().flatten().tolist()
    elif hasattr(raw_embedding, "flatten"):
        raw_embedding = raw_embedding.flatten().tolist()
    else:
        raw_embedding = list(raw_embedding)

    embedding = [float(value) for value in raw_embedding]
    cache[path] = embedding
    return embedding


def cosine_similarity(left: list[float], right: list[float]) -> float:
    length = min(len(left), len(right))
    if length == 0:
        raise ValueError("Cannot compare empty embeddings")

    dot = sum(left[i] * right[i] for i in range(length))
    left_norm = math.sqrt(sum(left[i] * left[i] for i in range(length)))
    right_norm = math.sqrt(sum(right[i] * right[i] for i in range(length)))
    if left_norm == 0 or right_norm == 0:
        return 0.0
    return dot / (left_norm * right_norm)


def compute_eer(scored: list[tuple[float, bool]]) -> dict[str, float | int | None]:
    positives = [score for score, target in scored if target]
    negatives = [score for score, target in scored if not target]
    if not positives or not negatives:
        return {
            "eer": None,
            "threshold": None,
            "far": None,
            "frr": None,
            "targetTrials": len(positives),
            "nonTargetTrials": len(negatives),
        }

    thresholds = sorted({score for score, _target in scored})
    thresholds = [thresholds[0] - 1e-9, *thresholds, thresholds[-1] + 1e-9]

    best: dict[str, float | int | None] | None = None
    best_gap = float("inf")
    for threshold in thresholds:
        false_accepts = sum(1 for score in negatives if score >= threshold)
        false_rejects = sum(1 for score in positives if score < threshold)
        far = false_accepts / len(negatives)
        frr = false_rejects / len(positives)
        gap = abs(far - frr)
        if gap < best_gap:
            best_gap = gap
            best = {
                "eer": (far + frr) / 2,
                "threshold": threshold,
                "far": far,
                "frr": frr,
                "targetTrials": len(positives),
                "nonTargetTrials": len(negatives),
            }

    return best or {
        "eer": None,
        "threshold": None,
        "far": None,
        "frr": None,
        "targetTrials": len(positives),
        "nonTargetTrials": len(negatives),
    }


def load_trials(manifest: dict[str, Any], base_dir: Path) -> list[dict[str, Any]]:
    raw_trials = manifest.get("trials")
    if not isinstance(raw_trials, list) or not raw_trials:
        raise ValueError("manifest.trials must be a non-empty array")

    trials: list[dict[str, Any]] = []
    for index, raw in enumerate(raw_trials):
        if not isinstance(raw, dict):
            raise ValueError(f"trials[{index}] must be an object")

        trial_id = raw.get("id")
        if not isinstance(trial_id, str) or not trial_id:
            trial_id = f"trial_{index:04d}"

        target = raw.get("target")
        if not isinstance(target, bool):
            raise ValueError(f"trial {trial_id} must include boolean target")

        trial = {
            "id": trial_id,
            "target": target,
            "condition": raw.get("condition", "all"),
            "genderCondition": raw.get("genderCondition"),
        }

        if isinstance(raw.get("score"), (int, float)):
            trial["score"] = float(raw["score"])
        else:
            for key in ("enrollmentPath", "trialPath"):
                value = raw.get(key)
                if isinstance(value, str) and value:
                    path = Path(value)
                    if not path.is_absolute():
                        path = base_dir / path
                    trial[key] = str(path)

        trials.append(trial)

    return trials


def default_eer() -> dict[str, None]:
    return {
        "lazyInformed": None,
        "semiInformed": None,
        "adapted": None,
    }


def default_run_dir() -> Path:
    run_id = "eer-smoke-" + datetime.now(timezone.utc).isoformat().replace(":", "-").replace(".", "-")
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


def merge_metrics(run_dir: Path, patch: dict[str, Any]) -> None:
    metrics_path = run_dir / "metrics.json"
    if metrics_path.exists():
        metrics = read_json(metrics_path)
    else:
        metrics = {
            "eer": default_eer(),
            "wer": None,
            "uar": None,
            "mos": None,
            "rtf": None,
        }

    metrics.update(patch)
    write_json(metrics_path, metrics)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


if __name__ == "__main__":
    raise SystemExit(main())
