# MICA Playbook: QSOT Compiler Multiphase Verification

This playbook governs the execution, maintenance, and verification of the QSOT Compiler V1/V2/V2.1 multiphase verification artifact.

## 1. Operating Rules & Governance
* **Claim Boundaries**: All computed metrics must carry `ADVISORY-HEURISTIC` provenance markers. The system must never assert direct physical verification of macroscopic general relativity or quantum gravity.
* **Mathematical Locks**: The density matrix validator must enforce unit trace, Hermiticity, and positive semi-definiteness within a tolerance of $10^{-8}$. Any violation of Phase 0 axioms must immediately reject the execution run.
* **Axiom Strictness**: The temporal-state axioms (linearity, CPTP completeness, trace preservation) must be verified at every step of the simulation sweep.

## 2. Playbook Steps (Verification Path)
1. Install dependencies and activate virtual environment:
   ```bash
   cd D:\Sanctum\Flamehaven-Labs\QSOT_Compiler_V2
   uv venv
   .venv\Scripts\activate
   uv pip install -e .
   ```
2. Execute the test suite using pytest to ensure all 47 tests pass with >90% coverage:
   ```bash
   pytest --cov=qsot_v2 tests/
   ```
3. Run the experiment sweep using the CLI to generate `result.json` and `report.md`:
   ```bash
   python run_experiment.py --config experiment.yaml
   ```
4. Verify the outputs match the canonical bounds:
   - Linearity deviation: $< 5 \times 10^{-16}$
   - Schwarzschild purity: $\approx 0.9994$
   - de Sitter purity: $\approx 0.6360$
   - Kirkwood-Dirac negativity (flat): $\approx -0.1234$
   - Non-Markovianity measure (de Sitter): $\approx 0.001413$
5. Copy the generated `reports/result.json` to the ledger repository:
   ```bash
   copy reports\result.json D:\Sanctum\flamehaven-audit-reports\eqa\toe-test-0057\verification_result.json
   ```
