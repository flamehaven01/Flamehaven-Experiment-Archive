# TOE-TEST-0041 -- Flamehaven-TOE Meta Verify Layer

## Scope

This entry records the first change-aware verification layer added on top of
plain pytest for `Flamehaven-TOE`.

## What changed

- Added `toe.testing.meta_verify`
- Added `toe-meta` CLI entry
- Added compact delta manifest at `.toe-meta/last_delta_manifest.json`
- Added bounded selection rules from changed paths to affected TOE surfaces and
  required pytest files
- Added optional `dfi-zenith` preflight ingestion with degrade-to-heuristic
  behavior

## Why it matters

Plain pytest remains the authoritative verifier, but it is intentionally
blind to which parts of the repository changed. The meta-verify layer narrows
day-to-day execution by selecting a bounded subset first, then defers to full
pytest suites for release-grade assurance.

## Current guarantees

- Smoke tests are always retained in the selected subset
- API, SPAR, bio-governance, protein-sidecar, and report changes map to
  dedicated pytest files
- The manifest records:
  - changed paths
  - affected surfaces
  - risk level and risk reasons
  - artifact fingerprints
  - required tests
  - skipped tests
  - optional zenith preflight

## Scope note

This is not a replacement for `smoke/default/slow/release`. It is a bounded
selector for routine development and governance logging.
