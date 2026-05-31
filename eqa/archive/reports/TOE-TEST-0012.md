# TOE-TEST-0012: Biological Evidence-Contract Layer

**Date**: 2026-04-02  
**Engine**: Flamehaven-TOE v4.10.0  
**Method**: evidence-governance implementation + API regression  
**Purpose**: Convert the biological-claim admissibility logic from TOE-TEST-0010 into a machine-readable layer that can be used by API consumers, SPAR priors, and future bio-quantum modules.

---

## 0. Executive Summary

The biological evidence-contract layer is now implemented. It does not compute
physics. It governs **what kinds of claims are admissible, downgraded, or
excluded** when biological and quantum-biological material is introduced into TOE.

### Result

| Component | Status | Verdict |
|---|---|---|
| Evidence-contract registry | Implemented | PASS |
| Keyword / key-based claim review | Implemented | PASS |
| API exposure | Implemented | PASS |
| Core gate isolation | Preserved | PASS |

**Decision**: claim admissibility is now machine-readable for the biological
sidecar family.

---

## 1. Scope

The layer encodes contracts for seven claim families:

- tryptophan superradiance
- protein spin qubit / quantum sensor
- biological computational-capacity upper bound
- Ferrell/Waddington attractor dynamics
- Fisher-information ageing geometry
- Orch OR / quantum consciousness
- life as a room-temperature quantum computer

Each contract stores:

- `source_kind`
- `evidence_level`
- `admissibility`
- `scope_limit`
- `rationale`
- `excluded_claims`

---

## 2. What It Changes

This layer makes three things explicit:

1. Some claims are **implemented sidecars** (`ferrell_waddington`, `fisher_ageing`)
2. Some claims are **sidecar-only or evidence-only**
3. Some claims are **excluded**, even if they are rhetorically tempting

That prevents the biological dossier from bleeding into the current
string-vacuum verifier.

---

## 3. Implementation Surface

### Added package

- `src/toe/bio_quantum/evidence.py`

### Added API

- `GET /api/bio_evidence_contracts`
- `POST /api/bio_evidence_review`

### Example classification

Input:

```text
Life is already a room-temperature quantum computer
```

Output:

- matched contract: `life_quantum_computer`
- `admissibility = excluded`
- `evidence_level = overstated`

---

## 4. Verification

Executed:

- `tests/unit/test_bio_quantum_evidence.py`
- direct API checks for `/api/bio_evidence_contracts`
- direct API checks for `/api/bio_evidence_review`

Observed:

- registry returns 7 contracts
- excluded claims are correctly tagged
- implemented sidecars are correctly tagged
- keyword classification maps strong headline claims to the excluded contract

---

## 5. Significance

This layer is important because the biological-quantum dossier contains both:

- valid mathematical sidecar candidates
- invalid or overstated organism-scale claims

The evidence-contract registry makes that distinction executable instead of
leaving it as prose alone.

---

## 6. Next Step

Use this registry as:

1. a SPAR prior source for biological dossiers
2. an API-facing review surface
3. a governance layer for future `bio_quantum` modules

---

**Conclusion**: TOE-TEST-0012 confirms that biological claim admissibility is
now encoded as a first-class machine-readable layer, while the core TOE physics
gate remains unchanged.
