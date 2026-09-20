# Security and trust

This repository contains an experimental exchange standard and offline checker.
There is no production service or operational payment executor here. Only the
current draft receives fixes; no support period or response-time commitment has
been established.

Report public, non-sensitive specification defects through an issue. For a
vulnerability with private details, arrange a private channel with a repository
maintainer before disclosing the exploit or affected data. If GitHub private
vulnerability reporting is enabled for the repository, use its reporting flow.
Do not include credentials, private evidence, or personal records in public issues.

The checker deliberately does not fetch references or evaluate embedded code.
Applications must separately protect retrieval against SSRF, sandbox evaluator
inputs, validate identity and authority, enforce retention, handle revocation,
and reconcile execution and settlement. A digest match is not proof of trust.

See the [core security requirements](spec/0.1.0-draft.1/core.md) and
[conformance limits](spec/0.1.0-draft.1/conformance.md).
