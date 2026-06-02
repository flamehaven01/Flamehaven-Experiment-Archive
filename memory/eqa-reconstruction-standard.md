# EQA Reconstruction Standard

This standard governs the reconstruction of the EQA archive (`TOE-TEST-0001~0051`) from source evidence into a non-slop public ledger.

It exists because the current archive mixes four layers that must be separated:

1. `preset` calculation core that produces real deterministic physics outputs
2. natural-language to preset parsing, which is useful for intake but not safe as evidence
3. Markdown reports that may overstate independence, novelty, or scientific strength
4. portal/ledger UI that may amplify trust through presentation alone

The reconstruction goal is not "make 51 reports look cleaner." The goal is:

- preserve real deterministic outputs
- remove parser and narrative ambiguity from the evidence path
- expose errata, open gaps, and run reuse honestly
- publish only claims that are matched by auditable artifacts

## 1. Governing Principle

Every reconstructed EQA run must be publishable as:

`reproducible computation + bounded claim + explicit limitations`

The following are prohibited as default archive framing unless independently justified inside the run artifact:

- "first systematic"
- "breakthrough"
- "proof"
- "narrative-immune"
- "paper-grade"
- "confirmed theorem"
- any claim of independent run count that ignores preset reuse or mechanism reuse

## 2. Run-Type Declaration

Every archive record must declare exactly one primary type.

| Type | Meaning | Allowed headline claim |
|---|---|---|
| `reproduction` | Re-runs a known preset / known result and confirms deterministic output | "Reproduces engine output for preset X" |
| `robustness` | Varies parameters or environment around a known preset | "Tests stability of preset X under bounded variation" |
| `adversarial` | Tests whether narrative framing diverges from computed outcome | "Compares language framing against computed gate" |
| `open_gap_probe` | Exercises a known incomplete area | "Documents behavior in a known open-gap region" |
| `non_run_artifact` | Governance, integration, regression, or evidence-contract artifact that is archived with EQA materials but is not itself a verification run | "Records a governance / integration / regression decision tied to EQA history" |

Secondary tags are allowed, but the primary type must be singular.

`independent verification`, `novel discovery`, and `theory confirmation` are not valid default types.

`non_run_artifact` records must not be counted as verification runs in archive summaries.

## 3. Canonical Evidence Path

The public ledger evidence path must be:

`canonical preset/params -> deterministic engine execution -> raw physics/result artifact -> derived public report`

The following evidence path is forbidden for publication:

`natural-language prompt -> parser inference -> public verdict`

Natural-language parsing may remain available for exploratory or intake tooling, but parser output is not canonical archive evidence.

## 4. Reproduction Receipt

Every reconstructed run must include a `reproduction_receipt`.

Minimum required fields:

```json
{
  "run_id": "TOE-TEST-0001",
  "run_type": "reproduction",
  "source_repo": "Flamehaven-TOE",
  "source_git_sha": "<commit>",
  "engine_entrypoint": "toe.engine.background.run_background_verify",
  "preset": "schwarzschild",
  "params": {},
  "command": "python -c \"...run_background_verify('schwarzschild')...\"",
  "output_hash_sha256": "<hash>",
  "generated_at_utc": "2026-06-02T00:00:00Z"
}
```

Required semantics:

- `preset` and `params` must be explicit
- `source_git_sha` must pin the exact engine version
- `command` must be sufficient to reproduce the result locally
- `output_hash_sha256` must hash the canonical raw output artifact, not the prose report
- the hashed artifact must be canonicalized first: sorted keys, stable field order, and normalized float rounding rules documented with the receipt

If a run cannot produce a reproduction receipt, it cannot be marked `Verified`.

## 5. Canonical Artifact Shape

Every reconstructed run must publish a machine-readable canonical artifact before any prose report is derived.

The example below is illustrative only. Real values must come from the canonical execution artifact referenced by the reproduction receipt.

Minimum shape:

```json
{
  "run_id": "TOE-TEST-0001",
  "run_type": "reproduction",
  "preset": "schwarzschild",
  "params": {},
  "physics": {
    "gate": "PASS",
    "sidrce_omega": 0.998545,
    "sidrce_sqrt_jsd": 0.000087,
    "ricci_norm": 0.000000021,
    "beta_status": "pass",
    "beta_G_norm": 0.000000021,
    "beta_B_norm": 0.0,
    "beta_Phi_norm": 0.000000001
  },
  "provenance": {
    "source_git_sha": "<commit>",
    "engine_entrypoint": "toe.engine.background.run_background_verify",
    "reproduction_receipt_path": "./receipts/TOE-TEST-0001.json"
  },
  "limitations": [
    "known_open_gap:C11",
    "parser_not_used_for_canonical_verdict"
  ],
  "errata": []
}
```

