# RFC 0004: Decision Evals

Status: proposed community draft, 21 September 2026. Parent: [IXO-5105](https://linear.app/ixo-world/issue/IXO-5105).

Decision Evals defines portable benchmark evidence and executable calibration for a
complete Evaluation Kit configuration. It adds `decision-evals/0.1.0-draft.1`
without changing the core or comparison profile's existing versions. It does not
certify a model, evidence, a methodology, or a determination.

The [specification](../spec/decision-evals/0.1.0-draft.1/core.md),
[wire schema](../schemas/decision-evals/0.1.0-draft.1/contract.schema.json),
[reference library](../evals/index.mjs), and fictional examples must be reviewed
together. The [implementation plan](../docs/decision-evals-implementation.md)
assigns the Oracle, Engine, and pilot integration work.

## Motivation

[Jevbench](https://github.com/fstandhartinger/jevbench) reports variation under
answer ordering and distinguishes native from verbalized probability outputs.
These observations motivate configuration-specific tests; its measurements do
not calibrate IXO's populations. [Guo et al.](https://proceedings.mlr.press/v70/guo17a.html)
distinguish predictive accuracy from empirical probability calibration.

A reusable model card must identify the rubric, evidence transforms, prompt
renderer, ordering, batching, actual model revision, output mapping and decision
method. Reporting that one model was tested is insufficient. A release must bind
the exact tested resources and cannot inherit calibration after repinning them.

## Decisions

- Every published kit includes `model-card.json`; insufficient or failed reports
  allow experimental use only.
- Domain owners supply reviewed population, sample and error policies; no
  universal consequential-use threshold is invented.
- Fact probabilities, asserted-value confidence, determination reliability,
  rank support and statistical uncertainty are separate quantities.
- Calibration and report computation are offline. Live benchmarking belongs to
  an explicit, bounded Oracle adapter and never executes domain actions.
- Validation replays fitting, reports and card aggregation. This checks internal
  consistency, not independent label truth or the reviewer's authority.
- Current claim requests, comparison records and receipts remain readable under
  their original semantics. New behavior uses explicit interfaces and profiles.

## Review and limitations

The normative review period is at least 14 calendar days after complete text and
fixtures are available. Seek independent implementer review and counterexamples;
record unresolved objections. No independent interoperability, partner-approved
pilot calibration, stable adoption, deployment or certification is claimed.

Synthetic examples cannot establish live performance. The initial classwise
isotonic multiclass method may lose sharpness or change the most likely label;
accept it only after full-vector and end-to-end held-out validation. Raw logits
and arbitrary scores require a separately versioned mapping and are unavailable
to these reference calibrators. No online self-training or automatic promotion.
