# Flamehaven Code Audit Standard CAS v0.8

# BioClaw Code Review - Audit Report

## Template Version 0.8

### **Flamehaven Internal Document**

- Protocol: Code Audit Standard v0.8
- Language: English
- Status: Active
- Framework Type: Claim-Aware Code Audit Framework

---

## 0. Pre-Audit Setup

### 0.1 Metadata

| Field | Value |
| --- | --- |
| Audit ID | CAS-2026-05-BIOCLAW-001 |
| Audit Revision | 1 |
| Project Name | BioClaw |
| Repository URL | https://github.com/Runchuan-BU/BioClaw |
| Reviewed Commit / Tag | dfbcebfa452e (main) |
| Review Date | 2026-05-21 |
| Reviewer | STEM-BIO-AI (Flamehaven Auditor) |
| Reviewer Authority Level | L2 (Domain-Informed Structural Audit) |
| Audit Protocol Version | Flamehaven CAS v0.8 |
| Deployment Context | Enterprise-Internal / Clinical-Adjacent |

> Code changes. A review without a commit hash or version tag is unverifiable six months later. Always pin the exact state of the codebase being reviewed.

---

## 1. Narrative vs. Technical Reality

### 1.1 Narrative Drivers

| Narrative Frame | Community Reception & Amplification Mechanism | Technical Reality |
| --- | --- | --- |
| "Enterprise-grade biomedical research behind a chat interface" | Appeals to researchers and clinicians seeking frictionless access to PubMed, FDA data, and genomic analysis. | Implemented: LLM agents integrated with WhatsApp and web UI. However, no domain-specific tests exist to validate structural biological outputs (SMILES, genomic parsing). |
| "HIPAA-compliant architecture (when self-hosted)" | Resonates with institutional buyers needing to process PHI or sensitive clinical data legally. | Fails: "Self-hosted" defaults to auto-login (dev@localhost), local SQLite with no access controls, and no verifiable audit logging. |
| "WhatsApp seamless integration" | High viral adoption potential due to extreme UX convenience for mobile researchers. | Fails Security: Raw attachments (including genomic files) flow through consumer-grade Baileys WhatsApp sockets without an intermediate PII/PHI scrubbing or E2E encryption layer. |

### 1.2 Summary Judgment

BioClaw delivers a highly capable and functionally impressive biomedical AI assistant. However, it exhibits a catastrophic gap between its narrative claims ("Enterprise-grade", "HIPAA-compliant") and its structural technical reality. The repository lacks mandatory clinical boundaries (C5 WARN), entirely omits biological domain tests (T2=0), and utilizes a WhatsApp data pipeline that introduces immediate institutional breach risks. **Deployment in any clinical-adjacent or patient-data context is strongly discouraged until severe architectural remediation (보완) is completed.**

---

## 2. Claim-to-Code Audit

| Finding ID | Claim | Verdict | Failure Type | Severity | Evidence Level | Confidence | Evidence | Attack Vector | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FIND-001 | "HIPAA-compliant architecture (when self-hosted)" (README L262) | FAIL | F4 | P1 | A | High | [README.md:L51] "Auto-login as dev user", [README.md:L134] "Mock Authentication" | No audit logs, mock auth, and local SQLite completely invalidate HIPAA technical safeguard requirements. | Open |
| FIND-002 | "Clinical data analysis" (README L35) | WARN | F6 | P2 | A | High | `STEM-BIO-AI` `C5_compliance_boundary_integrity` detection. No "Research Use Only" disclaimer found. | Operationalizing clinical capabilities without a non-diagnostic boundary invites institutional liability. | Open |
| FIND-003 | "Enterprise-grade biomedical research" | FAIL | F2 | P1 | A | High | [tests/] `T2_domain_tests=0`. Tests only cover message routing, not biological correctness. | Malformed SMILES or hallucinatory genomic data is passed to user without validation. | Open |
| FIND-004 | "WhatsApp Integration" (Channel Architecture) | FAIL | F4 | P1 | A | High | [src/channels/whatsapp/channel.ts] Unfiltered `downloadMediaMessage` pipeline directly to agent runner. | Genomic/PHI data traverses consumer chat networks without PII sanitization or enterprise-controlled E2E. | Open |
| FIND-005 | "Secure sandboxed execution" (Daytona integration) | PASS | - | - | A | Medium | [README.md:L61], Daytona external dependency confirmed. | - | Resolved |

