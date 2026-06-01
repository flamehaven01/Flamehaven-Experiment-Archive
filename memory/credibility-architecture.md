# Credibility Architecture — Design Spec (DRAFT for review)

> Status: **design only**. No code changes until this is approved. Then implement Pillar 1 -> 2 -> 3.
> Answers three external questions: (Q1) how can internal metrics (SR9/DI2/Omega) carry any
> external authority; (Q2) how can even one result be independently verified; (Q3) how does
> this read as a serious scientific artifact (math/physics/bio), not a personal repo.

---

## 0. Core principle

**Replace "trust our scores" with "verify our facts."** A self-published ledger cannot grant
authority to its own metrics. Authority is either **borrowed** from external anchors (public MIT
repos, DOIs, standard externally-owned metrics, peer-review venues) or **earned** through
reproducibility. Internal metrics are transparent instrument readings layered on top of
externally checkable ground truth — never the source of authority themselves.

Honest constraint the user named: **SPAR-Framework, SR9, DI2, Omega, NNSL, LawBinder are all
Flamehaven-built internal artifacts.** Being deterministic / open-source / PyPI-published gives
them *transparency*, not *external validation*. The design must demote them accordingly, not
decorate them.

---

## 0.1 Positioning: understatement is the strategy (governing rule)

A small / independent lab that says "ours is the best" is dismissed as slop on sight — the more so
now that AI-research projects are mass-produced. Loud appeals to self-built methods are the exact
failure mode of the "AI-slop expert" projects we must not resemble. If we were a top-100 lab the
calculus would differ; we are not, and we accept that reality and design for it.

Therefore the entire ledger adopts a **restrained, fact-only register**:

- **Internalize internal methods.** SR9/DI2/Omega/SPAR/NNSL stay in the data for audit and
  transparency, but are never a selling point, never a headline, never promoted.
- **Refine all expression.** No superlatives, no strong appeals, no marketing tone anywhere
  (HTML, README, reports, commit messages). Register = lab-notebook / methods section.
- **Let external anchors do the talking.** State what was computed and link the public repo / DOI
  / standard metric. Add no adjectives of self-praise. The reader judges; we do not assert.
- **Demote, do not decorate.** When in doubt, lower the volume. Restraint here is not humility for
  its own sake — it is the only credible posture available to us.

This rule overrides any wording choice elsewhere in this spec.

---

## 1. The exemplar (already shipped): EQA card 0055

`eqa-card-0055` (OpenAI Erdos Eq. 2.2 reproduction) is the model every serious claim should follow:

| Button | Target | Credibility role |
|--------|--------|------------------|
| `[JSON]` | inspector (raw verbatim payload) | inspect the data |
| `[Report]` | flamehaven.space writeup | human-readable method |
| `[Repo]` | github.com/Flamehaven-Labs/openai-erdos-eq22-reproduction (public, MIT) | **independent reproduction** |
| `[Paper]`/DOI | Zenodo DOI 10.5281/zenodo.15487327 | **persistent citable anchor** |

The claim ("matches the published value to 0.014%") is checkable by a third party **without
trusting any Flamehaven metric** — they clone the MIT repo and run it. This pattern = the target
state for all three lanes.

---

## 2. Provenance class taxonomy (Pillar 1 core)

Every displayed number/verdict gets one label. Definitions are falsifiable:

- **EXTERNAL** — defined and owned by a third party; checkable against their artifact.
  Examples: AlphaFold pLDDT / PAE / pTM (DeepMind/EBI), published theorem values, the MIT AI Risk
  Repository taxonomy itself, EU AI Act article text, Zenodo DOI, a result already reproduced by a
  public MIT repo.
- **DERIVED** — computed by us from EXTERNAL inputs via a published formula **+ code that a third
  party can actually re-run**. Status is **conditional**: a value is DERIVED only while the linked
  repo/command is runnable by others and yields the same result. A public repo *existing* does not
  make a number DERIVED; a third party *re-running it* does. Until then it is ADVISORY-HEURISTIC.
  Example: repro deviation % (conditional on the openai-erdos repo being runnable); `p_e2e` (only
  if every factor is shown and recomputable).
- **ADVISORY-RULE-BASED** — a deterministic rule engine whose verdict **cites a specific external
  basis** (a statute, a published taxonomy). The cited basis is surfaced as EXTERNAL; only the
  rule's mapping logic is ours. Better than a free score, weaker than EXTERNAL.
