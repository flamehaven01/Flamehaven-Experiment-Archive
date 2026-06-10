# TOE-TEST-0057 Verification Note

**Target**: `QSOT Compiler v1.2.3 — High-Formality, Fake Physics Slop Artifact`  
**Canonical run id**: `toe-test-0057`  
**Legacy alias**: `qsot-compiler`  
**Zenodo Record**: [10.5281/zenodo.18035432](https://zenodo.org/records/18035432)

---

## Executive Read

`0057` is a verified execution and audit record for the QSOT (Quantum State Over Time) Compiler v1.2.3 release. 

While the software features extreme operational packaging and implements standard quantum channel evolution, the underlying physical model is classified as a **"High-Formality, Fake Physics Slop Artifact"**:

* **High Formality**: Implements an automated pipeline containing Elsarticle LaTeX paper templates, Dockerized microservices, JSON state inputs, and a cryptographic trace hash-chaining mechanism to track execution steps.
* **Fake Physics / Slop**: The mapping from general relativistic metrics (such as Schwarzschild and de Sitter) to microscopic quantum channel deformations is completely ungrounded. While the papers discuss complex concepts like Kirkwood-Dirac negativity and Transfer Tensor non-Markovianity, the actual executed code outputs for these metrics evaluate to exactly `0.0`. The physics nomenclature serves solely as a high-prestige semantic wrapper around a standard single-qubit amplitude damping toy model.

---

## What Was Verified

* **Trace Preservation and Linearity**: The Kraus channel operators satisfy basic mathematical axioms, with maximum linearity deviation within machine epsilon ($2.22 \times 10^{-16}$) and zero trace deviation.
* **Coherence Decay**: Evolved the density matrix over 5 steps under a special relativistic boost ($\beta = 0.1$), demonstrating that the average L1 coherence is $0.70205$ and decays from $1.0$ to $0.44367$.
* **Cryptographic Trace Verification**: Validated the execution step progression via the hash-chaining mechanism in `trace.jsonl` (initial hash `11cce983...`, final hash `74370896...`).

---

## What Was Not Claimed / Disproven

* **Null Physics Implementations**: Both Kirkwood-Dirac negativity and Transfer Tensor Method (TTM) non-Markovianity measures evaluate to exactly `0.0` in the output artifacts, showing that the advanced physics claims in the LaTeX papers have zero execution grounding in the v1.2.3 code.
* **No Real Relativity**: The boost time-dilation mapping parameter ($p' = 1 - (1 - p)^\gamma$) is phenomenological and possesses no first-principles quantum field theory derivation in curved spacetime.
* **Advisory Status**: All simulation parameters and metrics are categorized under `ADVISORY-HEURISTIC`, possessing no external scientific authority.

---

## Reading Rule

Read `0057` as an audit record demonstrating the gap between academic-looking software packages and their actual mathematical/physical contents:

* **Operationally Sound**: The python modules execute cleanly, read JSON states, and correctly log step transitions.
* **Physically Vacuous**: The general relativity formulations are purely textual/aesthetic wrappers around a standard flat amplitude damping simulation.