---

## 3. Architecture Implementation Audit

### 3.1 Module-Level Analysis

| Finding ID | Module | Verdict | Failure Type | Severity | Reference | Evidence Level | Confidence | Evidence | Attack Vector | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FIND-006 | `src/channels/whatsapp/channel.ts` | FAIL | F4 | P1 | section 3.1 | A | High | Baileys WASocket implementation handles `imageMessage`, `videoMessage`, `audioMessage` without intercept/scrub layers. | Data exfiltration or PHI leakage via WhatsApp backups (consumer cloud). | Open |
| FIND-007 | `container/agent-runner/src/index.ts` | WARN | F4 | P2 | section 3.1 | A | Medium | Docker container isolation present, but input protocol relies on unrestricted `ContainerInput` JSON. | Prompt injection or adversarial payload via unscrubbed chat inputs. | Open |
| FIND-008 | `tests/container-agent-runner/` | FAIL | F2 | P2 | section 3.1 | A | High | Existing `whatsapp.test.ts` and `task-routing.test.ts` contain zero assertions on biological data structures. | - | Open |

### 3.2 Critical Production Blockers

The following items must be remediated (보완) before clearing `T1/T2 Quarantine` status for any institutional deployment:

1. **WhatsApp Pipeline Sanitization:** The consumer messaging pipeline must be severed from raw clinical/genomic file ingress, or an E2E-encrypted staging gateway must be implemented.
2. **Clinical Boundaries (C5):** Explicit "Not for Clinical Use" disclaimers must be hardcoded into the README, UI, and generated reports to mitigate legal liability.
3. **Domain Test Implementation:** Bio-specific assertion tests must be added to validate the structural outputs of the LLM agents.
4. **Remove Unsubstantiated HIPAA Claims:** Remove the "HIPAA-compliant" marketing language until BAA frameworks, RBAC, and verifiable audit logging are technically implemented.

---

### 3.3 Intra-Codebase Architectural Divergence

| Finding ID | Component A | Component B | Overlapping Concern | Conflict | Interface Contract | Integration Path | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FIND-009 | `README.md` (Self-hosted security) | `src/db/` (Local SQLite + Mock Auth) | Authentication and Data Protection | README claims enterprise compliance; Code implements zero-auth developer stubs. | None | Implement JWT/OAuth middleware for self-hosted instances. | Open |

---

### 3.4 Security Architecture Verifiability

| Control | Claimed | Verified | Evidence Level | Gap / Finding Reference | Notes |
| --- | --- | --- | --- | --- | --- |
| Control plane / data plane separation | Yes | Yes | A | - | Handled adequately via `NanoClaw` containerization for the agent execution. |
| Human-in-the-loop (HITL) enforcement | No | No | C | FIND-003 | Agents execute workflows without mandatory clinical supervision gates. |
| Input / output boundary validation | Yes | No | A | FIND-006, FIND-007 | Missing PHI/PII sanitization before passing user data to LLMs or external APIs. |
| Privilege escalation prevention | N/A | N/A | - | - | - |
| Audit logging of consequential actions | Yes (HIPAA claim implies it) | No | A | FIND-001 | No systematic logging of who requested what clinical data. |
| Rollback / revocation mechanism | No | No | C | - | WhatsApp messaging lacks native revocation for exported biological analysis. |

---

## 4. Technical Security & Compliance Audit (STEM-BIO-AI)

This section supplements the Flamehaven-CAS audit with the deterministic output from the STEM-BIO-AI scanner (v1.7.8), providing a granular breakdown of the evidence surfaces that informed the CAS verdicts.

### 4.1 Score Breakdown

**Final Score: 60 / 100 (T2 Caution)**

