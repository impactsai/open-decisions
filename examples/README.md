# Read the examples

Every example is fictional and marked `simulation`. No real claim was verified,
no live provider was called, and no money moved. The retained
[evidence bytes](evidence/fixture.json) are a synthetic fixture, not proof of work
or a product data source. Other method, mandate, and receipt references are
synthetic placeholders and are not independently verified by the checker.

## Payment eligibility

[pay-simulation.json](valid/pay-simulation.json) records:

1. A fictional completion criterion (9800 basis points, explicitly uncalibrated)
   and a separate supervisor-acceptance criterion.
2. A threshold method returning `eligible`.
3. An action intent for a simulated USD 20 payment, using `amountMinor: "2000"`.
4. A separate fictional authorization.
5. A simulated execution receipt and a separate simulated settlement observation.

The amount is application data in the action; eligibility does not calculate or
approve it. All thresholds and probabilities are illustrative. The schema and
replay checker do not authenticate the supervisor, programme owner, or receipts.

[pay-not-eligible.json](valid/pay-not-eligible.json) has a failed supervisor gate.
[pay-missing-evidence.json](valid/pay-missing-evidence.json) is missing a required
criterion evaluation and requests more information.
[pay-provider-error.json](valid/pay-provider-error.json) records an evaluation
failure and requests review. None carries an actionable payment intent.

## A preference changes the comparison

The fictional products have utilities supplied by the fixture author:

| Option | Battery utility | Repair utility | Within budget |
| --- | ---: | ---: | --- |
| Repairable laptop | 5000 | 10000 | Yes |
| Endurance laptop | 9000 | 3000 | Yes |

The two scenarios describe different preferences, with utilities held fixed:

| Scenario | Battery weight | Repair weight | Winner |
| --- | ---: | ---: | --- |
| Repair first | 30% | 70% | Repairable |
| Battery first | 80% | 20% | Endurance |

[Before clarification](valid/buy-before-clarification.json), the scenarios each
have mass 5000: each option is sole first in 50% of the supplied scenario mass.
The policy requests review.

[After clarification](valid/buy-after-clarification.json), their masses are 7900
and 2100. Repairable is recommended, with mean utility 7975 versus 5430. The
protocol is unchanged; the request and decision have new IDs and digest-bound
`supersedes` references to the preceding records. Evaluation records bind the new
request explicitly.

The fixture author supplied the changed masses. There is no implemented model
that inferred them from a conversation, and no value-of-information engine chose
a question. 79% is conditional scenario support, not a probability of correctness.

## Negative fixtures

[manifest.json](manifest.json) names all fixture files and expected error codes.
The invalid directory contains mixed simulation/live records, an execution
without authorization, an altered recommendation, invalid scenario masses, and a
tampered protocol. Run `npm run examples` to check both acceptance and rejection.

To intentionally rebuild the fixtures after changing the specification:

```sh
node tools/build-examples.mjs
npm run check
```

Review changed values and keep the independently calculated assertions in the
test suite. Regeneration is not a substitute for interoperability testing.
