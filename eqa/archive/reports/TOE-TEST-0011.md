# TOE-TEST-0011: Fisher-Information Ageing Sidecar

**Date**: 2026-04-02  
**Engine**: Flamehaven-TOE v4.10.0  
**Source basis**: Hale, Cánez, and Michaels (2025) via the quantum-biology integration dossier  
**Method**: sidecar mathematical-model implementation + regression verification  
**Purpose**: Add a first information-geometric ageing diagnostic to TOE without altering the existing string-vacuum core.

---

## 0. Executive Summary

A Fisher-information ageing sidecar has been implemented as a two-state
cooperation/competition model. The sidecar does not claim that ageing is a
quantum-computational process. Instead, it formalizes one safe part of the
source dossier: ageing as an information-geometric trajectory with measurable
transition sharpness.

### Result

| Component | Status | Verdict |
|---|---|---|
| Mathematical model | Implemented | PASS |
| Unit tests | Added and passing | PASS |
| API endpoint | Added and passing | PASS |
| Core string-vacuum gate isolation | Preserved | PASS |

**Decision**: Fisher-information ageing is accepted as a TOE sidecar analysis
module and explicitly excluded from the string-vacuum PASS/FAIL gate.

---

## 1. Model Definition

The sidecar tracks a cooperative / healthy fraction `p(t)` and a damaged /
competitive fraction `1 - p(t)` with time-dependent rates:

```text
lambda_loss(t)   = competition_rate * exp(ageing_rate * t)
lambda_repair(t) = repair_rate * exp(-resilience * t)
dp/dt            = -lambda_loss(t) * p + lambda_repair(t) * (1 - p)
```

The information-geometric observable is the Bernoulli-trajectory Fisher
information:

```text
I(t) = (dp/dt)^2 / (p(t) * (1 - p(t)))
```

Interpretation used here:

- high `I(t)` = sharp transition in the ageing trajectory
- `transition_time` = first time where `p(t) < 0.5`
- `cumulative_information_length = integral sqrt(I(t)) dt`

This is a diagnostic geometry, not a mechanistic claim about consciousness or
quantum computation.

---

## 2. Implementation Surface

### Added module

- `src/toe/analysis/ageing_fisher.py`

### Added API endpoint

- `POST /api/fisher_ageing`

### Output surface

- cooperation trajectory
- damage trajectory
- loss / repair rate paths
- Fisher-information trajectory
- `peak_fisher`
- `peak_fisher_time`
- `transition_time`
- `regime`

---

## 3. Verification Cases

### Case A — Healthy ageing regime

Parameters:

```text
p0=0.9
competition_rate=0.015
repair_rate=0.1
ageing_rate=0.015
resilience=0.09
```

Observed:

- `regime = healthy_ageing`
- no crossing below `p=0.5`
- final cooperation remains above 0.5

### Case B — Ageing-dominant regime

Parameters:

```text
p0=0.9
competition_rate=0.05
repair_rate=0.04
ageing_rate=0.08
resilience=0.05
```

Observed:

- `regime = ageing_dominant`
- `transition_time ~= 9.59`
- final cooperation collapses below 0.2

### Case C — Pressure comparison

Mild and harsh parameter sets were compared. Harsh pressure produced:

- lower final cooperation
- higher peak Fisher information

This confirms the sidecar responds monotonically to stronger competition /
weaker repair.

---

## 4. Regression Evidence

Executed verification:

- `tests/unit/test_ageing_fisher.py`
- `tests/integration/test_api_e2e.py -k fisher_ageing`

Observed:

- unit tests pass
- API endpoint returns stable JSON contract
- default API regression remains intact

This is sufficient evidence for first-stage sidecar admission.

---

## 5. Scope Discipline

This module does **not** claim:

- a quantum theory of ageing
- an epigenetic-clock replacement
- organism-scale causality proof
- any modification to the TOE core physics verifier

It is a mathematically explicit **information-geometry sidecar** motivated by
the dossier's safer claims.

---

## 6. Next Steps

1. Add a compact `docs/` note for biological sidecars
2. Add optional comparative endpoint combining Waddington and Fisher sidecars
3. If needed later, connect this layer to statistical-biology modules
4. Keep consciousness and whole-life quantum-computer claims outside the core

---

**Conclusion**: `TOE-TEST-0011` confirms that Fisher-information ageing can be
added to Flamehaven-TOE as a valid sidecar mathematical analysis without
contaminating the existing physics verification contracts.
