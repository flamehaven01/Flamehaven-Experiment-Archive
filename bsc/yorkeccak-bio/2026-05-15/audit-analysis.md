# STEM-BIO-AI Audit Report: yorkeccak/bio
## When a README Claim Meets a Deterministic Scanner

**Published:** May 2026  
**Evaluation Target:** [yorkeccak/bio](https://github.com/yorkeccak/bio)  
**Evaluation Engine:** STEM-BIO-AI v1.7.7  
**Execution Mode:** LOCAL_ANALYSIS  
**Audit Expires:** 2026-06-30 (45-day freshness window)

---

## Executive Summary

| Field | Value |
|---|---|
| Final Score | **48 / 100** |
| Formal Tier | **T1 Quarantine** |
| Use Scope | Exploratory review only. No patient-adjacent use. |
| Replication Tier | **R1 (Stage 4: 30/100)** |
| AIRI Coverage | **7 / 32** |

The `T1 Quarantine` result is justified. The repository presents a strong bio-facing README and a recognizable data-source story, but it still lacks the engineering, governance, and deployment-boundary evidence needed for patient-adjacent or regulated use. The most important shift in the current `1.7.7` output is not the final score itself. It is that the report now surfaces external-service dependency and unsupported legal/compliance claims more explicitly, and no longer presents `Code Integrity` or `AIRI` in a way that looks artificially clean.

---

## What STEM-BIO-AI Measures

STEM-BIO-AI is a deterministic local CLI scanner. It does not execute model inference, make network requests, or run the target application. It evaluates repository evidence surfaces: what signals are present in README, docs, package metadata, dependency manifests, CI/test infrastructure, code structure, and replication artifacts.

The evaluation is organized into four stages.

| Stage | Weight | Description |
|---|---:|---|
| Stage 1 README Evidence Signal | 0.40 | What the README and package metadata claim |
| Stage 2R Repo-Local Consistency | 0.20 | Whether local code/doc surfaces support those claims |
| Stage 3 Code/Bio Responsibility | 0.40 | Engineering governance: tests, CI/CD, provenance, bias, release hygiene |
| Stage 4 Replication Evidence | reported separately | Reproducibility infrastructure |

Stage 4 is reported separately and does not alter the final score. Stage 3 remains the heaviest weighted stage and is still the clearest reason this repository remains in quarantine.

---

## Score Breakdown

### Stage 1 — README Evidence Signal: 75/100

| Signal | Points |
|---|---:|
| Non-nascent README baseline | +60 |
| Bio/medical domain vocabulary in README | +10 |
| Bio/medical domain vocabulary in package metadata | +5 |
| Self-asserted privacy/compliance language without stronger grounding | +5 |
| CA-INDIRECT surface lacks explicit non-clinical boundary | -5 |

The README is the strongest part of the repository. It names the right biomedical sources, uses domain vocabulary competently, and presents a coherent user-facing story. But the same README also contains compliance-adjacent language that the reviewed repository sources do not substantiate.

The current scanner no longer treats `HIPAA-compliant architecture` as a strong regulatory-framework signal. It is now surfaced as a weaker self-assertion signal plus a separate unsupported legal/compliance claim warning. That is the right direction. The claim remains visible, but it is no longer credited as if the repository had demonstrated formal governance support.

### Stage 2R — Repo-Local Consistency: 40/100

| Signal | Points |
|---|---:|
| Non-nascent local repository baseline | +60 |
| README domain overlap with package metadata | +15 |
| Clinical-adjacent surfaces without non-diagnostic boundary | -20 |
| README claims runnable workflow without matching local support | -15 |

This stage captures the central contradiction. The repository reads like a polished product surface, but the local support evidence is shallow. The repository describes a working biomedical workflow, yet there is no matching support structure for tests, CI, or locally verifiable runnable scaffolding.

The `-20` clinical-boundary deduction is especially important. Querying PubMed, ClinicalTrials.gov, FDA DailyMed, and ChEMBL without a clear non-diagnostic or non-clinical intended-use boundary is not a minor documentation omission. It is a governance gap.

### Stage 3 — Code/Bio Responsibility: 25/100

| Rubric Item | Score | Maximum |
|---|---:|---:|
| T1 CI/CD pipeline | 0 | 15 |
| T2 Domain-specific tests | 0 | 15 |
| T3 Changelog and release hygiene | 0 | 15 |
| B1 Data provenance controls | 15 | 15 |
| B2 Bias and limitations documentation | 0 | 15 |
| B3 COI, funding, acknowledgements | 5 | 5 |
| Raw total | 20 | 80 |

This is still the decisive stage.

Three engineering-governance items remain at zero:
- no workflow files,
- no test suite,
- no changelog or release history.

That means the repository still lacks the minimum operational evidence expected of a tool that presents itself as a serious biomedical interface.

`B1` now scores `15/15`, which is materially different from earlier runs. The scanner now recognizes JavaScript dependency and lockfile surfaces correctly, so `package.json`, `package-lock.json`, and `pnpm-lock.yaml` count as provenance or dependency evidence where appropriate. That is a real improvement in the audit logic, not a generosity bump.

`B3` also scores correctly because the repository acknowledges its relationship to Valyu. That disclosure matters. But provenance and acknowledgment do not compensate for missing tests, missing automation, and absent release hygiene.

### Stage 4 — Replication Evidence: 30/100

| Evidence Item | Score | Maximum |
|---|---:|---:|
| Container or compose file | 10 | 10 |
| Environment lock manifest | 10 | 10 |
| Exact dependency pins or hashes | 10 | 10 |
| Everything else | 0 | remaining |

Stage 4 is now stronger than it appeared in earlier runs because JavaScript lockfiles are correctly recognized. The repository gets real credit for containerization and dependency pinning.

That said, the replication lane is still thin:
- no reproducibility section,
- no runnable examples,
- no dataset URL evidence,
- no seed setting,
- no citation file,
- no checksum or artifact-verification surface.

So `30/100` is an improvement, but not a strong reproducibility posture.

---

## Top Risks

The current `1.7.7` report surfaces six top risks. Four are structural and two are mirrored from code-integrity warning lanes.

**Risk 1: Clinical-adjacent surfaces exist without an explicit non-diagnostic or non-clinical boundary.**  
This remains the most important governance issue. The tool works close to biomedical and clinical information flows, but the repository does not state a firm intended-use boundary that rules out diagnosis, treatment, or patient-care use.

**Risk 2: Self-asserted compliance or privacy-governance claim requires independent verification.**  
The repository uses compliance-adjacent language in the README. The scanner now treats this as a weak self-assertion that must be reviewed independently rather than as evidence of formal governance maturity.

**Risk 3: Legal, privacy, or compliance claim appears without supporting governance or security-grounding evidence in reviewed repository sources.**  
This is broader than the HIPAA phrase itself. The scanner is now explicitly surfacing unsupported legal/compliance claims in the report layer and regulatory traceability layer.

**Risk 4: Core workflow appears materially dependent on named external service providers; local or self-host claims may overstate operational independence.**  
This is the clearest structural warning in the current artifact. The repository depends on named external services such as Valyu and Daytona. That dependency is now visible as a first-class risk rather than being buried in config files or documentation assumptions.

**Risk 5: C2_dependency_pinning: WARN.**  
In this report, `C2` no longer reads as “all clear.” It now doubles as a code-integrity lane for external operational dependency risk when a named provider becomes a material single point of reliance.

**Risk 6: C5_compliance_boundary_integrity: WARN.**  
In `1.7.7`, compliance and clinical-boundary integrity were split away from the original exception-handling lane. Unsupported legal/compliance claims now surface under `C5`, while `C4` is reserved for actual executable fail-open exception patterns.

---

## Unsupported HIPAA / Compliance Claim: Evidence-Bound Reading

The README includes the phrase `HIPAA-compliant architecture (when self-hosted)`.

The important point is not to overread the scanner. STEM-BIO-AI does not determine legal compliance. It determines whether reviewed repository sources surface evidence that would help ground a claim like this.

At the repository-evidence layer, the answer is weak:
- the compliance phrase is present,
- stronger governance or security-grounding evidence is not surfaced clearly in reviewed sources,
- the claim therefore becomes a review signal rather than a positive trust signal.

This is why the current report now surfaces both:
- a weak Stage 1 self-assertion signal, and
- a broader unsupported legal/compliance claim warning.

That is a more defensible interpretation than the earlier behavior, which risked treating compliance-adjacent wording as a stronger positive signal than it deserved.

For context, a HIPAA-oriented operational claim normally invites review of at least the following:

- Business Associate Agreement expectations before PHI handling
- administrative safeguards such as risk analysis, workforce training, and contingency planning
- physical safeguards for devices and workstations
- technical safeguards such as access controls, audit controls, integrity controls, and transmission security
- breach-notification readiness under 45 CFR Part 164, Subpart D

The current report does **not** say those controls are absent in deployment. It says the reviewed repository sources do not surface enough evidence to treat the README phrase as grounded governance proof.

That distinction matters because the downside of over-reading a README compliance claim is not abstract. Under the 2025 HHS inflation-adjusted civil monetary penalty schedule, HIPAA violations can scale as follows:

| Tier | Per Violation | Annual Maximum |
|---|---:|---:|
| No knowledge | $137 | $27,481 |
| Reasonable cause | $1,379 | $137,897 |
| Willful neglect, corrected | $13,785 | $68,928 |
| Willful neglect, not corrected | $27,570 | $2,190,294 |

The narrow takeaway is not “this repository is legally noncompliant.” The narrower and more defensible takeaway is that a compliance-adjacent README claim should not be operationalized without independent verification of controls, contracts, deployment boundaries, and incident-handling procedures.

---

## Regulatory Traceability

The traceability block is useful here because it shows where the repository is generating governance-relevant signals without turning those signals into compliance claims.

| Framework | Article / Signal | Stage | Strength |
|---|---|---|---|
| EU AI Act | Article 13 — Transparency | Stage 1 | Weak |
| Compliance claim grounding signal | Traceability-only | Stage 1 | Weak to moderate |
| IMDRF SaMD/GMLP | Clinical context boundary | Stage 2R | Moderate |
| EU AI Act | Article 10 — Data governance | Stage 3 | Weak |
| EU AI Act | Article 12 — Record keeping | Stage 4 | Moderate |

This is the right use of traceability. It helps reviewers orient the evidence. It does not certify compliance, safety, or readiness.

---

## AIRI Coverage

Here, **AIRI** refers to the **AI Risk Repository** from the MIT AI Risk Initiative: https://airisk.mit.edu/

The AI Risk Repository has three core parts:
- the **AI Risk Database**, which captures 1700+ risks extracted from 74 existing AI-risk frameworks and classifications,
- the **Causal Taxonomy of AI Risks**, which classifies how, when, and why these risks occur,
- the **Domain Taxonomy of AI Risks**, which classifies risks into 7 domains and 24 subdomains, such as false or misleading information.

In STEM-BIO-AI, AIRI is used as a **bounded risk-vocabulary layer** that connects local detector findings to broader named AI-risk categories when detector-to-risk mappings exist. It is not a separate scoring engine and it is not a truth layer.

The most important difference from older outputs is that AIRI is no longer `0/31`.

Current result:
- **Covered Risks:** `7 / 32`
- **Coverage Rate:** `0.219`

Examples now surfaced:
- `24.01.03` Safe exploration problem with widely deployed AI assistants
- `24.04.01` Physical and Psychological Harms
- `33.01.05` Privacy and security
- `39.25.00` Verifiability
- `69.01.00` False information
- `72.04.02` Market Concentration and Infrastructure Dependencies

This matters because the earlier `0/31` output could be misread as “no relevant AIRI risk signal.” The current report is better aligned with the actual findings. Unsupported compliance claims, dependency concentration, and boundary weaknesses now connect to a broader AIRI-backed risk vocabulary, and the report now shows bounded `why mapped` reasoning for covered AIRI rows.

Important boundary:
- these AIRI links remain bounded by detector mappings,
- they do not prove actual harm, causality, clinical failure, or legal noncompliance,
- and they still leave important unmapped or partially mapped territory.

Known gaps still called out explicitly:
- `65.03.03` Reidentification
- `70.02.02` Misinformation — hallucination of clinical knowledge

Those gap notes are still important because they point to plausible failure territory that is not yet fully covered by the current static detector set.

---

## Code Integrity

The biggest interpretive improvement in the `1.7.7` report is that `Code Integrity` no longer looks falsely clean.

| Check | Result |
|---|---|
| C1 Hardcoded credentials | PASS |
| C2 Dependency pinning / external operational dependency lane | WARN |
| C3 Deprecated patient-adjacent paths | PASS |
| C4 Fail-open exception handling | PASS |
| C5 Compliance / boundary integrity | WARN |

This is much closer to what a reviewer would intuitively expect after reading the rest of the report.

Two cautions still matter:
1. `PASS` does not mean strong overall engineering quality. It means the specific detector lane did not surface a mapped problem.
2. Some architectural issues remain outside direct static detection. For example, design-level fail-open or mock-auth behavior may still require a dedicated detector rather than relying on current `C4` and `C5` logic.

---

## What Would Need to Change

For this repository to move out of `T1 Quarantine`, the changes are not subtle.

**Immediate**
- Add an explicit non-clinical / non-diagnostic intended-use boundary.
- Remove or reframe unsupported compliance language unless governance evidence is documented clearly.
- Document the operational dependency on Valyu and Daytona honestly, including what breaks when those services are unavailable.

**Short-term**
- Add CI/CD.
- Add tests.
- Add release hygiene and changelog discipline.
- Add explicit limitations/bias discussion.

**Medium-term**
- Add reproducibility guidance and runnable examples.
- Add stronger artifact and data-reference documentation.
- Add mitigations around AIRI gap territory such as reidentification and hallucination-adjacent misuse risk.

---

## Method Boundary

This remains a deterministic local CLI scan. No LLM inference, runtime execution, or network activity was used to produce the result. The report is therefore strongest when describing repository evidence surfaces and weaker when inferring live deployment behavior.

That boundary matters. This report is a pre-screen and review aid, not clinical certification, regulatory clearance, or legal advice.

---

## Raw Audit Data

The full machine-generated STEM-BIO-AI report for this run is attached below as an interactive HTML artifact and also exists in Markdown, JSON, explain-trace, and PDF form.

---

*STEM-BIO-AI | Weekly Repository Evaluation #1 | Every Friday*  
*Next: BioClaw — AI-powered bioinformatics research assistant for WhatsApp group chats. 374 stars. A bioRxiv paper. Where does the genomic data go after the message is sent?*
