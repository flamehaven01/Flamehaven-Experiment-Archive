# TOE-TEST-0021 -- Biological Governance Patch

**Engine**: Flamehaven-TOE v4.10.0  
**Date**: 2026-04-02  
**Scope**: Governance-layer implementation  
**Result**: PASS  
**Grade**: A

---

## 1. Objective

Close the governance gap that remained after protein calibration and inverse-fit.
The target was not a new physics module but a traceable control layer for
biological sidecars and speculative bridges.

This patch covered three prerequisite normalizations plus the actual governance
implementation:

1. Common provenance schema
2. Claim-tier registry
3. Golden-source document registry
4. Inverse-fit session logging
5. Tiered SPAR review budgets
6. Adapter approval / degrade policy

---

## 2. Why This Was Needed

The strongest failure mode in the biological expansion was not numerical error.
It was governance drift: a plausible surrogate model could be mistaken for a
directly grounded physical result.

The patch therefore targeted the following risks:

- proxy inflation
- sidecar-core contamination
- inverse-fit over-interpretation
- undocumented coefficient provenance
- silent dependence on unapproved external evidence adapters

---

## 3. Implemented Components

### 3.1 Governance core

New module:

- `src/toe/bio_quantum/governance.py`

Introduced:

- claim-tier constants
  - `core_physics`
  - `bio_sidecar`
  - `inverse_fit`
  - `speculative_bridge`
- `GoldenSourceDocument`
- `ProvenanceRecord`
- `ReviewBudget`
- `AdapterApprovalPolicy`
- `GovernanceSessionLog`

### 3.2 Golden-source registry

Registered source classes:

- quantum-biology RAG source
- TOE-TEST-0010 / 0019 / 0020
- Golden Artifacts governance references
  - PersistentShell
  - ConcurrentToolExecution
  - ContextInjection
  - MCPLifecycle
  - ThinkingBudget

### 3.3 Evidence and calibration provenance

Patched modules:

- `src/toe/bio_quantum/evidence.py`
- `src/toe/bio_quantum/protein_architecture.py`
- `src/toe/bio_quantum/protein_spin_qubit.py`

Now attached to contracts / calibrations:

- claim tier
- approval scope
- source document IDs
- provenance records

### 3.4 Inverse-fit session traceability

Patched module:

- `src/toe/bio_quantum/protein_inverse_fit.py`

New behavior:

- read-only candidate evaluation can execute in parallel
- inverse-fit returns a `session_log`
- the log records:
  - claim tier
  - review budget
  - source documents
  - adapter keys
  - execution mode

### 3.5 SPAR governance metadata

Patched modules:

- `src/toe/spar/bio_sidecar_review.py`
- `src/toe/spar/spar_engine.py`

New behavior:

- biological sidecar reviews now expose `review_budget`
- SPAR exposes `bio_review_budget`
- matched biological contracts carry tier-aware review semantics

### 3.6 API registry surface

New endpoint:

- `GET /api/bio_governance_registry`

Returned data:

- claim tiers
- golden source documents
- review budgets
- adapter policies
- timestamp

---

## 4. Verification

### 4.1 Targeted regression

Command class:

- governance
- protein architecture
- protein inverse-fit
- biological SPAR
- API E2E

Result:

- `38 passed, 113 deselected in 6.82s`

### 4.2 Frontend sanity

Build status:

- `npm run build` -> PASS

### 4.3 Scope result

This patch did **not** add a new biological physics sidecar.
It instead made existing biological sidecars and inverse-fit outputs
traceable, tiered, and governance-auditable.

---

## 5. Findings

### 5.1 What improved

- coefficient provenance is no longer implicit
- inverse-fit now has a bounded audit trail
- biological reviews now declare their own budget and scope
- external evidence adapters are no longer conceptually invisible

### 5.2 What remains open

- literature adapter is still unapproved
- dataset adapter is still unapproved
- lab-note adapter is still unapproved
- biological sidecars remain bounded sidecars, not direct experimental proofs
- multi-site protein Hamiltonians and richer readout realism remain future work

---

## 6. Verdict

`TOE-TEST-0021` closes the first real governance gap in the bio-quantum branch.
The result is not "new physics"; it is a more defensible research runtime:
sidecar claims now carry provenance, tier, budget, and adapter policy instead of
appearing as free-floating numerical outputs.
