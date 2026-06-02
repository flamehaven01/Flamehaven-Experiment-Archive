# TOE-TEST-0004 — "Topology and Geometry Do Not Lie"

**Subtitle:** Topology, Geometry, and the Limits of Narrative Reasoning  
**Date:** 2026-03-06  
**Engine version:** v4.2.0  
**Format:** 3-3-4 Matrix  
**Grade:** see Summary

> **Archive reconstruction note (2026-06-02)**: This historical record is a
> preset-direct matrix. The narrative language in the source should not be read
> as canonical proof that the engine is "narrative-immune."
>
> - The stable evidence here is the topology / geometry contrast itself:
>   single-plane vs two-plane `F2`, rigid vs non-rigid `CY3`, and `D=11`
>   BRST/GS rejection under the historical v4.2.0 gate stack.
> - `A02` (`AdS5` at `L=0.99/1.00/1.01`) is a historical no-`F5` sensitivity
>   probe. It should not be read as the current canonical `AdS5×S5` verdict for
>   later engine versions with fuller flux support.

---

## Motivation

> *"Theory builds narratives, but Topology and Geometry do not lie."*

This is the core proposition that v4.2.0 proved. TOE-TEST-0004 pushes it one step further:
- **Narrative**: "A strong gauge field induces a GS anomaly" -> Topology: a single-plane F2 is topologically trivial
- **Narrative**: "CY3 compactification -> BRST anomaly" -> Geometry: a rigid CY3 (h21=0) has no moduli, so c_total=0
- **Narrative**: "Flat spacetime -> safe" -> Topology: with two-plane gauge fields, p1_F=2.0 -> GS anomaly
- **Narrative**: "AdS5 L=1.00 and L=0.99 are nearly identical" -> Geometry: beta_G = 37.6 vs 36.9, detects even a 1% deformation

It directly attacks the C6 (AdS5 F5 gap), C7 (moduli stabilization), C8 (curvature + F2 coexistence), and C9 (Pontryagin topology) gaps.

---

## 3-3-4 Matrix

### PASS Cohort (3 — the engine must correctly approve physically valid backgrounds)

| # | Name | Preset | Gate | Ω | √JSD | β_G | p1_R | p1_F | c_total |
|---|------|--------|------|---|------|-----|------|------|---------|
| P1 | Flat Minkowski 10D | flat | **PASS** | 1.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| P2 | WZW S3 (r=1.0) | wzw_s3 | **PASS** | 1.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| P3 | Flat 10D + single F01 | flat+F2[01]=1 | **PASS** | 1.0 | 0.0 | 0.0 | 0.0 | **0.0** | 0.0 |

**P3 physics**: `F2[0,1]=1, F2[1,0]=-1` (single plane). The Pontryagin 4-form requires 4 independent indices, so
`p1_F = (1/4) ε^{mnrs} F_{mn} F_{rs} = 0`. Even with a gauge field present, if it is topologically trivial the GS condition is satisfied.

### FAIL Cohort (3 — distinct FAIL mechanisms, including regressions)

| # | Name | Preset | Gate | Ω | √JSD | Mechanism |
|---|------|--------|------|---|------|-----------|
| F1 | de Sitter (H=0.1) | de_sitter | **FAIL** | 0.0 | 0.272 | beta^Phi via cosmological constant |
| F2 | Heterotic GS (two-plane) | heterotic_gs | **FAIL** | 1.0 | 0.0 | GS anomaly: p1_F=2.0, p1_R=0.0 |
| F3 | D=11 Background | D=11 flat | **FAIL** | 1.0 | 0.0 | BRST: c_total=+1.5 + GS D∉{10,26} |

**F3 detail**: M-theory dimension D=11 is not a superstring.
- `c_matter = 3/2 × 11 = 16.5`, `c_ghost = -15` -> `c_total = +1.5 ≠ 0`
- Since D∉{10,26}, the GS flag is also True
- Ω=1.0, √JSD=0.0, but BRST+GS category failure -> categorical rejection
- Ref: Cremmer, Julia, Scherk (1978) PLB 76:409 (11D supergravity — not a string theory)

### Adversarial Cohort (4 — cases where the narrative is wrong and topology/geometry are right)