| Stage | Weight | Score | Evaluation |
|---|---:|---:|---|
| **Stage 1 README Evidence Signal** | 0.40 | 70 / 100 | The README successfully uses biomedical vocabulary and fairness/validation language (+10). However, it is heavily penalized for lacking explicit non-clinical boundaries and regulatory framework disclaimers while operating in a Clinical-Adjacent (CA-INDIRECT) space. |
| **Stage 2R Repo-Local Consistency** | 0.20 | 50 / 100 | Receives baseline points for possessing CI workflows, but suffers a massive `-20` penalty (`R2R_D2_missing_clinical_use_boundary`) because the claimed biomedical capabilities are not bounded by formal disclaimers in the repository structure. |
| **Stage 3 Code/Bio Responsibility** | 0.40 | 54 / 100 | Scores perfectly on CI/CD presence (T1) and data provenance/dependency manifests (B1). However, it utterly fails on core engineering governance: **Zero domain-specific tests (T2=0)** and **Zero release hygiene/changelogs (T3=0)**. |
| **Stage 4 Replication Evidence** | (Separate) | 35 / 100 | Only scores points for exact dependency pins and CLI entrypoints. Lacks a reproducibility target (Makefile), seed setting for LLMs, dataset URLs, and checksum validations. (Tier R1) |

---

### 4.2 AIRI Coverage: The Security Blindspots

The MIT AI Risk Repository (AIRI) mapping confirms the structural flaws identified in the CAS module analysis.

**Covered Risks: 2 / 32**
- `24.01.03` — Safe exploration problem with widely deployed AI assistants
- `69.01.00` — False information
*(Both risks are triggered by the `C5_compliance_boundary_integrity` failure: without a boundary, the system invites reliance on potentially hallucinated medical outputs.)*

**Known Gaps in the Pipeline (Unmitigated Risks):**
- `33.01.05` — **Privacy and security**: Directly tied to the unencrypted, unscrubbed WhatsApp ingress pipeline (FIND-006).
- `65.03.03` — **Reidentification**: Tied to the lack of PHI sanitization before hitting external APIs.
- `70.02.02` — **Misinformation (Hallucination of clinical knowledge)**: Exacerbated by the complete lack of domain-specific tests (FIND-003).

---

### 4.3 Code Integrity (C1-C6)

The Code Integrity module maps to explicit technical and governance flaws.

| Check | Result | Explanation |
|---|---|---|
| C1 Hardcoded credentials | PASS | No direct credential patterns detected. |
| C2 Dependency pinning | PASS | Dependency manifest appears pinned. |
| C3 Deprecated patient-adjacent paths | PASS | No deprecated patient metadata patterns detected. |
| C4 Fail-open exception handling | PASS | No executable fail-open exception handler detected. |
| **C5 Compliance boundary integrity** | **WARN** | **Clinical-adjacent surfaces exist without an explicit non-diagnostic/non-clinical boundary.** This is the core governance failure driving the T2 Caution tier. |
| C6 Mock-auth boundary | PASS | Addressed in CAS Claim Audit (FIND-001), but static scan did not flag specific mock-auth keywords in non-README files. |

---

### 4.4 Regulatory Traceability Assistant

*Note: This is a traceability aid, not a compliance or clearance determination.*

| Framework | Article / Signal | Stage | Strength | Relevance to BioClaw |
|---|---|---|---|---|
| EU AI Act | Article 13 — Transparency | Stage 1 | Weak | Boundary and limitation language is currently missing. |
| IMDRF SaMD/GMLP | Clinical context boundary | Stage 2R | Weak | Contradictions between "Enterprise" claims and lack of boundaries. |
| EU AI Act | Article 10 — Data governance | Stage 3 | Moderate | Dependency manifests are present, but tests are missing. |
| EU AI Act | Article 12 — Record keeping | Stage 4 | Weak | Reproducibility manifests exist, but no operational audit logs. |

---
*Generated by STEM-BIO-AI Pipeline | Flamehaven-CAS Alignment*