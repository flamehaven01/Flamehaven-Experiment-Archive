# We Tried to Operationalize the “Jump.” Here Is Where the Code Broke.

**Subtitle:** Zahavy’s position paper, a public Missing Link implementation lineage, and one bounded audit of novelty, grounding, and verification.

**Series:** Equation to Artifact
**Status:** Editorial draft — not yet published. Its bounded executable companion is [TOE-TEST-0060](https://flamehaven01.github.io/Flamehaven-Verification-Ledger/eqa.html#toe-test-0060).
**Estimated reading time:** 9 minutes

**LinkedIn preview:** A position paper says LLMs cannot make the abductive jump required for scientific invention. We had already tried to operationalize part of that problem in a Missing Link pipeline. The audit did not prove the paper right. It exposed two prior engineering obligations: admissible novelty and independent verification.

[Tom Zahavy’s ICML 2026 position paper, *“Position: LLMs can’t jump”*](https://openreview.net/forum?id=klU4737opt) makes a useful provocation. A system can compress observations and derive consequences without introducing the premise that reorganizes the problem. The paper calls that move a *jump*: from experience to an axiom, then from the axiom to its consequences.

We did not set out to test whether every LLM can or cannot make that jump. We audited an existing implementation that was meant to propose a missing explanatory link from evidence while refusing unsupported invention.

The result is narrower, but more useful. Before a proposed jump can be judged scientifically, an implementation has to keep three things distinct:

\[
\text{candidate novelty} \neq \text{evidence support} \neq \text{intervention result}.
\]

Our source snapshot did not do that cleanly. Its biomedical admission rule had no feasible region. Its characterization fixture generated twelve candidate strings, accepted none, and recorded all twelve as query restatements. The correct verdict is therefore **ABSTAIN**, not a discovery claim and not a verdict on LLM ability.

## A public implementation lineage—not a priority claim

This experiment is not a post-hoc attempt to attach code to a fashionable paper. Earlier public Flamehaven records document a sequence of implementation notes about evidence-constrained hypothesis generation and governed acceptance:

| Date | Public record | What it documented | What it does **not** establish |
|---|---|---|---|
| 20 Jan 2026 | [LOGOS v1.4.1](https://flamehaven.space/writing/logos-v141-building-multi-engine-ai-reasoning-you-can-actually-trust/) | AATS was described as a hypothesis-generation and sandbox-testing component within a multi-engine orchestrator. | A demonstration of autonomous scientific discovery. |
| 23 Jan 2026 | [Refusal-First RAG](https://flamehaven.space/writing/implementing-refusal-first-rag-why-we-architected-our-ai-to-say-i-dont-know/) | Evidence atomization, span identifiers, a strict grounding gate, and the intended “high grounding + high novelty” policy in `missing_link`. | That the policy was internally coherent or capability-valid. |
| 25 Feb 2026 | [EXP-032B](https://flamehaven.space/writing/from-fail-closed-blocking-to-reproducible-passblock-separation-exp-032b/) | A scoped, labeled control-arm study of reproducible PASS/BLOCK separation, anti-leakage checks, and replay drift. | A validation of a biomedical hypothesis or of general abduction. |
| 4 Mar 2026 | [RExSyn Alzheimer’s walkthrough](https://flamehaven.space/writing/what-an-ai-reasoning-engine-built-for-alzheimers-metabolic-research-a-code-walkthrough/) | Literature ingestion → Missing Link inference → a pre-validation, falsifiable computational scaffold; the post explicitly labels its thresholds as engine-generated estimates. | A clinical finding, biomarker validation, or causal proof. |
| 3 Aug 2026 | [TOE-TEST-0060](https://flamehaven01.github.io/Flamehaven-Verification-Ledger/eqa.html#toe-test-0060) | A source-pinned characterization of the Missing Link admission contract. | A benchmark of LLM abduction, a biomedical result, or proof that a world model is necessary. |

The defensible relationship is **independent convergence followed by implementation evidence**. The earlier public posts show that the practical problem was already being attempted. They do not establish priority over Zahavy’s underlying research, and they are not independent validation of Flamehaven’s methods.

What 0060 adds is a harder question: did the published design intention survive contact with the executable gate?

## The paper’s sharp claim

The paper uses Peirce’s three-way distinction:

\[
\begin{aligned}
\text{Deduction:} &\quad \mathrm{Rule} + \mathrm{Case} \rightarrow \mathrm{Result}\\
\text{Induction:} &\quad \mathrm{Case} + \mathrm{Result} \rightarrow \mathrm{Rule}\\
\text{Abduction:} &\quad \mathrm{Rule} + \mathrm{Result} \rightarrow \mathrm{Case}.
\end{aligned}
\]

Its larger Einstein story can be written as

\[
E \xrightarrow{J} A \xrightarrow{\text{deduction}} S,
\]

where \(E\) is experience, \(J\) the non-deductive jump, \(A\) an axiom system, and \(S\) its formal consequences. Zahavy argues that manipulation in physically consistent, action-controllable simulation may be the missing mechanism.

That is a serious hypothesis. It is not yet an executable admission rule. Even if a world model proposes a candidate mechanism, a system still needs to decide whether the candidate is new, whether it is supported by evidence, and what intervention would count against it.

## The implementation goal was reasonable

The Missing Link runner takes evidence spans, extracts seeds, expands candidates, scores them, and then retains only candidates that pass novelty, plausibility, omega, and grounding gates. The relevant design intent is visible in the January post: refuse unsupported answers rather than turn a plausible continuation into a claim.

The frozen source snapshot computes novelty as the complement of overlap:

```python
def _estimate_novelty(self, hypothesis, evidence_spans):
    overlap = self._aggregate_overlap(hypothesis, evidence_spans)
    return max(0.0, min(1.0, 1.0 - overlap))
```

The strict path then filters candidates on several conditions, including a `clean` grounding status:

```python
if (omega >= min_omega
    and candidate.novelty_score >= novelty_min
    and candidate.plausibility_score >= plausibility_min
    and (not strict or grounding["status"] == "clean")):
    accept(candidate)
```

This is not illustrative pseudocode. It is a compacted excerpt of the source revision recorded by TOE-TEST-0060; the executable result, source hashes, and replay command are in the [verification ledger](https://flamehaven01.github.io/Flamehaven-Verification-Ledger/eqa.html#toe-test-0060).

## Where the admission contract broke

For the pinned biomedical profile, the relevant configuration was:

```yaml
grounding_overlap_min: 0.92
novelty_min: 0.10
novelty_overlap_mode: max
```

Let \(o\) be the maximum single-span overlap. The code sets \(n = 1-o\). The two admission requirements are therefore

\[
o \geq 0.92 \qquad \text{and} \qquad 1-o \geq 0.10,
\]

which gives

\[
o \geq 0.92 \qquad \text{and} \qquad o \leq 0.90.
\]

The feasible region is empty.

This is not a mystical limit on creativity. It is a configuration defect: one lexical-overlap family has been asked to reward distance from evidence and certify attachment to evidence at the same time. A genuinely new candidate can be penalized as ungrounded; a highly overlapping candidate can be penalized as insufficiently novel.

The same characterization fixture generated twelve candidates from five biomedical evidence spans and accepted zero. The recorded maximum grounding overlap was `0.15789473684210525` against a `0.90` threshold; recorded omega was `0.444` against `0.80`; all twelve candidates were query restatements. A passing pytest run means that the *before-image* remains reproducible. It does not mean that the system produced a valid missing link.

> Suggested figure placement: a two-axis admission diagram showing the empty interval \(o \geq 0.92\) and \(o \leq 0.90\). The figure should link to the `CHAR-012` record in TOE-TEST-0060, not introduce new values.

## A jump also needs an independent landing

Zahavy’s proposed world model addresses candidate generation: an agent can intervene, observe, and translate a simulated regularity into a rule. That may be important. It does not by itself answer how a system avoids verifying its own pre-encoded answer.

This is why we now separate three functions:

\[
\begin{aligned}
N(h,D) &: \text{novelty of hypothesis } h \text{ relative to evidence } D,\\
C(h,D) &: \text{coverage or entailment support from } D,\\
V(h,a) &: \text{result of a named intervention or executable check } a.
\end{aligned}
\]

An admission policy can make those dependencies visible:

\[
\operatorname{accept}(h) = [N(h,D) \geq \tau_N] \land [C(h,D) \geq \tau_C] \land [V(h,a) \geq \tau_V].
\]

The notation does not make the system correct. It makes the burden of proof separable. Retrieval and citation support contribute to \(C\). Search, symbolic synthesis, or a simulator may contribute to \(N\). A specified intervention contributes to \(V\). None should be silently substituted for another.

An additional local prototype review raised an even stricter warning: a final verdict can appear to come from reasoning scores while actually being selected by a human-authored expected-outcome field and a static barrier map. That review is **not** part of TOE-TEST-0060’s public evidence pack—the prototype is uncommitted and not cleanly reproducible—so we do not report it as an experimental result here. Its value is methodological: the next artifact must demonstrate verifier independence, not merely expose a candidate or calculate auxiliary scores.

This is the operational gap the position paper leaves open. A world model may help produce the jump. It does not remove the need for an admissible novelty contract or an independent verifier.

## Why the ledger is part of the scientific work

The executable companion keeps a boundary that prose alone cannot maintain:

- raw `verification_result.json` stays frozen;
- a separate derived analysis cites its SHA-256 rather than rewriting it;
- the replay command, source revision, dirty-worktree state, and non-claims are public;
- the ledger inspector exposes the paper-to-code mapping, integrity manifest, and verified rules separately.

This is not an attempt to replace peer review or prove a scientific theory with a dashboard. It is claim custody for the computational surface: a reader can inspect what was run, what failed, and what conclusion is deliberately withheld.

> Suggested figure placement: a screenshot of the TOE-TEST-0060 Analysis and Verified Rules panels, with the OpenReview paper link and `ABSTAIN` boundary visible.

## What we can claim—and what we cannot

We can claim that a concrete Missing Link source snapshot contained an empty novelty/grounding admission region in its biomedical profile, and that its preserved characterization fixture accepted zero of twelve generated candidates. We can also claim that public Flamehaven writing documented earlier attempts to build evidence-constrained hypothesis and governance pipelines.

We cannot claim that this proves Zahavy’s thesis about all LLMs. We cannot claim that action-controllable world models are necessary or sufficient for scientific discovery. We cannot claim that the current Missing Link implementation discovered a biomedical mechanism. And we do not turn the separate uncommitted prototype review into a public experimental result.

[TOE-TEST-0060](https://flamehaven01.github.io/Flamehaven-Verification-Ledger/eqa.html#toe-test-0060) is intentionally labeled **ABSTAIN**. Its contribution is a bounded, inspectable before-image—and a sharper requirement for the after-image:

\[
\text{proposal} \rightarrow \text{separate grounding test} \rightarrow \text{specified intervention} \rightarrow \text{ledgered decision}.
\]

> A model can propose a jump. A verifier must show what the jump touched, what it changed, and where it failed.

---

**Suggested LinkedIn closing:** If you build scientific agents, where do you draw the boundary between a novel proposal, evidence support, and an independently testable consequence?

**Suggested tags:** #AIResearch #ScientificAI #Abduction #WorldModels #Reproducibility #AIEvaluation #MLOps