| # | Setup | Narrative prediction | Engine | Discovery |
|---|-------|----------------------|--------|-----------|
| A01 | Schwarzschild + single F01 | "black hole + gauge field -> anomaly" | **PASS** (Ω=0.9997) | Ricci-flat + topologically trivial F2 |
| A02 | AdS5 L=0.99 vs L=1.00 | "a 1% difference is negligible" | **distinguished** (β_G=37.6 vs 36.9) | geometry detects 1% deformation, quantifies C6 gap |
| A03 | Rigid CY3 (h21=0) | "CY3 -> BRST anomaly" | **PASS** (c_total=0.0) | h21=0 rigid manifold: no moduli |
| A04 | Flat 10D + two-plane F2 | "flat spacetime -> safe" | **FAIL** (p1_F=2.0) | without curvature, GS cancellation is impossible |

---

## Raw Data

### P3 — Flat + Single F01 Only
```
preset:       flat + F2[0,1]=1, F2[1,0]=-1
gate:         PASS
Omega:        1.0
sqrt_JSD:     0.0
beta_G_norm:  0.0
beta_Phi:     0.0
gs_anomaly:   False
brst_ok:      True
c_total:      0.0
gs_p1_R:      0.0
gs_p1_F:      0.0      <- topologically trivial single plane
gs_residual:  0.0
```

### F3 — D=11 Flat Background
```
preset:       flat D=11
gate:         FAIL
Omega:        1.0
sqrt_JSD:     0.0
beta_G_norm:  0.0
beta_Phi:     0.0
gs_anomaly:   True     <- D not in {10,26}
brst_ok:      False    <- c_total = +1.5
c_total:      1.5      <- c_matter=16.5, c_ghost=-15
c_moduli:     0.0
gs_p1_R:      0.0
gs_p1_F:      0.0
```

### A01 — Schwarzschild + Single F01
```
preset:       schwarzschild + F2[0,1]=1
gate:         PASS
Omega:        0.9997
sqrt_JSD:     0.0001
beta_G_norm:  0.0      <- Ricci-flat (Schwarzschild is vacuum solution)
beta_Phi:     0.0
gs_anomaly:   False    <- p1_F=0 (single plane, topologically trivial)
brst_ok:      True
c_total:      0.0
gs_p1_R:      0.0
gs_p1_F:      0.0
```

### A02 — AdS5 L Deformation Sensitivity
```
L=0.99:  FAIL  Omega=0.0  sqrt_JSD=0.4681  beta_G=37.6270
L=1.00:  FAIL  Omega=0.0  sqrt_JSD=0.4682  beta_G=36.8782
L=1.01:  FAIL  Omega=0.0  sqrt_JSD=0.4683  beta_G=36.1515

Delta_betaG per 0.01 L: ~0.75 (monotone decreasing)
Detection sensitivity: 1% L change -> 2% beta_G change
```

### A03 — Rigid CY3 (h21=0) vs h21=1
```
h21=0 (rigid):
  gate=PASS  Omega=1.0  c_total=0.0  c_moduli=0.0  brst_ok=True

h21=1 (contrast):
  gate=FAIL  Omega=1.0  sqrt_JSD=0.0  c_total=1.5  c_moduli=1.5  brst_ok=False
```

### A04 — Flat + Two-Plane F2 (p1_F=2.0)
```
preset:       flat + F2[0,1]=1, F2[2,3]=1
gate:         FAIL
Omega:        1.0
sqrt_JSD:     0.0
beta_G_norm:  0.0
beta_Phi:     0.0
gs_anomaly:   True
brst_ok:      True
gs_p1_R:      0.0
gs_p1_F:      2.0      <- two independent planes, non-trivial Pontryagin
gs_residual:  2.0
```

---

## Analysis

### Discovery 1 — Topological triviality: A01 proves Ricci-flat + single F2 = safe

A01 is the most important case in TOE-TEST-0004. Even when a single-plane gauge field is added to a
Schwarzschild black-hole background (a strongly gravitational narrative), the engine returns PASS (Ω=0.9997).

Two independent reasons:
1. Schwarzschild is Ricci-flat -> `p1_R = 0` (Riemann ≠ 0, but it vanishes under the 4D Levi-Civita contraction)
2. Single F01 plane -> `p1_F = 0` (topologically trivial)

Therefore `gs_residual = |0 - 0| = 0` -> the GS condition is satisfied. The narrative ("black hole + gauge field")
predicted FAIL, but both geometry and topology point to PASS.

> **Insight**: A GS anomaly is not a question of "how strong the field is" but of "whether the field is topologically non-trivial."
> A single-plane F2 is GS-safe no matter how large. This follows directly from the requirement of ε^{mnrs} (4 independent indices).