- **ADVISORY-HEURISTIC** — Flamehaven score with **no external basis**, not externally validated.
  Shown small/secondary, explicitly tagged "internal, advisory."

**Honest classification table (initial):**

| Metric / verdict | Class | Justification |
|------------------|-------|---------------|
| AlphaFold pLDDT, PAE, pTM, contact_probs | EXTERNAL | DeepMind/EBI definitions, re-runnable (within tolerance) |
| Published math value (Erdos Eq 2.2) | EXTERNAL | OpenAI result + Zenodo DOI |
| MIT AI Risk taxonomy / EU AI Act article text | EXTERNAL | third-party-owned reference |
| Repro deviation % (e.g. 0.014%) | DERIVED* | *conditional: only once the linked public repo is re-run by a third party; otherwise ADVISORY-HEURISTIC |
| p_e2e | DERIVED | product of shown, recomputable factors |
| BSC tier assignment | ADVISORY-RULE-BASED | deterministic mapping; cited basis (MIT AIRI) exposed as EXTERNAL |
| LawBinder BLOCK/INHIBIT | ADVISORY-RULE-BASED | deterministic; cited statute/article exposed as EXTERNAL, mapping logic ours |
| SR9, DI2, Omega | ADVISORY-HEURISTIC | Flamehaven metric, no external basis |
| SPAR score / maturity state | ADVISORY-HEURISTIC | Flamehaven framework (PyPI, but self-defined) |

Rule: a card's **headline verdict** must be EXTERNAL or DERIVED. For ADVISORY-RULE-BASED verdicts,
the headline shows the **cited external basis**, with the verdict as the rule output beside it.
ADVISORY-HEURISTIC metrics never appear in a headline, title, banner, or summary.

---

## 3. External anchor inventory (real, confirmed)

| Lane | Public anchor | Status | Integration |
|------|---------------|--------|-------------|
| EQA | github.com/Flamehaven-Labs/openai-erdos-eq22-reproduction (MIT) + Zenodo 15487327 | **live, linked on 0055** | extend pattern; keep |
| BSC | github.com/flamehaven01/STEM-BIO-AI (MIT, local clone present) | exists, **not yet linked from BSC cards** | add `[Repo]` + reproduction commit |
| BAV | none public yet | **gap** | build scaffold-able repro pipeline (recent 5 exps) |
| tooling | github.com/flamehaven01/SPAR-Framework (PyPI `spar-framework`) | exists | cite as ADVISORY engine, link for transparency |
| author | ORCID (held), Zenodo (held), JOSS/arXiv (intent) | available | wire into metadata (Pillar 3) |

---

## 4. Pillar 1 — Provenance classing + de-overclaim (in-repo)

**4.1 Data model.** Add `provenance` to each metric in manifests/payload-display config:
`{ "value": 0.919, "class": "ADVISORY-HEURISTIC", "source": "Flamehaven NNSL", "formula_ref": null }`
(class is one of EXTERNAL / DERIVED / ADVISORY-RULE-BASED / ADVISORY-HEURISTIC; RULE-BASED entries
add `"cited_basis"` pointing to the statute/taxonomy reference).
Where a formula exists (DERIVED), `formula_ref` points to code/section so it is recomputable.