The public Markdown report must be mechanically derivable from this artifact plus explicitly curated notes.

## 6. Parser Rule

The natural-language parser is classified as:

`non-canonical auxiliary intake`

Therefore:

- parser output may be shown only as `Derived`
- parser output may not directly determine archive verdict labels
- parser collisions, fall-through, or keyword misses must be logged as errata or parser findings
- if a historical run depended on parser behavior, the reconstructed record must say so explicitly

Historical examples such as preset collision or keyword collapse are not to be hidden. They are part of the record.

## 7. UI Status Model

The archive must stop using presentation-only `PASS` semantics for report presence.

Allowed public status labels are:

| Status | Meaning |
|---|---|
| `Verified` | Canonical artifact + reproduction receipt + source SHA present |
| `Imported` | Historical source imported, but not yet rebuilt to canonical artifact standard |
| `Derived` | Produced from parser/intake/report transformation, not canonical source evidence |
| `Unverified` | Evidence incomplete or unverifiable from current source state |
| `Errata` | Historical record has a documented correction, collision, or limitation that materially affects interpretation |

Rules:

- file presence must not be shown as `PASS`
- report attachment must not be shown as `integrity pass`
- `Errata` must be visually first-class, not buried in prose

## 8. Count and Headline Rule

The archive must not headline itself as `51 independent verifications`.

Instead, counts must be expressed as:

- total records
- verification runs (excluding `non_run_artifact`)
- distinct presets
- distinct mechanisms
- reuse groups
- run-type counts

Example:

`51 historical records; 48 verification runs; <distinct preset families from manifest>; <run types present>; reuse groups disclosed inline`

If multiple rows reuse the same preset/mechanism, that reuse must be stated directly in the archive view.

## 9. Claim Discipline

A run may claim only one of the following, depending on evidence:

- deterministic reproduction
- bounded robustness
- narrative-vs-computation divergence
- documented open-gap behavior

A run may not claim:

- global theory validation
- scientific novelty beyond the artifact
- theorem confirmation beyond cited and reproduced scope
- independence that is not supported by distinct computation paths

## 10. Errata and Open-Gap Exposure

Every reconstructed run must surface:

- known errata
- known open gaps
- known parser issues
- known reuse / non-independence

Errata must be attached to the run page and archive list entry, not kept only in CHANGELOG or side documentation.

If source materials contain both an original claim and a later correction, both must be shown, with the correction taking precedence in the public interpretation layer.

## 11. Migration Policy for 0001~0051

Reconstruction must proceed in phases.

### Phase 1: High-risk records

Start with runs where one or more of the following are true:

- known errata exists
- parser collision is documented
- repeated preset use is hidden by narrative framing
- public archive currently overstates independence or grade

Initial order:

1. `TOE-TEST-0001`
2. `TOE-TEST-0002`
3. `TOE-TEST-0003`
4. `TOE-TEST-0004`
5. `TOE-TEST-0005`

### Phase 2: Archive-wide status correction

Before all 51 runs are rebuilt, the UI must already:

- downgrade presentation-only `PASS` badges
- expose `Imported` and `Errata`
- avoid independence/count overclaim

### Phase 3: Canonical rebuild

For each run:

1. identify canonical preset / params / mechanism group
2. generate canonical artifact
3. generate reproduction receipt
4. attach errata/open-gap metadata
5. derive public Markdown from the artifact
6. publish `Verified` only if all required provenance fields exist

## 12. Minimum Publish Checklist

A reconstructed run is publishable only if all checks pass:

- primary run type declared
- canonical artifact present
- reproduction receipt present
- source git SHA present
- preset and params explicit
- historical errata surfaced if applicable
- parser not used as canonical verdict source
- reuse / non-independence disclosed if applicable
- UI status set from evidence class, not presentation

If any item fails, the run remains `Imported`, `Derived`, or `Unverified`.

## 13. Success Condition

The EQA archive is considered reconstructed when:

- every public claim is traceable to a canonical artifact
- every verified run has a reproduction receipt
- parser output is no longer mistaken for canonical evidence
- errata are visible at the point of use
- the archive no longer overclaims independence, novelty, or scientific strength

This standard prefers auditable restraint over persuasive narration.
