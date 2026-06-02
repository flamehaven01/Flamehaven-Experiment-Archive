# TOE-TEST-0052 Comparison Note
## 2025/2026 Policy-Era Replay Comparison

This note records the replay drift observed for `TOE-TEST-0052` when the same manually encoded `subject` and `report_text` are passed through different SPAR policy surfaces.

The `2025/2026` labels below are era labels, not exact git timestamps. The published historical artifact does not pin the exact TOE or SPAR commit that produced the original `73`-point result. What *is* pinned is the published JSON snapshot and the current replay outputs collected on `2026-06-02`.

---

## Scope

- The comparison holds the **input subject constant**.
- The comparison holds the **report_text constant**.
- The comparison does **not** re-harvest the original LinkedIn discussion corpus.
- Therefore this is a **review-policy comparison**, not a fresh computational experiment.

---

## Side-by-Side Table

| Surface | Era label | Entry path | Gate input | SPAR verdict | Score | Interpretation |
| --- | --- | --- | --- | --- | --- | --- |
| Historical ledger snapshot | 2025/early-2026 archive era | Published `internal_data.json` snapshot | `REJECTED` | `MINOR REVISION` | `73` | The version that originally shipped in the EQA card. Strongly penalizes claim drift and scope overreach. |
| Current TOE legacy replay | 2026 replay | `toe.spar.run_spar -> _run_spar_legacy` | `REJECTED` | `MINOR REVISION` | `76` | Similar policy family, slightly softer scoring, but still rejects the universality framing. |
| Current external toe-spar replay | 2026 replay | `spar-framework` / external `toe-spar` runtime | `REJECTED` | `ACCEPT` | `98` | Much more permissive policy surface for the same manually encoded review subject. |

---

## What Stayed Constant

The replay used the same manually prepared review payload:

- `hypothesis_id = pedagogical-hierarchy-gte`
- `sidrce_omega = 0.697`
- `sr9_score = 0.549`
- `di2_score = 0.548`
- `gate = REJECTED`
- The same bounded critique text describing the GTE as mathematically coherent but pedagogically overclaimed

This means the score drift is not explained by new physics output. It is explained by **review-policy drift** across SPAR surfaces and calibration states.

---

## What Changed

### 1. Historical archive -> current TOE legacy replay

The result moved from `73` to `76`, while keeping the verdict family at `MINOR REVISION`.

This is consistent with:

- minor calibration adjustments
- softened scoring language
- policy-layer updates that still preserve the same broad conclusion

In other words, the modern TOE legacy path still reads the claim as overstated, but does so slightly less harshly than the historical archived state.

### 2. Current TOE legacy replay -> current external toe-spar replay

The result moved from `76 / MINOR REVISION` to `98 / ACCEPT`.

This is a much larger change. It shows that the external `toe-spar` surface now treats the same input as admissible under a materially looser or differently weighted review policy.

The important implication is not that one number is automatically "correct." The implication is that `TOE-TEST-0052` is **framework-sensitive**:

- same input
- same criticism text
- different policy surface
- different verdict

---

## Result Classification

`TOE-TEST-0052` should therefore be read as:

- a **human-authored review session**
- a **manual subject encoding**
- a **framework-sensitive review artifact**

It should **not** be read as:

- a frozen computational experiment
- an end-to-end TOE physics verification run
- a single stable verdict that survives SPAR version drift unchanged

---

## Operational Reading for the Ledger

When rendered in the public ledger, `TOE-TEST-0052` should be interpreted as:

1. the preserved historical record of what the early 0052 card published
2. a demonstration that SPAR policy drift can change verdicts on the same encoded subject
3. a reason to separate `historical snapshot`, `current TOE legacy replay`, and `current external toe-spar replay`

That separation is the honest replacement for pretending that the original `73` was timeless.