**4.2 Inspector rendering + subordination.** Metric cards show a small class chip (4 classes):
EXTERNAL (green, "verifiable"), DERIVED (blue, "recomputable"), ADVISORY-RULE-BASED (amber, "rule,
cites external basis"), ADVISORY-HEURISTIC (grey, "internal, advisory"). Subordination per §0.1:
- **ADVISORY-HEURISTIC** (SR9/DI2/Omega/SPAR): never in a title, banner, summary, or README
  highlight; rendered small / secondary, behind a "methodology detail" expander, after the facts.
- **ADVISORY-RULE-BASED** (LawBinder, BSC tier): the **cited external basis** (statute/taxonomy)
  may appear in the headline; the rule verdict sits beside it labelled as our output, not a fact.
- glossary entry for every advisory metric states plainly: *defined by Flamehaven; not externally
  validated; shown for transparency and audit, not as a claim.*

The point is internalization: an outside reader can find SR9/DI2 if they audit, but the surface of
every card reads as external facts + cited bases + reproduction links only.

**4.3 Tone purge (broadened de-overclaim).** Remove **all** superlatives and strong appeals, not
just one word. Target register = methods section.
- README line 3 `transparent, and authoritative public ledger` -> `transparent, reproducible,
  independently checkable public ledger`.
- Sweep HTML/README/reports for promotional terms and neutralize: `authoritative`, `absolute`,
  `best`, `revolutionary`, `ultimate`, `world-class`, `breakthrough`, `powerful`, `cutting-edge`,
  `state-of-the-art`, `first-ever`, `unprecedented`, etc. (aligns with CLAUDE.md sec.6 "No Buzz").
- Add sanitizer **`promotional_language` detector** (detect-only) with an explicit spec:

  | Field | Definition |
  |-------|------------|
  | Detect list | word-boundary, case-insensitive: `revolutionary`, `ultimate`, `world-class`, `breakthrough`, `cutting-edge`, `state-of-the-art`, `first-ever`, `unprecedented`, `authoritative`, `absolute`, `groundbreaking`, `game-changing`, `industry-leading`, `unparalleled` (`promo_terms` in `.sanconfig.yaml`). Ambiguous technical words like `best` are deliberately excluded — handled by content extraction + allowlist, not by listing. |
  | Scope | `promo_scope` in config = the public authored surface only: `index.html`, `eqa.html`, `README.md`. Verbatim/historical reports and internal meta-docs are out of scope (their wording is not our marketing), so no blockquote-quote exemption is needed. |
  | Content extraction (suppress) | HTML: drop `<script>`/`<style>` bodies + all tags/attributes, scan visible text only (so `position:absolute`, `title="..."` never flag). MD: drop fenced + inline code. Plus a context `promo_allowlist` (regex, checked in +/-24 chars), e.g. `absolute path`. |
  | Action | detect-only flag (same gate behaviour as credibility_slop); CI lists offenders, build fails until neutralized or allowlisted-with-justification. |

  **Detector acceptance test:** a fixture file containing each detect term in (i) bare prose -> all
  flagged, and (ii) blockquote / code / external-title context -> zero flagged; plus a curated
  allowlist phrase -> zero flagged. The test ships under `sanitizer/tests/`.

**Acceptance test:** every **named scientific / governance metric** rendered in any inspector
carries a class chip (SR9/DI2/Omega/coherence/SPAR -> ADVISORY; p_e2e/capture/transfer -> DERIVED;
pLDDT/PAE/pTM/Brier/AUC/ECE -> EXTERNAL). Incidental values (counts, dates, grades) carry none.
No card title / banner / summary contains an ADVISORY-HEURISTIC metric (ADVISORY-RULE-BASED may show
its cited external basis only). The `promotional_language` detector returns zero flags on the
public surface. Implementation: one module-level `metricCard()` + `provClassOf()`/`provChip()` in
portal.js, to which the per-renderer `metric`/`card` helpers delegate (single source of truth);
the dashboard glossary tags each term with its class + legend.

---

## 5. Pillar 2 — Independent reproduction anchors (in-repo + scaffold)

**5.1 EQA — done.** 0055 already links the public MIT repo + DOI. Action: none beyond keeping the
button pattern; optionally surface the same `[Repo]` affordance wording in the inspector.

**5.2 BSC — link the existing public repo.** STEM-BIO-AI is public MIT. Action:
- Add `[Repo]` button on both BSC cards -> github.com/flamehaven01/STEM-BIO-AI.
- Add a `reproduce` block: target repo + **commit hash** + exact scanner command + expected tier
  + output SHA-256. The scan is deterministic from repo state, so a third party reproduces the
  exact tier. (No internal metric needed for the verdict.)

**5.3 BAV — build a scaffold-able re-run pipeline (NOT bit-exact reproduction).**
Critical honesty constraint: **AlphaFold3 / Chai-1 / Boltz-2 are non-deterministic** — pLDDT/PAE
drift across model versions, hardware (GPU/CPU, CUDA), MSA depth, seeds, and even repeated runs in
the same environment. Therefore BAV is **re-runnable**, not bit-for-bit reproducible, and a raw
SHA-256 "expected output" claim would itself be an overclaim. We expose the re-runnable structural
layer with an explicit tolerance, never an equality assertion.
- For the **5 most recent meaningful experiments** (of 7), extract from the verbatim payloads:
  input **sequence(s)**, **model + version**, and the **EXTERNAL metrics** emitted (pLDDT/PAE/pTM).
- Ship `bav/<exp>/reproduce/`: `input.fasta`, `models.json` (model+version+seed/MSA settings where
  known), a minimal `README` with a public ColabFold / AlphaFold command, and **`reference_run.json`**
  (our *recorded* values, explicitly labelled "reference run, not a fixed expected output") with a
  declared **tolerance band** per metric (e.g. pLDDT +/- band, PAE +/- band — band values set from
  observed run-to-run variance, cited, not invented). SHA-256 covers the *input files*, not the
  stochastic output.
- A third party re-folds the sequence on public AlphaFold and checks their pLDDT/PAE fall **within
  the tolerance band** of our reference run — exercising the structural layer independently of
  SR9/DI2. Wording everywhere: *"independently re-runnable; deviations expected due to model
  non-determinism,"* never *"independently verifiable / matches exactly."*
- In-card honesty note: "consensus/governance overlay (SR9/DI2) is ADVISORY; the structural metrics
  are re-runnable on public models within a stated tolerance — not a deterministic match."
- Where a payload lacks a usable sequence/model-version, mark that arm "not independently
  re-runnable (input not published)" rather than faking a scaffold.

**Finding (data, not assumption):** a payload scan showed only **EXP-031** actually carries a
foldable input sequence (52-aa) + external structural metrics (pLDDT/PAE/pTM, AF3/AF2). EXP-005 /
028 / 032 / 033 / 034 are governance / honesty / methodology experiments with no protein-folding
input. Per the no-fabrication rule we therefore ship a real scaffold for EXP-031 only and mark the
rest non-re-runnable, rather than manufacture scaffolds.

**Implemented:**
- `bav/exp-031/reproduce/`: `input.fasta` (52-aa, SHA-256 anchored), `models.json` (per-arm
  validators + recorded adapter versions + shared seed 20260208 + AF3 model version),
  `reference_run.json` (recorded AF2 pLDDT/pTM/PAE + AF3 pTM/ranking + per-arm pipeline pLDDT/drift
  + determinism signatures; labelled a *reference run*, not a fixed output), and a `README` with
  the public re-fold procedure (ColabFold / AF3 server) and the regime-level comparison.
- Wording throughout: *re-runnable, deviations expected (model non-determinism)* — never bit-exact;
  input hashed, stochastic outputs not hashed.
- UI: a `Reproduce` link on the EXP-031 card -> the public scaffold folder.
- EQA card 0055 already links its public MIT repo + DOI (unchanged). BSC cards now carry a
  `Scanner (MIT)` link to github.com/flamehaven01/STEM-BIO-AI; the BSC `report.json` already records
  the target repo remote + commit, so a third party reproduces the deterministic tier.

**Acceptance test:** EQA + BSC each resolve to a public MIT repo (EQA also a DOI); EXP-031 ships a
`reproduce/` (input sequence + model versions + reference run, input-file hash only, explicit
non-determinism note); the other BAV experiments are explicitly marked non-re-runnable with the
reason. No artifact claims a bit-exact structural output.

---

## 6. Pillar 3 — Scientific-artifact metadata (in-repo) + external actions

**In-repo (I implement):**
- `codemeta.json` (software metadata standard) + keep/extend `CITATION.cff`.
- schema.org `Dataset` / `SoftwareSourceCode` JSON-LD `<script>` in index.html + eqa.html.
- Per-lane explicit **limitations / "what this is NOT"** block (not certification, not clinical
  efficacy, advisory metrics internal).
- License clarity (confirm MIT, add SPDX headers where missing).
- Honest external-review status badges: JOSS/arXiv shown as `in preparation` / `submitted` only
  when true — never "published" before it is.

Pillar 3 is split so it cannot stall on external dependencies:

**3a — in-repo, zero external dependency (I implement immediately after Pillar 2):**
`codemeta.json`, schema.org JSON-LD, per-lane limitations blocks, license/SPDX clarity, and
CITATION.cff with **empty DOI/ORCID slots present** (so the structure is complete and the gap is
visible). 3a is fully shippable on its own.

**3b — external anchors, gated with a named owner + deadline (so it is not "forever in prep"):**
| Anchor | Owner | Prerequisite | On delivery I wire |
|--------|-------|--------------|--------------------|
| Whole-ledger Zenodo DOI | user | **must be minted before 3b starts** (the unblocking item) | DOI -> CITATION.cff + codemeta + footer badge |
| ORCID iD | user | held; provide the iD string | `author.orcid` in CITATION.cff + JSON-LD |
| JOSS/arXiv | user | submission opened | tracking ID + honest status (`submitted`, never `published` until true) |

Timeline rule baked into the spec: 3a ships with Pillar 3. 3b is **blocked on the Zenodo DOI**; if
the DOI is not minted, 3b stays open as a tracked TODO and the footer shows no DOI badge (rather
than a fake one). The DOI is the single prerequisite that converts the EQA repro-deviation value
to fully DERIVED status (see section 2) and unlocks the citable-snapshot claim.

**Implemented (3a):** `CITATION.cff` + `codemeta.json` created; index.html + eqa.html carry
schema.org `Dataset` JSON-LD; footer + README state limitations and the advisory status of
internal metrics. **License clarified (user decision): dual** — repository code MIT (`LICENSE`),
verification runs / evidence artifacts CC BY-NC 4.0. So codemeta (software) = MIT; CITATION +
Dataset JSON-LD (data) = CC-BY-NC-4.0; README documents the split. ORCID + whole-ledger DOI remain
commented slots in CITATION pending the actual strings (3b).

**Acceptance test (3a):** `codemeta.json` validates; both JSON-LD blocks parse; CITATION.cff is
valid CFF with DOI + ORCID slots present; license is internally consistent (code MIT / data CC
BY-NC 4.0) across LICENSE, footer, README, CITATION, codemeta, JSON-LD. [met]
**3b status:** `.zenodo.json` is in place, so the whole-ledger DOI is **turnkey** — minted when the
repo is connected to Zenodo and a GitHub release is cut (license cc-by-nc-4.0; Erdos component DOI
linked). ORCID iD: awaiting the real string (added to `.zenodo.json` creators + CITATION + JSON-LD
on receipt). JOSS/arXiv: deferred (arXiv endorsement; AI-assisted manuscripts hard to post) — no
badge until a real submission exists.

**Acceptance test (3b):** once the DOI is minted / the ORCID iD supplied, each resolves and appears
in CITATION.cff + codemeta + footer; no badge/status is shown for anchors not yet delivered (no
fabricated identifiers).

---

## 7. Sequencing & ownership

1. **Pillar 1** (provenance classing + de-overclaim) — highest leverage, fully in-repo, directly
   answers Q1. Honest demotion of SR9/DI2/Omega/SPAR.
2. **Pillar 2** (reproduction anchors) — EQA done; BSC = link STEM-BIO-AI + commit; BAV = build
   scaffold for recent 5. Answers Q2.
3. **Pillar 3a** (in-repo metadata) — codemeta/JSON-LD/limitations/license, with empty DOI/ORCID
   slots present. Ships regardless of external state. Answers Q3 structurally.
4. **Pillar 3b** (external anchors) — **gated on the user minting the Zenodo DOI**; ORCID + JOSS
   wired on delivery. Stays a tracked TODO (no fake badges) until the DOI exists.

In-repo vs external is marked per item above. Each pillar lands as its own commit with its
acceptance test verified (node --check, sanitizer gate, schema validators, browser checks).
Pillars 1, 2, 3a are fully in our control; only 3b depends on external delivery, and it is the
only part allowed to remain open.

---

## 8. Honest limitations of this architecture (what it does NOT do)

- It does **not** make SR9/DI2/Omega externally authoritative. It makes them transparent and
  clearly labelled advisory. Real authority stays with EXTERNAL/DERIVED facts.
- It does **not** constitute peer review. DOIs and a public repo are necessary, not sufficient;
  only JOSS/arXiv/journal review is external validation, and that is the user's action.
- BAV reproduction verifies the **structural** layer (re-foldable AlphaFold metrics), not the
  governance overlay. We will say so explicitly.
- A static GitHub Pages site has a credibility ceiling; persistent IDs + public repos + honest
  scope raise it, but do not turn the ledger into a certifying authority. The README must keep
  saying what it is NOT.
