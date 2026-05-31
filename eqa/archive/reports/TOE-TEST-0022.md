# TOE-TEST-0022 -- Literature-Grounded Calibration Anchoring

**Engine**: Flamehaven-TOE v4.10.0  
**Date**: 2026-04-02  
**Scope**: Calibration anchoring + SPAR extension  
**Result**: PASS  
**Grade**: A

---

## 1. Objective

Strengthen the protein bio-quantum branch without pretending that heuristic
coefficients are direct experimental constants.

This step introduced bounded literature-grounded anchor windows for the current
protein architecture profiles and carried those anchors through:

- architecture calibration
- protein spin-qubit forward simulation
- inverse-fit candidate ranking
- SPAR sidecar review
- API / frontend exposure

---

## 2. Rationale

After TOE-TEST-0021, the branch had governance metadata but still lacked a
numerical answer to a practical question:

> "Are the current calibration coefficients still inside their own admissible
> anchor regime?"

The patch therefore added a bounded alignment layer instead of claiming direct
experimental calibration.

---

## 3. Implemented Components

### 3.1 Calibration anchor windows

Patched module:

- `src/toe/bio_quantum/protein_architecture.py`

Added:

- `CalibrationAnchorRange`
- `CalibrationGroundingAssessment`
- profile-specific anchor sets
- `assess_calibration_grounding()`
- `list_calibration_grounding_profiles()`

Each profile now has bounded windows for key coefficients such as:

- `frequency_scale`
- `rabi_scale`
- `readout_gain`
- `decoherence_bias`

### 3.2 Forward-path grounding

Patched modules:

- `src/toe/bio_quantum/protein_architecture.py`
- `src/toe/bio_quantum/protein_spin_qubit.py`

`ProteinArchitectureCalibration` now carries `literature_grounding`, including:

- alignment score
- in-range count
- anchor verdict
- anchored metric definitions

### 3.3 Inverse-fit grounding

Patched module:

- `src/toe/bio_quantum/protein_spin_qubit.py`

Inverse-fit tuning now recomputes the anchor alignment after applying tuning
multipliers, so the best candidate is not only "good numerically" but also
tracked relative to the current anchor windows.

### 3.4 SPAR extension

Patched module:

- `src/toe/spar/bio_sidecar_review.py`

New checks:

- `P7 literature grounding alignment`
- `I6 anchor alignment`

### 3.5 API / frontend exposure

Patched modules:

- `src/toe/api/routers/physics.py`
- `dashboard/src/app/page.tsx`

New endpoint:

- `GET /api/protein_calibration_grounding`

The dashboard now shows anchor alignment for both:

- protein forward simulation
- inverse-fit best candidate

---

## 4. Verification

Targeted suite:

- protein architecture
- protein spin-qubit
- protein inverse-fit
- biological SPAR review
- API E2E

Result:

- `19 passed, 35 deselected in 9.71s`

Frontend:

- `npm run build` -> PASS

---

## 5. Findings

### 5.1 Current alignment state

All three current architecture profiles land inside their bounded anchor
windows under the present calibration formulas.

This yields:

- alignment score = `1.0`
- verdict = `anchored`

for the default untuned calibration state.

### 5.2 Interpretation boundary

This does **not** mean:

- experimentally measured Hamiltonian coefficients
- direct lab calibration
- proof that the biological model is physically realized

It means only:

- the current coefficient table is internally consistent with the current
  admissible anchor windows
- inverse-fit winners can now be screened for leaving those windows

---

## 6. Verdict

`TOE-TEST-0022` closes the immediate interpretability gap in the protein
calibration branch. The protein bridge now distinguishes:

- evidence metadata
- governance metadata
- anchor-window alignment

without collapsing any of these into a false claim of direct experimental
measurement.
