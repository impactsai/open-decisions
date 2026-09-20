# RFC 0001: Portable decision records and two executable profiles

- Status: **Draft**
- Origin: Initial Open Decisions proposal, hosted by ImpactsAI
- Target version: 0.1.0-draft.1
- Review opened / closes: Not yet scheduled
- Independent implementation evidence: Not yet available

## Problem

A recommendation or eligibility verdict often loses the evidence snapshot,
preference assumptions, evaluator versions, governing rules, and authority when
it moves between applications. A model result can also be mistaken for permission
to act. An auditable record needs to retain those distinctions.

## Proposal

Adopt the [core record](../spec/0.1.0-draft.1/core.md),
[threshold profile](../spec/0.1.0-draft.1/profiles/threshold-gates.md), and
[scenario profile](../spec/0.1.0-draft.1/profiles/weighted-scenarios.md) as an initial
community draft. Use immutable snapshots, explicit references, canonical digests,
and a separate consequence chain. Begin with a complete, small numeric domain
and two fully specified methods.

See [design decisions](../docs/design-decisions.md) for the access patterns and
trade-offs. The [conformance suite](../spec/0.1.0-draft.1/conformance.md) supplies
executable behavior and deliberately invalid examples.

## Alternatives

A prose-only vocabulary is easier to agree on but cannot establish interoperable
calculation. A general-purpose policy language is more expressive but creates a
large compiler, execution, and security surface. A vendor-specific runtime would
reduce initial mapping work but make the community standard depend on one stack.
These alternatives remain worth testing against concrete implementation needs.

## Open questions

- Should reusable evidence slots replace request-specific evidence IDs?
- Which clinical, procurement, public-sector, and consumer practitioners should
  review contestability and assurance requirements?
- Is 10000-unit precision adequate for additional probabilistic profiles?
- How should native distributions carry dependence and calibration information?
- Which established signature and capability formats can carry records without
  introducing ambiguous trust or key-resolution behavior?

## Disposition

Proposed, implemented once as a reference, and awaiting community review.
No adopted-standard or independent-interoperability claim is made.
