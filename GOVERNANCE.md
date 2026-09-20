# Governance

**Proposed bootstrap governance for the Open Decisions community draft.**
This document describes how work should be reviewed in this repository. It does
not claim an elected standards body, independent foundation, or existing
multi-party consensus.

## Purpose and stewardship

Open Decisions exists to make decisions portable, inspectable, and contestable
across implementations. The format must remain usable without the initiating
organization's products, tokens, hosted APIs, or commercial permission.

ImpactsAI hosts the initial repository. Until named maintainers accept roles in
this document, the repository's existing maintainers provide bootstrap editorial
stewardship. Repository access is operational authority, not a mandate to claim
that the broader community has adopted a specification. No additional person or
organization is represented as a member without their agreement.

Anyone may file an issue, propose an RFC, contribute code or documentation, or
build an independent implementation under the MIT license. Contributors should
disclose relevant affiliations and commercial interests in proposals.

## Changes and decisions

Editorial corrections can use a focused pull request. Changes to wire shape,
method semantics, authority boundaries, conformance, licensing, or governance
require an RFC and matching specification, schema, fixture, and test changes.

A normative proposal should remain open for at least 14 calendar days after its
complete text and fixtures are available. Maintainers should seek an independent
implementer's review and actively request counterexamples. Silence is not an
endorsement. Material unresolved objections must be recorded with the proposal's
disposition, rationale, and implementation evidence.

During bootstrap, a repository maintainer may merge a clearly marked draft after
review. If independent review is unavailable, the merge record must say so. The
proposal remains a draft. An author should not be the sole reviewer of their own
normative change. Exceptions for urgent corrections should be narrow, explained
publicly, and retrospectively reviewed.

Normative conflicts should be discussed on the associated RFC. Editors summarize
the competing interpretations and evidence. Unresolved substantive conflicts
remain open or cause a proposal to be deferred; editorial access cannot turn an
unresolved choice into a claim of community consensus.

## Maturity and release gates

| Stage | Minimum evidence |
| --- | --- |
| Draft | Written scope, schemas, examples, tests, named limitations |
| Candidate | At least two independently authored implementations exchange and replay shared fixtures; incompatibilities resolved; public review period announced |
| Stable 1.0 | Candidate evidence plus at least 30 days of public review, resolved normative objections, security/privacy assessment, published migration policy, and an explicitly named cross-organization maintainer group |

These are criteria for future review, not claims that they have been met. The
reference implementation and a port produced from the same implementation do not
automatically constitute independent interoperability evidence.

Released version directories and schema identifiers must be immutable. Corrections
that change accepted documents or calculated results require a new version and
migration notes. Before the first release, this draft branch is editable. There
is no release tag or stable compatibility promise merely because files exist.

For this pre-1.0 series, any normative change increments the draft identifier.
After 1.0, incompatible changes require a major version; additive optional
features require a minor version; editorial fixes use patch releases. Consumers
must still explicitly support a wire version rather than guessing compatibility.

## Growing community stewardship

Before a stable release, contributors should propose named editors and maintainers
from multiple independent organizations, transparent appointment and removal
criteria, decision rules, and a conflict-of-interest process. Such a charter needs
public review and acceptance by its participants. It must preserve the ability
to implement and fork the standard independently.

This project does not currently operate certification, accreditation, trademark
licensing, a paid registry, or a patent-policy program. Do not imply any of those
from a successful conformance run.
