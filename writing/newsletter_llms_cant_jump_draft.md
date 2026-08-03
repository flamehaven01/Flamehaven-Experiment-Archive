# When We Tried to Operationalize the "Jump"

**Subtitle:** A position paper on abduction, a Missing Link pipeline, and the engineering cost of asking a system to be both novel and grounded.

**Series:** Equation to Artifact
**Status:** Editorial draft — not yet published. Its bounded executable companion is [TOE-TEST-0060](../eqa/toe-test-0060/analysis_report.md).

**LinkedIn preview:** We tried to turn an abductive “jump” into a governed hypothesis pipeline. The first practical result was not a discovery: it was an empty acceptance region. That failure exposes a missing engineering layer in the current debate over LLMs, world models, and scientific invention.

**Estimated reading time:** 7 minutes

[Tom Zahavy's ICML 2026 position paper, *"Position: LLMs can't jump"*](https://openreview.net/forum?id=klU4737opt) makes a useful provocation: a system can be excellent at compressing observations and deriving consequences without being able to introduce the premise that reorganizes the problem.

The paper uses Einstein's route to general relativity to call that introduction a *jump*: from experience to an axiom, then from the axiom to its consequences.

We wanted to ask a smaller and more operational question.

What happens when an engineering system is asked to produce a missing explanatory link from evidence, while also being required to demonstrate that the link is not a hallucination?

We did not build a test of whether all LLMs can or cannot abduct. We ran and audited an existing LOGOS Missing Link pipeline. The result was less philosophical and more useful: before a system can be trusted to make a "jump," it needs a precise contract for the trade-off between novelty, grounding, and verification. Our first implementation did not have one.

That is not a failure to hide. It is the practical gap the paper leaves largely unspecified.

## The paper's sharp claim

The paper organizes inference with Peirce's familiar three-way distinction. In compressed notation:

\[
\begin{aligned}
\text{Deduction:} &\quad \mathrm{Rule} + \mathrm{Case} \rightarrow \mathrm{Result}\\
\text{Induction:} &\quad \mathrm{Case} + \mathrm{Result} \rightarrow \mathrm{Rule}\\
\text{Abduction:} &\quad \mathrm{Rule} + \mathrm{Result} \rightarrow \mathrm{Case}\;?
\end{aligned}
\]

Zahavy's larger story is Einstein's:

\[
E \xrightarrow{J} A \xrightarrow{\text{deduction}} S,
\]

where \(E\) is sensory experience, \(J\) is the non-deductive jump, \(A\) is a system of axioms, and \(S\) is the resulting formal structure and its consequences. The paper's important challenge to a pure compression account is that an apparently well-fitting theory does not necessarily expose a large supervised error signal telling an optimizer to replace its foundations.

That is a serious point. It is also not yet an executable criterion. The paper moves from Peirce's logical schema to *manipulative abduction*—embodied, controllable simulation—without showing how a system should decide that a proposed new rule is both sufficiently new and sufficiently warranted.

That decision is where software becomes unforgiving.

## We found the trade-off in twelve candidates

LOGOS's Missing Link runner is intended to propose grounded hypotheses from evidence spans. It extracts seeds, expands them through templates such as `causal link {seed}` and `mechanism {seed}`, scores candidates, and retains only those that clear novelty, plausibility, omega, and grounding gates.

Its novelty calculation is intentionally simple:

```python
def _estimate_novelty(self, hypothesis, evidence_spans):
    overlap = self._aggregate_overlap(hypothesis, evidence_spans)
    return max(0.0, min(1.0, 1.0 - overlap))
```

The strict acceptance path then requires a candidate to be novel enough, high-scoring enough, and grounded enough to receive a `clean` status:

```python
if (omega >= min_omega
    and candidate.novelty_score >= novelty_min
    and candidate.plausibility_score >= plausibility_min
    and (not strict or grounding["status"] == "clean")):
    accept(candidate)
```

These are real excerpts from the runner; the second block is condensed only to remove surrounding list-comprehension syntax. The important fact is not the coding style. It is that the same evidence-overlap family is serving two incompatible jobs: reward distance from the evidence and certify attachment to the evidence.

For the pinned biomedical profile, the relevant configuration was:

```yaml
grounding_overlap_min: 0.92
novelty_min: 0.10
novelty_overlap_mode: max
```

Let \(o\) be the maximum single-span Jaccard overlap. The code defines novelty as \(n = 1-o\). The two gates therefore require

\[
o \geq 0.92 \quad \text{and} \quad 1-o \geq 0.10,
\]

or equivalently

\[
o \geq 0.92 \quad \text{and} \quad o \leq 0.90.
\]

The feasible region is empty.

This is a better lesson than a glossy demo. A purportedly abductive system can be prevented from accepting anything not because it lacks a mysterious creative faculty, but because the implementation has assigned one scalar two contradictory meanings.

We also re-ran the broader characterization probe on a textbook biomedical bridging input. It generated 12 candidates and accepted 0. The maximum observed grounding overlap was `0.1579` against a required `0.90`; observed omega was `0.444` against a required `0.80`; every candidate was classified as hallucinated; all 12 began as a restatement of the query.

This is not evidence that an LLM is *structurally incapable* of scientific discovery. It is evidence that this pipeline, at this configuration and this commit state, did not operationalize a viable admission rule for a novel mechanistic link.

That distinction is the whole point.

## The missing step is not only embodiment. It is claim custody.

The paper's proposed escape route is an action-controllable world model: instead of producing text about a thought experiment, an agent could intervene in a physically consistent simulation and observe the result.

That may improve candidate generation. It does not remove the next problem.

After an agent proposes an axiom or mechanism, what makes it admissible?

In practice, an abductive system needs at least three distinct objects:

\[
\begin{aligned}
N(h,D) &: \text{novelty of hypothesis } h \text{ relative to evidence } D,\\
C(h,D) &: \text{coverage or entailment support from } D,\\
V(h,a) &: \text{result of a specified intervention or executable check } a.
\end{aligned}
\]

An admission policy can then be explicit:

\[
\operatorname{accept}(h) = [N(h,D) \geq \tau_N] \land [C(h,D) \geq \tau_C] \land [V(h,a) \geq \tau_V].
\]

The symbols do not make the system correct. They make the obligations separable. A world model can contribute to \(V\). Evidence retrieval can contribute to \(C\). Search, simulation, or a language model can contribute to \(N\). If a single token-overlap number is asked to stand in for all three, the gate can become incoherent while still looking numerically rigorous.

This is also where the paper should be more careful. Its historical case does not show that there was literally no signal before general relativity: the paper itself discusses Mercury's perihelion and the conceptual tension between mechanics and field theory. A more defensible claim is that *statistical prediction error was not enough to specify the new axiom*. That is different from saying that the discovery process had no usable constraints.

Likewise, Peirce's formal abduction and embodied simulation should be treated as distinct hypotheses, not silently equated. An embodied world model may be necessary for some discoveries; this paper does not establish that it is necessary for all symbolic or language-mediated thought experiments.

## What our code changed in the discussion

The Missing Link audit adds two practical constraints that the position paper does not fully price in.

First, anti-hallucination is not the opposite of novelty, but it is not free. A system needs separate metrics and a visible trade-off policy. If the policy is too strict, it admits only paraphrase. If it is too loose, it rewards unsupported invention. The frontier must be measured, not declared.

Second, verification outside a closed formal system is not automatically solved. In a separate cross-domain no-go experiment, the final verdict was derived from a human-authored sign-barrier map. The AATS and IRF scores were recorded, but they did not determine the reported no-go verdict. That is still a useful experiment—provided it is described as a calibration harness rather than as autonomous discovery or autonomous verification.

The consequence is modest but important: the practical architecture is not simply

\[
\text{LLM} \rightarrow \text{world model} \rightarrow \text{abduction}.
\]

It is closer to

\[
\text{proposal} \rightarrow \text{separate grounding test} \rightarrow \text{specified intervention} \rightarrow \text{ledgered decision}.
\]

Each arrow needs a trace. Each score needs a definition. Each result needs a statement of what did *not* happen.

## What we can claim—and what we cannot

We can claim that a concrete, runnable Missing Link configuration had an empty novelty/grounding acceptance region in its biomedical profile, and that its broader characterization probe admitted zero of twelve generated candidates. The code, configuration, test, and raw measurements are preserved for review.

We cannot claim that this proves Zahavy's thesis about all LLMs. We cannot claim that action-controllable world models are sufficient for abduction. We cannot claim that the current Missing Link implementation discovered a biomedical mechanism.

Those negatives are not rhetorical caution. They are how an executable artifact remains useful after the surrounding model changes.

[TOE-TEST-0060](../eqa/toe-test-0060/analysis_report.md) now freezes the implementation revision, test command, measured values, input hashes, non-claims, and a separate paper-to-code crosswalk. It is intentionally labeled **ABSTAIN**: the executable result is a repository-contract reproduction on a dirty source snapshot, not a released scientific result or a general claim about LLM ability.

> A model can propose a jump. A verifier must show what the jump touched, what it changed, and where it failed.

That is the practical standard we are trying to build.

---

**Suggested LinkedIn closing:** If you build scientific agents, how do you keep novelty, evidence support, and counterfactual verification from collapsing into one opaque score?

**Suggested tags:** #AIResearch #ScientificAI #Abduction #WorldModels #Reproducibility #AIEvaluation #MLOps
