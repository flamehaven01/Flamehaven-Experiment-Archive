# TOE-TEST-0042 -- Meta Verify Orchestration

## Scope

This entry records the first orchestration layer above the delta-manifest
selector.

## Pipeline

`toe-meta --orchestrate --include-zenith --post-analyze`

Current bounded flow:

1. build delta manifest
2. run optional `dfi-zenith` preflight
3. execute selected pytest subset
4. run lightweight static Ultra-Meta-Pytest post-analysis

## Why bounded static post-analysis

Full meta-quality analysis is too expensive for routine development loops in
the current TOE repository. The orchestration layer therefore uses a bounded
static pass focused on:

- assertion quality
- meta-coherence
- proxy coverage/performance placeholders for delta runs

This keeps the orchestration layer useful without pretending that a lightweight
post-analysis is equivalent to full release-grade quality analysis.

## Result

`toe-meta` is now more than a selector. It is a repeatable verification
pipeline with explicit preflight, execution, and post-analysis stages.
