# Branching and Commit Convention

## Branches

- `main`: deployable production trunk.
- `feature/<short-scope>`: product or platform work.
- `fix/<short-scope>`: defect fixes.
- `security/<short-scope>`: hard-anonymity, vault, auth, or incident work.
- `docs/<short-scope>`: documentation-only changes.

## Commits

Use the Lore Commit Protocol from `AGENTS.md`. The first line should explain
why the change exists. Add trailers when they preserve useful context.

Example:

```text
Preserve anonymous-session isolation during token issuance

The session service accepts only anonymous room identifiers after commerce
auth has completed, keeping Firebase identifiers out of the live session path.

Constraint: Session DB must never store commerce identifiers
Confidence: high
Scope-risk: narrow
Tested: pnpm separation
```
