# TOE-TEST-0060: When a Missing Link Cannot Yet Jump

**Verdict:** ABSTAIN — configuration defect reproduced

**Paper anchor:** [Tom Zahavy, “Position: LLMs can't jump” (OpenReview)](https://openreview.net/forum?id=klU4737opt), ICML 2026 Position Paper Track.

**Scope:** An executable characterization of one repository snapshot. It asks what is missing when a textual Missing Link pipeline is used to operationalize the paper's abductive “jump.” It is not a general verdict on LLM abduction, a biomedical result, or a proof of the position paper.

**Editorial companion:** [When We Tried to Operationalize the “Jump”](../../writing/newsletter_llms_cant_jump_draft.md) (unpublished newsletter draft).

## The paper-to-code question

Zahavy’s position paper argues that scientific invention requires a non-deductive jump from experience to explanatory axioms, and proposes manipulative abduction in physically consistent simulation as the missing mechanism. Its question is not merely whether a model can continue text; it is whether a system can propose a new explanatory rule under sparse evidence and then make that rule answerable to consequences.

TOE-TEST-0060 operationalizes only a small part of that path:

```text
text evidence -> candidate mechanism -> admission contract -> intervention verifier
```

The fixture reaches the first two arrows, exposes a failure in the third, and never exercises the fourth. That is the result’s relevance to “LLMs can't jump”: before judging whether a system can make a jump, we must distinguish proposal, evidence support, and intervention rather than hiding all three inside a single score.

## Executable protocol

The canonical runner is [`run_dogfood.py`](run_dogfood.py). It executes:

```text
python -m pytest tests/characterization/test_char_missing_link_accept.py -q
```

It then reads the asserted before-image from the source-controlled characterization baseline and emits two machine-readable artifacts:

- [`verification_result.json`](verification_result.json): canonical observation and claim boundary.
- [`reproduction_receipt.json`](reproduction_receipt.json): source revision, content hashes, and replay command.
- [`analysis_result.json`](analysis_result.json): derived paper-to-code crosswalk, anchored to the frozen raw-result hash.

No source path on the public surface is a local filesystem path. The receipt deliberately says whether the source worktree was clean; this run was not a clean-release replication.

## What the code did—and did not—observe

`CHAR-011` supplies five biomedical evidence spans and asks for a mechanism linking GPR119 signalling to glycaemic control. It generates 12 candidates and accepts none. The maximum recorded grounding overlap is `0.15789473684210525`, below the required `0.90`; the recorded omega is `0.444`, below `0.80`; all candidates have `hallucinated` grounding status. Crucially for the paper-to-code mapping, all 12 are query restatements—not independently expressed explanatory bridges.

`CHAR-012` exposes the more compact configuration contradiction. In the biomedical profile, `novelty_overlap_mode = max`, so novelty is calculated from the same `max_single` overlap used by grounding:

```text
grounding: max_single >= 0.92
novelty:   1 - max_single >= 0.10  =>  max_single <= 0.90
```

The feasible region is empty. This is a configuration-level fact in this source snapshot, not a statistical evaluation result. It does not establish a metaphysical limit on LLM creativity; it establishes that this verifier cannot meaningfully adjudicate the kind of candidate it was asked to admit.

No action-controllable world model, physical simulator, or intervention check is called by this fixture. So 0060 does not test Zahavy’s proposed solution either.

## Why the verdict is ABSTAIN

The upstream test passes because it is intentionally a characterization test that preserves the defect before-image. A green pytest result therefore means “the recorded failure mode is still reproducible,” not “the system generated a valid missing link.”

The source checkout also contains uncommitted changes, and the paper input is recorded as a content hash of a local text copy rather than an archival public source. Those facts prevent a stronger external-verification label. Its positive contribution is not “LLMs cannot jump.” It is the narrower engineering result that a claimed jump has no scientific standing until the candidate, its support relation, and the intervention result are separately auditable.

## What a repair must demonstrate

Do not relabel the run PASS merely because candidates begin to flow. A credible after-image should:

1. split evidence coverage from maximum single-span grounding in both code and metric names;
2. remove the biomedical shared-quantity collision without silently weakening unrelated gates;
3. report which of grounding, omega, and novelty moved, on the same fixture;
4. add a held-out corpus or independently anchored benchmark before making an ability claim.
5. exercise a specified simulation or intervention before using “world-model grounding” as a result rather than as an architectural aspiration.

The exact source hashes, test outcome, and non-claims are in the JSON record rather than in prose alone.
