# Fictional comparison fixtures

All devices and evidence here are fictional. No provider or live data is used.

`fictional-buy.json` contains a comparison kit, its evaluation context, frozen
assessments, and one comparison request. `manifest.json` is the engine's work
order compiled from that kit. The exact expected output is `expected-exact.json`.
`expected-monte-carlo.json` uses the same bundle with computation changed to
`{ "mode": "monte-carlo", "algorithm": "xoshiro128ss-v1", "samples": 10000 }`.
The latter is a cross-runtime reproducibility vector, not independent proof of
the statistical method.

A has price utility 8000 and fit utility 10000 with mass 80%, or 0 with mass 20%.
B has price utility 5000 and fit utility 10000. Weights are 50/50. A therefore
wins 80% of scenarios and has expected utility 8000 and regret 700. B's expected
utility is 7500 and regret 1200. C fails a hard constraint and is excluded.

```js
import { compare, parseComparisonJSON } from 'open-decisions/comparison';

const bundle = parseComparisonJSON(fixtureText);
const result = await compare(bundle);
```

For a preference revision, keep the context and assessment-set digests and change
the request ID and admissible weights. Evidence or kit changes require new
bindings. `compare` throws `ComparisonError` for invalid input; valid dependency
failures return `needs-information` or `review-required` without a ranking.

`open-decisions/comparison/contracts` contains just the portable compiler and
validators for manifest producers and assessment consumers. It imports no kernel,
provider, Node built-in, or dynamically generated code. The numerical kernel is
available only through `open-decisions/comparison`.

This package is a pinned Git dependency while the profile is under community
review. There is no claim that it has been published to npm or adopted as a standard.
