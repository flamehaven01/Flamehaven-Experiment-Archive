# Flamehaven Ledger Sanitizer

OPSEC / PII guard for the public verification ledger. Scrubs local-workspace
absolute paths and locale tokens from published files (information-disclosure
patch). Engine skeleton adapted from [AI-SLOP-DETECTOR] autofix
(`FixChange` / `FixResult` / `_register` pattern).

## Usage

```bash
python sanitizer/sanitize_ledger.py            # dry-run report (no writes)
python sanitizer/sanitize_ledger.py --apply     # rewrite files in place
```

Exit code is non-zero on a dry-run that still finds leaks — suitable as a
pre-commit / CI gate.

## What it does

| Rule | Action |
|---|---|
| `abs_path_collapse` | Drive/home path with a workspace marker (`Sanctum`, `STRUCTURA`, `Users/dream`) → `[workspace]/<basename>` (or `[workspace]` if the path is the workspace root). |
| `hangul_redact` | Any Korean (Hangul) run → `[redacted]`. |

**Marker-gated:** only tokens carrying a workspace marker are rewritten. Public
URLs (`https://…`), relative paths (`./…`), and code are left untouched, and
JSON stays valid (verified by re-parse).

## Governance

Behaviour is governed by `mica.yaml` + `sanitizer.mica.archive.json`
(DI-SAN-001…004). Run before any commit that touches published experiment data.

## Limitation

Binary artifacts (`.pdf`) cannot be text-sanitized; a leaking binary must be
regenerated from sanitized source or removed (DI-SAN-004). It also does **not**
rewrite git history — already-pushed commits retain the original bytes; a
history rewrite (git filter-repo / BFG) is a separate, deliberate action.

[AI-SLOP-DETECTOR]: internal tooling — engine pattern reused under adaptation.
