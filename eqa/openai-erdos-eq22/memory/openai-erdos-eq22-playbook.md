# MICA Playbook: OpenAI Erdős Eq. (2.2) Executable Verification

This playbook governs the execution, maintenance, and verification of the OpenAI Erdős unit-distance disproof Equation (2.2) reproduction artifact.

## 1. Operating Rules & Governance
- **Numerical Guard**: Standard `float64` is strictly banned for Equation (2.2) calculations. The verifier script must invoke `mpmath` with 200-bit arbitrary precision.
- **Evidence Integrity**: Never modify `reports/verification_result.json` manually. It must be generated programmatically by the verifier script passing `--write-evidence`.
- **Manifest Locking**: The SHA-256 hashes of all source modules (`sawin_multiquadratic.py`, `genus_class_field.py`, etc.) are cryptographically locked in the verification JSON to prevent silent tampering.

## 2. Playbook Steps (Verification Path)
1. Clone the repository and install development dependencies:
   ```bash
   git clone https://github.com/Flamehaven-Labs/openai-erdos-eq22-reproduction
   cd openai-erdos-eq22-reproduction
   pip install -e ".[dev]"
   ```
2. Run the 60 unit tests to ensure internal mathematical correctness:
   ```bash
   pytest -q
   ```
3. Run the end-to-end verifier script to compute the exponent excess:
   ```bash
   python -m erdos_ant.verify
   ```
4. Verify the numerical results match the published proof:
   - Computed excess: `6.2391e-38`
   - Published excess: `6.24e-38`
   - Relative error: `~0.014%` (must be within `0.1%` tolerance limit).
