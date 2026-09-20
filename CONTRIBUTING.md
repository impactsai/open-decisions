# Contributing

Start with the [README](README.md), [core specification](spec/0.1.0-draft.1/core.md),
and [governance](GOVERNANCE.md). Bring a concrete interoperability problem, a
counterexample, or an independent implementation result.

## Propose a change

1. Check existing issues and RFCs for the same question.
2. For a normative change, copy [the RFC template](rfcs/0000-template.md) and
   describe the data shape before implementation details.
3. State trust assumptions, privacy implications, failure states, and effects on
   existing records. Include a valid and an invalid example where applicable.
4. Change normative prose, JSON Schema, conformance tooling, fixtures, and tests
   together. Preserve unknown-field rejection and version boundaries.
5. Run `npm ci --ignore-scripts` and `npm run check`. Report the actual results,
   limitations, and any external verification performed.
6. Open a pull request and identify the decision needed from reviewers.

No live model credentials, private evidence, payment secrets, or user memory are
needed. Use synthetic examples. Do not edit released version directories in place.

## Useful first contributions

- Independently implement the two profiles in another language and compare
  fixture outputs byte-for-byte after canonicalization.
- Find an ambiguity in uncertainty, numeric rounding, time, authority, or retries.
- Propose a narrowly specified signature or capability binding with negative tests.
- Test the record format in a different domain without changing core meanings.
- Improve explanations for users who need to contest a decision.

Contributions are provided under the repository's [MIT license](LICENSE). This
repository does not require assigning ownership to the host organization.
Treat contributors respectfully and follow the [code of conduct](CODE_OF_CONDUCT.md).
