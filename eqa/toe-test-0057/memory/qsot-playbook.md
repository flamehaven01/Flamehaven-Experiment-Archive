# MICA Playbook: QSOT Compiler v1.2.3 Verification

This playbook governs the execution, maintenance, and verification of the QSOT Compiler v1.2.3 verification artifact.

## 1. Operating Rules & Governance
* **Claim Boundaries**: All computed metrics must carry `ADVISORY-HEURISTIC` provenance markers. The system must never assert direct physical verification of macroscopic general relativity or quantum gravity.
* **Axiom Strictness**: The temporal-state axioms (linearity, trace preservation) must be verified at every step of the simulation.

## 2. Playbook Steps (Verification Path)
1. Install dependencies and activate virtual environment:
   ```bash
   cd D:\Sanctum\Flamehaven-Labs\QSOT_Compiler_V1\qsot_compiler
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. Execute the verification sweep script:
   ```bash
   python scripts/asdp_run.py --rho0 config/rho0.json --channels config/channels.json --velocity 0.1 --outdir test_artifacts
   ```
3. Verify the outputs match the canonical bounds inside `test_artifacts/`:
   - Linearity deviation: $< 3 \times 10^{-16}$
   - Average coherence: $\approx 0.70205$
   - Negativity / Non-Markovianity: exactly $0.0$
