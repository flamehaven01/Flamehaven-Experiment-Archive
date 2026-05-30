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

Config-first: detectors, markers, ignore globs, and the allowlist live in
[`.sanconfig.yaml`](.sanconfig.yaml).

| Rule | Mode | Action |
|---|---|---|
| `abs_path_collapse` | fix | Drive/home path with a workspace marker (`Sanctum`, `STRUCTURA`, `Users/dream`) → `[workspace]/<basename>` (or `[workspace]` if the path is the workspace root). |
| `hangul_redact` | fix | Any Korean (Hangul) run → `[redacted]`. |
| `ipv4_address` | detect | Flags IPv4 exposure (strict octets; data files only). |
| `email_address` | detect | Flags email / PII exposure (data files only). |
| `secret_token` | detect | Flags `api_key/secret/password/token=…` assignments (not SHA-256 hashes). |

**fix** rules rewrite content; **detect** rules only report (a human reviews).
**Marker-gated:** only tokens carrying a workspace marker are rewritten. Public
URLs (`https://…`), relative paths, and code are left untouched; JSON stays valid.

## Self-calibration (DB loop)

Every run appends to `scan_history.jsonl`; `calibration.json` is derived from it
(rule frequency, recurring files, false-positive candidates). Recurring files
either signal chronic exposure (fix the source) or a stable false positive
(promote to the config `allowlist` after review). Pattern adapted from
AI-SLOP-DETECTOR self-calibration.

## Auto-activation (CI gate)

`.github/workflows/opsec-sanitize.yml` runs the dry-run on every push / PR to
`main`; any leak fails the build and blocks publication, so detection is always
active when new ledger content arrives (DI-SAN-006). The CI gate uses
`--no-history` so it never mutates the calibration DB.

## Governance

Governed by `mica.yaml` + `sanitizer.mica.archive.json` (DI-SAN-001…006). Run
before any commit that touches published experiment data.

## Limitation

Binary artifacts (`.pdf`) cannot be text-sanitized; a leaking binary must be
regenerated from sanitized source or removed (DI-SAN-004). It also does **not**
rewrite git history — already-pushed commits retain the original bytes; a
history rewrite (git filter-repo / BFG) is a separate, deliberate action.

[AI-SLOP-DETECTOR]: internal tooling — engine pattern reused under adaptation.
