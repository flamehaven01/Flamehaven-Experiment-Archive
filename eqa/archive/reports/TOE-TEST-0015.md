# TOE-TEST-0015

**Title**: Protein Spin-Qubit Sidecar + Result-Aware Biological SPAR  
**Date**: 2026-04-02  
**Engine**: Flamehaven-TOE v4.10.0  
**Result**: PASS  
**Grade**: A

> **Archive reconstruction note (2026-06-02)**: This record is a
> `non_run_artifact` of class `bio_quantum_bridge_validation`.
>
> - It validates a sidecar bridge from biological trajectories into bounded
>   quantum-channel maps plus result-aware biological SPAR.
> - Exclude it from verification-run counts. The stable claim is an executable
>   sidecar bridge under governance, not admission into the core string-vacuum
>   verifier.

## Scope

This test closes the first executable bio-quantum bridge in Flamehaven-TOE.
The goal is not to modify the core string-vacuum verifier, but to validate that:

1. biological sidecar trajectories can be mapped into quantum-channel noise,
2. the existing TOE single-qubit stack can consume that mapping coherently,
3. biological sidecars can be reviewed by SPAR on numerical outputs rather than text alone.

## Implementation

Added components:

- `src/toe/bio_quantum/channel_map.py`
  - `map_waddington_to_dephasing(states)`
  - `map_fisher_to_depolarizing(fisher_information)`
- `src/toe/bio_quantum/protein_spin_qubit.py`
  - `analyze_protein_spin_qubit(driver="waddington" | "fisher_ageing")`
- `src/toe/spar/bio_sidecar_review.py`
  - Waddington review (`W1-W3`)
  - Fisher-ageing review (`F1-F3`)
  - Protein spin-qubit review (`P1-P3`)
- FastAPI endpoint:
  - `POST /api/protein_spin_qubit`

Frontend exposure:

- Dashboard `Analysis` tab now exposes:
  - Waddington
  - Fisher ageing
  - Protein spin-qubit
  - `spar_review` verdicts for all three

## Mathematical bridge

### Waddington -> dephasing

The attractor coordinate `x(t)` is converted to a dephasing probability through
a logistic map

`p_phi(t) = p_floor + (p_ceiling - p_floor) / (1 + exp(-s (x(t) - x_mid)))`

Interpretation:

- higher attractor activation corresponds to stronger phase noise,
- output stays bounded and immediately consumable by a Kraus channel.

### Fisher ageing -> depolarizing

The Fisher-information path `I_F(t)` is normalized and mapped to a
depolarizing probability

`p_dep(t) = p_floor + (p_ceiling - p_floor) * sqrt(I_F(t) / max I_F)`

Interpretation:

- sharper ageing transitions increase stochastic noise,
- the map remains bounded and produces a stable quantum-channel sequence.

## SPAR reinforcement

Before this step, biological governance was primarily:

- evidence-contract review,
- bridge diagnosis,
- biological Layer C gap reporting.

After this step, biological sidecars also expose a direct `spar_review` object
computed from numerical outputs:

- Waddington:
  - `W1` bistability structure
  - `W2` barrier positivity
  - `W3` trajectory settling
- Fisher ageing:
  - `F1` regime consistency
  - `F2` positive Fisher peak
  - `F3` information-length accumulation
- Protein spin-qubit:
  - `P1` decoherence monotonicity
  - `P2` ODMR contrast bounds
  - `P3` biological driver-map completeness

This keeps core physics SPAR separate while making biological sidecars less
dependent on text-only admissibility checks.

## Verification

Targeted regression:

```bash
python -m pytest -q tests/unit/test_bio_sidecar_review.py tests/unit/test_protein_spin_qubit.py tests/integration/test_api_e2e.py -k "waddington or fisher_ageing or protein_spin_qubit or bio_evidence or bio_quantum"
```

Observed result:

- `18 passed, 25 deselected`

Frontend:

```bash
cd dashboard
npm run build
```

Observed result:

- build passed

## Findings

- `protein_spin_qubit` is now the first executable biological-to-quantum bridge
  inside Flamehaven-TOE, not just a bridge-registry diagnosis.
- The strongest current mapping remains engineered / designed biological
  qubit systems, not organism-scale consciousness claims.
- The remaining missing link is still broader than this sidecar:
  a richer bio-state to quantum readout model beyond the current bounded
  dephasing / depolarizing channel maps.

## Conclusion

TOE-TEST-0015 closes the first real bio-quantum implementation loop:

- biological dynamics -> channel map,
- channel map -> TOE qubit engine,
- numerical output -> result-aware SPAR,
- API + frontend exposure -> end-to-end verification.

This does not prove a biological TOE, but it does convert a previously
diagnosed bridge into executable mathematics under governance.
