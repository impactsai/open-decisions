# Weighted finite-scenario ranking profile

Identifier: `weighted-scenarios-v1`. Normative for Open Decisions 0.1.0-draft.1.

This profile compares options over an explicit finite set of joint preference
and utility scenarios. It is a small, replayable MCDA method, not a universal
model of preferences or a general stochastic inference engine.

## Inputs and assumptions

At least one criterion has role `preference` and value type `utility`. Optional
hard constraints have role `constraint` and type `boolean`. Other combinations
are invalid. Every scenario MUST give exactly one weight for every preference
criterion, including explicitly zero-weighted criteria. Weights MUST sum to
10000; scenario masses MUST also sum to 10000.

Every option/criterion/scenario needs an evaluation. The error, missing-data,
and stale-evidence checks are exactly steps 1–3 of the
[threshold profile](threshold-gates.md), before any ranking computation.
This conservative draft requires coverage even for options later excluded by
constraints; an optimization that changes that rule needs a separate profile.

Utilities have documented cardinal anchors, with larger values preferable.
Costs or risks must be transformed accordingly. The weighted sum assumes that
trade-offs are meaningfully additive. An application MUST assess and document
that assumption, normalization anchors, double counting, correlated evidence,
and the completeness of the option set. Model confidence is not a weight.

## Calculation

Let `m[s]` be scenario mass, `w[s,c]` its criterion weight, and `u[s,o,c]` the
recorded utility. All are integers measured on a scale of 0–10000.

1. Exclude an option globally if **any** of its hard constraints is false in
   **any** declared scenario. This makes a hard constraint non-compensatory.
2. If all options are excluded, return `no_viable_option`, reason
   `constraints_failed`, empty `rankings`, zero `tieMassBp`, and the sorted
   `excludedOptionIds`.
3. Compute each surviving option's unrounded score in each scenario:

   ```text
   score[s,o] = sum over preference criteria c of w[s,c] * u[s,o,c]
   ```

4. If exactly one option has the highest integer score, add the scenario's mass
   to its `soleFirstMassBp`. If several share the highest score, add the entire
   mass to `tieMassBp`; no option receives that mass.
5. Compute mean utility using exact integer arithmetic and round halves upward:

   ```text
   numerator[o] = sum over scenarios s of m[s] * score[s,o]
   meanUtilityBp[o] = floor((numerator[o] + 50000000) / 100000000)
   ```

6. Sort rankings by descending `soleFirstMassBp`, then descending mean utility,
   then ascending ASCII option ID. Sorting resolves display order only; it does
   not award tied scenario mass or confer recommendation status.
7. Let `best` be the first ranking entry. Let `lead` be its sole-first mass minus
   the second entry's mass (or zero for a missing second entry).
8. Recommend `best` only if its mass is at least `minimumTopShareBp` **and** the
   lead is at least `minimumLeadBp`. The schema requires the first threshold to
   exceed 5000 and the second to be positive.

The recommended result has outcome `recommended`, reason `scenario_support_met`,
`selectedOptionId`, `rankings`, `tieMassBp`, and `excludedOptionIds` (ASCII sorted).
Otherwise it has outcome `review`, reason `insufficient_scenario_support`, the
same ranking fields, and **no selected option**. For any nonempty ranking:

```text
sum(soleFirstMassBp) + tieMassBp = 10000
```

The reference code uses BigInt for products and division. Other languages MUST
produce exactly equivalent integer results. No random generator, provider call,
locale-specific sort, or floating-point tolerance is part of replay.

## Reading the output

In the [buying example](../../../examples/README.md), the repairable option wins
sole first place in 7900 of 10000 supplied scenario-mass units. This means 79% of
**the stated scenario mass**, conditional on the inputs and method. It does not
mean a 79% chance of satisfaction, correct evidence, or an objectively best buy.

A preference clarification creates a new request and new decision linked with
`supersedes`. Generating the best next question or estimating expected value of
information is outside this profile. The fixture demonstrates how such an answer
could change a supplied scenario set, not an implemented question-selection model.
