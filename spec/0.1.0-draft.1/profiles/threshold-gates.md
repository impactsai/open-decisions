# Threshold eligibility profile

Identifier: `threshold-gates-v1`. Normative for Open Decisions 0.1.0-draft.1.

This method determines whether one option or claim satisfies declared
requirements. An `eligible` result expresses a determination only.

## Inputs

- Exactly one option and one scenario with `massBp: 10000` and empty `weights`.
- One or more criteria, all with role `requirement` and type `boolean` or
  `probability`.
- Exactly one gate per criterion with `rejectMaxBp < acceptMinBp`.
- One complete evaluation per criterion, unless the decision needs review or
  more information.

A boolean true maps to 10000 and false maps to 0. A probability uses its recorded
`probabilityBp`. Values are not combined into a joint probability. Passing
multiple gates does not imply independent evidence or a numerical probability
that the whole claim is correct.

## Algorithm and precedence

Process the following in order, stopping at the first applicable result:

1. If any supplied evaluation has `status: error`, return
   `{outcome: "review", reasons: ["evaluator_error"]}`.
2. If required evidence is absent, a target evaluation is absent, or an evaluation
   is `unavailable`, return `needs_information` with reason
   `missing_evaluation_or_evidence`.
3. If any required or referenced evidence expires at or before decision creation,
   return `needs_information` with reason `stale_evidence`.
4. For each gate, values at or above `acceptMinBp` pass; values at or below
   `rejectMaxBp` fail; values strictly between them require review.
5. Any failing gate returns `not_eligible` with reason `requirement_failed`.
6. Otherwise, any gate requiring review returns `review` with reason `threshold_gap`.
7. Otherwise, return `eligible`, reason `requirements_met`, and the sole option's
   ID as `selectedOptionId`.

Only the outcome, reasons, and (for eligibility) selected option appear in the
result. Ranking fields MUST NOT appear. Invalid shapes, references, or method
configuration are conformance errors, not business outcomes.

For the fictional fixture, a completion probability of 9500 passes its semantic
gate, 2000 fails it, and 9499 requires review. Supervisor acceptance is a separate
boolean gate. These thresholds are test data, not deployment recommendations.
An error can never be replaced with a zero probability to force rejection.

## Consequence boundary

Eligibility does not set a payment amount, validate a payee, reserve funds, verify
authority, submit a transaction, or establish settlement. A payment application
must provide those checks, a separate authorization, and appropriate receipts.
Changing model provider or rubric requires a new criterion method reference and
updated calibration; retaining the same numeric thresholds is not evidence of
comparable performance.
