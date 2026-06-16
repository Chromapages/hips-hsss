#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────────────────
# rotate-secret.sh — H.I.P.S. secret rotation runbook (Layer 6)
# ───────────────────────────────────────────────────────────────────────────
#
# Performs a zero-downtime rotation of a signing secret. The procedure:
#
#   1. Generate a new secret.
#   2. Move the current primary into the *_PRIOR slot.
#   3. Set the new value as the new primary.
#   4. Deploy.
#   5. Wait for the longest token TTL to expire (see TTL table below).
#   6. Remove the *_PRIOR slot.
#
# This script handles steps 1-3. Steps 4-6 are operational.
#
# Supported secret categories:
#
#   category   env var                prior env var                       TTL
#   ────────   ──────────────────     ──────────────────────────────     ────────
#   session    SESSION_SERVICE_SECRET SESSION_SERVICE_SECRET_PRIOR       2 hours
#   service    SERVICE_JWT_SECRET     SERVICE_JWT_SECRET_PRIOR           5 minutes
#   safety     SAFETY_SERVICE_SECRET  SAFETY_SERVICE_SECRET_PRIOR        5 minutes
#   mfa        MFA_ENCRYPTION_KEY     MFA_ENCRYPTION_KEY_PRIOR           indefinite
#                                                                   (re-encrypt on
#                                                                    next verify)
#
# Usage:
#   ./scripts/rotate-secret.sh <category> [--dry-run] [--new-value <value>]
#
#   category   one of: session | service | safety | mfa
#   --dry-run  print the env diff without touching any file
#   --new-value  supply your own secret (default: openssl rand -base64 64)
#
# Examples:
#   ./scripts/rotate-secret.sh session --dry-run
#   ./scripts/rotate-secret.sh service
#   ./scripts/rotate-secret.sh mfa --new-value "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFG="
# ───────────────────────────────────────────────────────────────────────────

set -euo pipefail

CATEGORY=""
DRY_RUN=false
NEW_VALUE=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        session|service|safety|mfa)
            CATEGORY="$1"
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --new-value)
            NEW_VALUE="$2"
            shift 2
            ;;
        -h|--help)
            sed -n '2,40p' "$0"
            exit 0
            ;;
        *)
            echo "Unknown argument: $1" >&2
            exit 2
            ;;
    esac
done

if [[ -z "$CATEGORY" ]]; then
    echo "Usage: $0 <category> [--dry-run] [--new-value <value>]" >&2
    echo "Categories: session | service | safety | mfa" >&2
    exit 2
fi

# ─── Resolve env var names per category ───────────────────────────────────

case "$CATEGORY" in
    session)
        PRIMARY="SESSION_SERVICE_SECRET"
        PRIOR="SESSION_SERVICE_SECRET_PRIOR"
        TTL_DESC="2 hours (session tokens)"
        LENGTH_DESC="≥ 32 chars"
        ;;
    service)
        PRIMARY="SERVICE_JWT_SECRET"
        PRIOR="SERVICE_JWT_SECRET_PRIOR"
        TTL_DESC="5 minutes (service tokens)"
        LENGTH_DESC="≥ 64 chars"
        ;;
    safety)
        PRIMARY="SAFETY_SERVICE_SECRET"
        PRIOR="SAFETY_SERVICE_SECRET_PRIOR"
        TTL_DESC="5 minutes (safety service tokens)"
        LENGTH_DESC="≥ 32 chars"
        ;;
    mfa)
        PRIMARY="MFA_ENCRYPTION_KEY"
        PRIOR="MFA_ENCRYPTION_KEY_PRIOR"
        TTL_DESC="indefinite (re-encrypt on next verify)"
        LENGTH_DESC="exactly 44 chars (32 raw bytes → base64)"
        ;;
esac

# ─── Read current primary from environment or .env file ───────────────────

# Try process env first, then .env in the workspace root, then .env.local.
CURRENT_PRIMARY=""
if [[ -n "${!PRIMARY-}" ]]; then
    CURRENT_PRIMARY="${!PRIMARY}"
fi

if [[ -z "$CURRENT_PRIMARY" ]]; then
    for envfile in .env .env.local ../.env ../.env.local ../../.env ../../.env.local; do
        if [[ -f "$envfile" ]]; then
            line=$(grep -E "^${PRIMARY}=" "$envfile" || true)
            if [[ -n "$line" ]]; then
                CURRENT_PRIMARY=$(echo "$line" | sed -E "s/^${PRIMARY}=//; s/^['\"]//; s/['\"]$//")
                break
            fi
        fi
    done
fi

if [[ -z "$CURRENT_PRIMARY" ]]; then
    echo "ERROR: $PRIMARY is not set in the environment or in any .env file." >&2
    exit 1
fi

# ─── Generate the new value if not supplied ───────────────────────────────

if [[ -z "$NEW_VALUE" ]]; then
    if [[ "$CATEGORY" == "mfa" ]]; then
        # 32 raw bytes → 44 base64 chars
        NEW_VALUE=$(openssl rand 32 | base64)
    else
        NEW_VALUE=$(openssl rand -base64 64)
    fi
fi

# Sanity-check length.
EXPECTED_LEN=32
case "$CATEGORY" in
    service) EXPECTED_LEN=64 ;;
    mfa)     EXPECTED_LEN=44 ;;
esac
if [[ ${#NEW_VALUE} -lt $EXPECTED_LEN ]]; then
    echo "ERROR: Generated value is shorter than the required $EXPECTED_LEN chars." >&2
    exit 1
fi

# ─── Build the env diff ───────────────────────────────────────────────────

NEW_LINE="${PRIMARY}=${NEW_VALUE}"
PRIOR_LINE="${PRIOR}=${CURRENT_PRIMARY}"

# ─── Output ───────────────────────────────────────────────────────────────

if $DRY_RUN; then
    echo "── DRY RUN: no files will be modified ──"
    echo
    echo "Apply the following changes to your .env (or secret manager):"
    echo
    echo "  ${PRIMARY} was:  (length: ${#CURRENT_PRIMARY})"
    echo "  ${PRIOR}   was:  (unset or different)"
    echo
    echo "  ${PRIOR}    set:  ${CURRENT_PRIMARY:0:8}…  (length: ${#CURRENT_PRIMARY})"
    echo "  ${PRIMARY}  set:  ${NEW_VALUE:0:8}…  (length: ${#NEW_VALUE})"
    echo
    echo "TTL to wait before removing ${PRIOR}:"
    echo "  $TTL_DESC"
    exit 0
fi

# ─── Real run — print instructions, don't auto-modify files ───────────────

cat <<EOF
── ROTATION PLAN for $CATEGORY ($PRIMARY) ──

1. Set the prior slot to the current primary:
     export $PRIOR="$CURRENT_PRIMARY"
     (or add to .env: $PRIOR_LINE)

2. Set the primary to the new value:
     export $PRIMARY="$NEW_VALUE"
     (or add to .env: $NEW_LINE)

3. Deploy. The application will now sign new tokens with the new
   primary and still verify old tokens (signed with the old primary)
   via the prior slot. Dual-verification is automatic.

4. Wait for the longest token TTL to pass:
     TTL: $TTL_DESC

5. Remove the prior slot:
     unset $PRIOR
     (or delete the $PRIOR line from .env)

6. Re-deploy.

── secret generated (length: ${#NEW_VALUE}) ──
$NEW_VALUE
EOF
