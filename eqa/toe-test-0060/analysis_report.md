# TOE-TEST-0060: Missing Link Admission Contract Dogfood

**Verdict:** ABSTAIN — configuration defect reproduced

**Scope:** An executable characterization of one repository snapshot. This is not a general verdict on LLM abduction, a biomedical result, or a proof of the accompanying position paper.

**Editorial companion:** [When We Tried to Operationalize the “Jump”](../../writing/newsletter_llms_cant_jump_draft.md) (unpublished newsletter draft).

## Question

When LOGOS’s Missing Link pipeline is run against its own characterization fixture, does its recorded admission contract actually permit a grounded candidate—and what, precisely, does that result establish?

## Executable protocol

The canonical runner is [`run_dogfood.py`](run_dogfood.py). It executes:

```text
python -m pytest tests/characterization/test_char_missing_link_accept.py -q
```

It then reads the asserted before-image from the source-controlled characterization baseline and emits two machine-readable artifacts:

- [`verification_result.json`](verification_result.json): canonical observation and claim boundary.
- [`reproduction_receipt.json`](reproduction_receipt.json): source revision, content hashes, and replay command.

No source path on the public surface is a local filesystem path. The receipt deliberately says whether the source worktree was clean; this run was not a clean-release replication.

## Observed contract

`CHAR-011` generates 12 candidates from five evidence spans and accepts none. The maximum recorded grounding overlap is `0.15789473684210525`, below the required `0.90`; the recorded omega is `0.444`, below `0.80`; all candidates have `hallucinated` grounding status. The test also records 12 query restatements.

`CHAR-012` exposes the more compact configuration contradiction. In the biomedical profile, `novelty_overlap_mode = max`, so novelty is calculated from the same `max_single` overlap used by grounding:

```text
grounding: max_single >= 0.92
novelty:   1 - max_single >= 0.10  =>  max_single <= 0.90
```

The feasible region is empty. This is a configuration-level fact in this source snapshot, not a statistical evaluation result.

## Why the verdict is ABSTAIN

The upstream test passes because it is intentionally a characterization test that preserves the defect before-image. A green pytest result therefore means “the recorded failure mode is still reproducible,” not “the system generated a valid missing link.”

The source checkout also contains uncommitted changes, and the paper input is recorded as a content hash of a local text copy rather than an archival public source. Those facts prevent a stronger external-verification label. The artifact is still useful: it creates a hard, inspectable baseline before a repair changes metric definitions or admission gates.

## What a repair must demonstrate

Do not relabel the run PASS merely because candidates begin to flow. A credible after-image should:

1. split evidence coverage from maximum single-span grounding in both code and metric names;
2. remove the biomedical shared-quantity collision without silently weakening unrelated gates;
3. report which of grounding, omega, and novelty moved, on the same fixture;
4. add a held-out corpus or independently anchored benchmark before making an ability claim.

The exact source hashes, test outcome, and non-claims are in the JSON record rather than in prose alone.
