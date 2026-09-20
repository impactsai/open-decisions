# Roadmap

This is a sequence of interoperability milestones, not a promised delivery date.

## Available in the initial draft

- Core decision and consequence records in JSON Schema 2020-12.
- Exact snapshot binding and canonical JSON digests.
- Threshold eligibility and weighted finite-scenario profiles.
- Offline validation, deterministic replay, positive/negative fixtures, and CI.
- Proposed bootstrap governance and an RFC process.

## Next: independent scrutiny

- Exercise both profiles in at least two independently authored implementations.
- Review the difference between protocol templates and request-specific evidence
  IDs; propose reusable evidence slots with unambiguous binding.
- Review evidence expiry, conflict disclosure, privacy-preserving audit, and
  adverse-decision recourse with practitioners.
- Resolve numeric, canonicalization, identifier, and lifecycle edge cases before
  proposing a candidate release.

## Proposed extensions

- [Signed records and trust binding](rfcs/0002-signed-proofs.md), including key
  rotation, revocation, identity, and capability scope.
- Native categorical and ordinal distributions with calibration metadata.
- Stochastic MCDA, sampling/dependence contracts, sensitivity, and value-of-information.
- Multi-action authorization, retries, revocation, and settlement event histories.
- Transport and discovery profiles (HTTP, MCP, credentials) after core interop.
- Reviewed adapters for Jev/Cloudflare, IXO runtimes, and consumer hosts.
- Domain-specific methods, including any clinical profile only after appropriate
  professional governance, validation, and human oversight.

A connector, signature, chain transaction, or payment is not implemented merely
because it appears on this roadmap. Community adoption and a stable 1.0 release
remain future milestones under [GOVERNANCE.md](GOVERNANCE.md).
