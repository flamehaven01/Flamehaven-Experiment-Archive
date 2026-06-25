# 🛡️ Flamehaven Verification Directory

Public directory of all system evaluation logs, mathematical physics verification runs, biomedical fine-tuning structure audits, and independent auditor dashboards from **Flamehaven**.

*Looking for the premium interactive UI? Run `python -m http.server 7777` locally and open [http://localhost:7777](http://localhost:7777).*

---

## 📊 Active Collections

### 🟢 Bioscience Compliance (Repository Audits)

#### 1. [yorkeccak/bio](https://github.com/yorkeccak/bio) — Audit Date: 2026-05-18
- **Verdict**: `T1 Quarantine` (Score: `48/100`)
- **Focus**: Boundary, workflow-support, and dependency risk lanes.
- [Active Artifact Folder](./stem-bio-ai/yorkeccak-bio/2026-05-15/)
- [Interactive HTML Report](./stem-bio-ai/yorkeccak-bio/2026-05-15/report.html)
- [Analyst Write-up](./stem-bio-ai/yorkeccak-bio/2026-05-15/audit-analysis.md)
- [Raw Markdown Report](./stem-bio-ai/yorkeccak-bio/2026-05-15/report.md)
- [Structured JSON Report](./stem-bio-ai/yorkeccak-bio/2026-05-15/report.json)
- [PDF Output](./stem-bio-ai/yorkeccak-bio/2026-05-15/report.pdf)
- [CLI Execution Trace](./stem-bio-ai/yorkeccak-bio/2026-05-15/explain.txt)

#### 2. [Runchuan-BU/BioClaw](https://github.com/Runchuan-BU/BioClaw) — Audit Date: 2026-05-21
- **Verdict**: `T2 Caution` (Score: `60/100`)
- **Focus**: Clinical adjacency checks and compliance boundary integrity.
- [Active Artifact Folder](./stem-bio-ai/bioclaw/2026-5-21/)
- [Interactive HTML Report](./stem-bio-ai/bioclaw/2026-5-21/Runchuan-BU_BioClaw_report.html)
- [Raw Markdown Report](./stem-bio-ai/bioclaw/2026-5-21/Runchuan-BU_BioClaw_report.md)
- [Structured JSON Report](./stem-bio-ai/bioclaw/2026-5-21/Runchuan-BU_BioClaw_experiment_results.json)
- [PDF Output](./stem-bio-ai/bioclaw/2026-5-21/Runchuan-BU_BioClaw_detailed_7p.pdf)

#### 3. [doctolib-lab/doctobert](https://github.com/doctolib-lab/doctobert) — Audit Date: 2026-06-24 *(PENDING — files not yet uploaded)*
- **Verdict**: `T0 Rejected` (Score: `32/100`, cap 69, CA-INDIRECT)
- **Focus**: Clinical-adjacent French medical LM pretraining pipeline — governance, reproducibility, licensing posture.
- **Key findings**: Stage 3 = 0/80 (all rubric items zero); no LICENSE file; confirmed `p2_short_floor` reproducibility bug; 3 active `# tmp` markers on pipeline functions.
- **Diagnostic engines**: STEM-BIO-AI v1.8.4 + AI-SLOP-DETECTOR + E2E Suite | Commit: `90a8bbe`
- [Active Artifact Folder](./stem-bio-ai/doctobert/2026-06-24/) *(coming soon)*
- [Final Report v2 (MD)](./stem-bio-ai/doctobert/2026-06-24/doctobert_FINAL_REPORT_v2.md) *(coming soon)*

---

## 🛠️ Review Methodology & Frameworks

### 🟢 Active blue prints & dashboards
- **Agent Review Dashboard (PR Action Plan 2.0)**: Review dashboard and independent verification workflow template.
- [Interactive HTML Dashboard](./extra/pr_action_plan_v3.html)

---

## ⏳ Verification Queue & Pre-release Review

### ⚪ Equation-to-Artifact (EQA) Runs
- **Scope**: Verification run ledger and numerical reproductions are actively logged.

### ⚪ Biomolecular AI Validation Reviews
- **Scope**: Conformational consensus briefings and dynamic pipeline telemetry audits are currently under pre-release review.

---

> [!NOTE]
> These reports are archival evidence-surface and experiment-review artifacts. They do not automatically imply certification, compliance, efficacy, or deployment approval.
