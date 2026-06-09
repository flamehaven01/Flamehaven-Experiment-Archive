# TOE-TEST-0057 Verification Note

**Target**: `QSOT Compiler V1/V2/V2.1 multiphase verification`  
**Canonical run id**: `toe-test-0057`  
**Legacy alias**: `qsot-compiler`, `qsot-v2-1`

---

## Executive Read

`0057` is a verified execution and audit record for the QSOT (Quantum State Over Time) Compiler v1/v2/v2.1 codebase. 

While the software features extreme operational rigor and implements complex math (Transfer Tensor Method, Bloch sphere optimizations, and Rust vector databases), the underlying physical model is classified as a **"High-Formality, Fake Physics Slop Artifact"**:

* **High Formality**: Implements an 8-phase verification pipeline containing 50 sequential PASS/FAIL checks, cryptographic trace chaining, and a compiled Rust sidecar subprocess exchange.
* **Fake Physics / Slop**: The mapping from macroscopic spacetime metrics (Schwarzschild, de Sitter, Eguchi-Hanson) to a microscopic *single-qubit* quantum noise channel has zero theoretical physical justification. It utilizes heavy general relativity jargon ("Ricci-flat vacuums", "BRST proxy anomalies", "closed timelike curves") to wrap a standard toy noise simulation.

---

## What Was Verified

* **Temporal-State Axioms (Phase 0)**: Linearity, CPTP completeness, trace preservation, and density matrix validity verified within a floating-point tolerance of $5 \times 10^{-16}$.
* **Curvature-Induced Purity Decay (Phases 1-2)**: Purity decays for Schwarzschild ($0.9994$), de Sitter ($0.6360$), AdS5 ($0.6776$), and Eguchi-Hanson ($0.9988$) backgrounds.
* **Observer Velocity Dilation (Phase 3)**: Acceleration of purity decay under observer boosts ($v = 0.5c$) yielding a combined total relativistic factor of $\gamma_{total} \approx 1.1547$.
* **Kirkwood-Dirac Negativity (Phase 4)**: Finding optimal basis angles using PyTorch gradient descent, yielding contextuality proxies of $-0.1234$ (flat) and $-0.0119$ (de Sitter).
* **Non-Markovianity Measure (Phase 5)**: Detection of environmental memory backflow ($NM \approx 0.001413$) using the Transfer Tensor Method (TTM).
* **Rust Sidecar Subprocess (Phase 6)**: Subprocess execution of the compiled `turbovec` sidecar, successfully ingesting 10 vector database scores with quantization errors within the bound of $0.0236$.
* **Scientific Audit (Phase 7)**: Enforcement of hardcoded compliance gates that accept flat/Schwarzschild/AdS5 but flag or reject de Sitter, Gödel, and Eguchi-Hanson.

---

## What Was Not Claimed

* **No Physical Reality**: No claim that the single-qubit channel mapping represents actual physical quantum gravity or relativistic quantum information dynamics in real general relativity.
* **No First-Principles Derivation**: The metric-to-channel ansatz is a phenomenological toy model with a free calibration parameter $\alpha$ (sensitivity) adjusted to fit numerical bounds.
* **No Dynamic Physics Gating**: The "scientific audit" rejection of Gödel and Eguchi-Hanson backgrounds is driven by hardcoded logical flags rather than real dynamical physical constraints.

---

## Reading Rule

Read `0057` as a **high-formality execution wrapper around a toy simulation**:

* **Mathematically Valid**: The 2x2 matrix algebra, optimizations, and TTM reconstructions are numerically correct and reproducible.
* **Physically Groundless**: The physics nomenclature serves as an aesthetic and semantic wrapper for a standard single-qubit damping simulation.
* **Auditing Posture**: All internal metrics (such as purity, entropy, and KD negativity) are labeled `ADVISORY-HEURISTIC` and carry no external scientific authority.
