# TOE-TEST-0013: Biological Frontend, SPAR Admissibility, and Bio-Quantum Bridges

**Date**: 2026-04-02  
**Engine**: Flamehaven-TOE v4.10.0  
**Method**: frontend/API wiring + SPAR extension + bridge-registry implementation  
**Purpose**: Close the loop from biological sidecars to frontend exposure, add a minimal SPAR-aware biological admissibility check, and diagnose which biological claims can genuinely connect to TOE's existing quantum stack.

---

## 0. Executive Summary

This phase does not introduce a new biological physics claim into the TOE core
gate. It does three narrower and more defensible things:

1. exposes the biological sidecars and governance surfaces in the dashboard
2. adds an optional biological admissibility check to SPAR
3. records a machine-readable registry of bio-quantum bridge opportunities and missing links

### Result

| Component | Status | Verdict |
|---|---|---|
| Biological frontend category | Implemented | PASS |
| End-to-end API wiring | Implemented | PASS |
| SPAR biological admissibility supplement | Implemented | PASS |
| Bio-quantum bridge diagnosis registry | Implemented | PASS |

**Decision**: biological sidecars are now exposed end-to-end, and the strongest
current TOE quantum bridge is engineered protein spin qubits rather than
organism-scale quantum-computer rhetoric.

---

## 1. Scope

This report covers:

- dashboard Analysis-tab exposure for Waddington and Fisher sidecars
- dashboard exposure for evidence-contract review
- dashboard exposure for bio-quantum bridge diagnosis
- a new `GET /api/bio_quantum_links` API surface
- an optional SPAR Layer B biological admissibility check

This report does **not** claim:

- that life is already a verified room-temperature quantum computer
- that Orch OR has become admissible as a TOE contract
- that a complete multi-site biological quantum Hamiltonian has been implemented

---

## 2. Implementation Surface

### Added backend bridge layer

- `src/toe/bio_quantum/bridges.py`

### Added API

- `GET /api/bio_quantum_links`

### SPAR extension

- optional Layer B biological evidence-contract check (`B5`) when report text
  clearly matches a biological claim family

### Frontend

- Analysis-tab biological category for:
  - Waddington sidecar
  - Fisher ageing sidecar
  - evidence-contract review
  - bio-quantum bridge diagnosis

---

## 3. Main Diagnosis

### Strongest current bridge

`protein_spin_qubit -> toe.quantum.engine + toe.quantum.compiler`

This is the cleanest match because TOE already has:

- single-qubit density-matrix evolution
- Kraus-channel application
- coherence / entropy profiling
- traceable audit output

What is missing is not the quantum substrate but the experimental adapter:

- protein-specific Hamiltonian
- control pulse model
- ODMR readout mapping

### Partial bridges

- `tryptophan_superradiance`
  - current fit: channel evolution + memory-kernel tracing
  - missing link: multi-site excitonic Hamiltonian and collective emission model

- `ferrell_waddington`
  - current fit: control landscape intuition
  - missing link: state-to-channel map `x(t) -> Kraus parameters`

- `fisher_ageing`
  - current fit: information geometry
  - missing link: biological trajectory -> density-matrix / measurement map

### Weak bridge

- `biological_capacity_bound`
  - useful as a governance prior
  - weak as a direct quantum-engine link without a shared operational task definition

---

## 4. Newly Clarified Missing Link

The dominant shared gap is now explicit:

> **bio-state to quantum-channel readout map**

This is the missing mathematical connector between:

- biological dynamics (`x(t)`, `p(t)`, excitonic occupancy, sensor state)
- TOE quantum machinery (density matrices, channels, coherence, audit traces)

This gap appears in multiple biological candidates, which means it is not an
implementation accident. It is the next genuine model-building target.

---

## 5. Emergent Candidate Models

The bridge registry surfaced three candidate model families worth future work:

1. **Protein ODMR decoherence witness over biological microenvironment**
2. **Attractor-controlled decoherence switching**
3. **Classical-to-quantum Fisher ageing witness**

These are stronger and more specific than the rejected headline claim
"life is a quantum computer."

---

## 6. Verification

Executed:

- `tests/unit/test_bio_quantum_bridges.py`
- `tests/unit/test_spar_engine.py` biological-addition subset
- `tests/integration/test_api_e2e.py` biological endpoint subset
- frontend production build

Observed:

- backend biological routes remained green
- SPAR adds `B5` only when a biological claim is actually matched
- frontend compiles successfully with the new biological category

---

## 7. Conclusion

TOE-TEST-0013 confirms that the biological sidecar family is now:

- visible in the frontend
- reachable end-to-end through the API
- constrained by a SPAR-adjacent admissibility layer
- connected to the TOE quantum stack through a machine-readable bridge registry

The strongest real bridge is **engineered protein spin qubits**. The main
shared missing link is a **bio-state to quantum-channel readout map**. That is
the next mathematically meaningful target.