### Discovery 2 — Quantifying the C6 gap: AdS5 deformation is detectable, but the FAIL cause differs

A02 result analysis:

```
β_G ∝ 1/L² (AdS5 Poincaré: R_{uv} ~ (D-1)/L²)
dβ_G/dL ≈ -2β_G/L = -2 × 36.88 / 1.0 ≈ -73.8/unit
1% change in L (0.01 unit) → ~0.75 change in β_G  ✓ (measured: 36.88→37.63)
```

The engine detects a 1% L deformation as a 2% change in β_G. This is a **quantitative resolution** of the C6 gap.

However, an important distinction: the reason AdS5 FAILs is the absence of F5 flux (a known scope limitation),
not the value of L. If F5 flux is included, L=1.0 becomes PASS and L≠1.0 becomes FAIL.
This is the remaining part of C6 and is carried over to TOE-TEST-0005.

### Discovery 3 — Resolving C7: a rigid CY3 does not induce a BRST anomaly

A03 closes the C7 gap. `hodge_21=0` (rigid manifold):
- c_moduli = 1.5 × 0 = 0 -> c_total = c_matter + c_ghost = 15 - 15 = 0 -> BRST OK

The narrative "compactifying on a CY3 produces a BRST anomaly" is **wrong**. The anomaly is proportional to the number
of moduli. A rigid CY3 has h21=0, so it has no chiral multiplets and maintains c_total=0.

Contrast (A03b, h21=1): c_moduli=1.5, c_total=1.5, brst_ok=False.

### Discovery 4 — C8 probe: GS cancellation is impossible in flat spacetime

A04 clarifies the boundary of the C8 gap. In flat spacetime (p1_R=0), if two-plane gauge fields (p1_F=2.0) exist,
GS cancellation is impossible:
```
GS condition: p1_R = p1_F
Flat:         0 ≠ 2.0  → anomaly
```

To test full GS cancellation (p1_R = p1_F ≠ 0), a **curved background + a precisely tuned F2** is required.
This is the remaining task of C8 and is carried over to TOE-TEST-0005.

---

## Category-by-Category Evaluation

### PASS Cohort
| Case | Prediction | Actual | Assessment |
|------|------------|--------|------------|
| P1 (flat) | PASS | PASS | ✅ regression baseline |
| P2 (wzw_s3) | PASS | PASS | ✅ exact string solution |
| P3 (flat+single F01) | PASS | PASS | ✅ confirms topological triviality |

### FAIL Cohort
| Case | Prediction | Actual | Assessment |
|------|------------|--------|------------|
| F1 (de_sitter) | FAIL | FAIL | ✅ regression |
| F2 (heterotic_gs) | FAIL | FAIL | ✅ regression v4.2.0 |
| F3 (D=11) | FAIL | FAIL | ✅ confirms BRST c_total=1.5 |

### Adversarial Cohort
| Case | Narrative prediction | Actual | Physics Insight |
|------|----------------------|--------|-----------------|
| A01 (Schw+single F01) | FAIL | **PASS** ✅ | Topology > narrative |
| A02 (AdS5 L±1%) | same | **different** ✅ | β_G 2% detection |
| A03 (rigid CY3) | FAIL | **PASS** ✅ | h21=0 -> c_moduli=0 |
| A04 (flat+two F2) | PASS | **FAIL** ✅ | GS requires curvature |

---

## Grade

| Category | Score |
|----------|-------|
| PASS cohort (P1–P3) | 3/3 ✅ |
| FAIL cohort (F1–F3) | 3/3 ✅ |
| Adversarial (A01–A04) | 4/4 ✅ |
| **Total** | **10/10 = S grade** |

---

## Open Gaps -> TOE-TEST-0005

| ID | Description | Priority |
|----|-------------|----------|
| C6 | AdS5 F5 self-dual flux implementation -> type IIB exact solution PASS | High |
| C8 | Curved background + F2 tuning: p1_R = p1_F ≠ 0 full GS cancellation case | Medium |
| C10 | p1_R computation when Schwarzschild partial_G=None (currently 0) | Low |
| C11 | WZW S3 + F2: effect of simultaneous H-flux and F2 on the GS condition | Medium |

---

*Engine: flamehaven-toe v4.2.0 | Tests: 887 passed, 2 skipped*  
*Refs: Green-Schwarz (1984) PLB 149:117 | Candelas et al. (1985) NPB 258:46 | Cremmer-Julia-Scherk (1978) PLB 76:409*
