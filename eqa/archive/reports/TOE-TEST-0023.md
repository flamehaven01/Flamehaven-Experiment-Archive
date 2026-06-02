# TOE-TEST-0023 -- Citation Mapping Layer

**Engine**: Flamehaven-TOE v4.10.0  
**Date**: 2026-04-02  
**Scope**: Governance / citation mapping  
**Result**: PASS  
**Grade**: A

> **Archive reconstruction note (2026-06-02)**: This record is a
> `non_run_artifact` of class `bio_quantum_citation_mapping`.
>
> - It maps calibration profiles to bounded citation-cluster families.
> - Exclude it from verification-run counts. This is a traceability layer for
>   sidecar interpretation, not a direct verification result.

---

## 1. Objective

Close the gap between "bounded anchor windows" and "which source family those
anchors actually belong to."

This step did not add a new physics sidecar. It added a citation-cluster layer
so architecture calibration can point to explicit source families instead of
appearing as an anonymous proxy table.

---

## 2. Implemented Components

Patched modules:

- `src/toe/bio_quantum/governance.py`
- `src/toe/bio_quantum/protein_architecture.py`
- `src/toe/api/routers/physics.py`

Added:

- `CitationCluster`
- citation-cluster registry
- profile -> citation-cluster mapping
- `citation_cluster_id` and `citation_cluster` inside calibration grounding
- citation clusters exposed through `/api/bio_governance_registry`

Current cluster families:

- `protein_readout_scaffold`
- `radical_pair_spin`
- `stress_test_minimal_sensor`
- `inverse_fit_governance`

---

## 3. Why It Matters

The problem was not numerical correctness. The problem was interpretability.

Without citation mapping, a user could see:

- calibrated coefficient
- anchor alignment
- provenance records

and still not know which source family the current anchor was supposed to
represent.

Citation clusters fix that by making the answer explicit.

---

## 4. Verification

Targeted regression:

- governance registry
- protein architecture grounding
- API registry exposure

Result:

- `10 passed, 41 deselected in 6.84s`

Frontend:

- `npm run build` -> PASS

---

## 5. Result

The biological calibration branch now distinguishes all of the following:

- evidence metadata
- provenance records
- governance budget
- anchor-window alignment
- citation-cluster family

This is still not a direct literature adapter. It is a bounded local mapping
layer that makes the current calibration basis auditable and legible.
