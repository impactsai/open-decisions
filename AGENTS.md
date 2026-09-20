# Working on Open Decisions

Read README.md, spec/0.1.0-draft.1/core.md, and GOVERNANCE.md first.
This is a community draft, not an adopted or certified standard.

The JSON Schema is the source of truth for the wire shape. Normative prose
defines semantics; the reference validator and fixtures must agree with both.
Change these together. Never silently accept an unknown version or method.

Keep evaluation, determination, authorization, execution, and settlement
separate. No network, provider, wallet, identity system, or vendor is mandatory.
Never turn schema validity, a digest, or a model score into a trust claim.
Use fictional evidence in examples. Preserve the MIT license.

Run `npm ci --ignore-scripts` and `npm run check`. Tests must cover meaningful
boundary behavior, including invalid records and failed dependencies.
Do not call live providers or execute actions from conformance tooling.
