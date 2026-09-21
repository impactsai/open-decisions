# Decision Evals implementation and delivery

Status: implementation draft, pending normative review. MIT. No adoption, certification, methodology approval or live activation is implied. RFC 0004 follows the repository's 14-day review expectation.

## Protocol package

`open-decisions/evals` exports strict offline record validation, grouped observation scoring, exact binary PAV and categorical normalized isotonic calibration, application checks, report/model-card generation, release preflight and confidence evaluation. Its wire contract is [the JSON Schema](../schemas/decision-evals/0.1.0-draft.1/contract.schema.json); [the specification](../spec/decision-evals/0.1.0-draft.1/core.md) defines semantics. Generated portable validators and TypeScript types are checked for freshness. The core and comparison 0.1 contracts are unchanged.

`calibrated-comparison/0.1.0-draft.1` is an explicit adapter over comparison 0.1. It calibrates assessment masses before utility conversion. The release must bind both the executable projection and the final comparison kit. The projection removes only each criterion's `acceptedCalibrationDigests`; changing anything else requires rebenchmarking. Calibration cannot silently change correlated joint scenarios: affected joint requests are held for review until new joint scenarios are supplied under a reviewed profile. Missing outcome values cannot be invented when calibration assigns positive mass to a formerly absent outcome.

## Delivery sequence and ownership

| Work | Repository | Linear | Completion gate |
| --- | --- | --- | --- |
| Parent and specification | Open Decisions | [IXO-5105](https://linear.app/ixo-world/issue/IXO-5105) | Normative review; no claim of adoption |
| Schemas, model cards and conformance | Open Decisions | [IXO-5106](https://linear.app/ixo-world/issue/IXO-5106) | Negative fixtures and offline replay |
| Metrics and calibration | Open Decisions | [IXO-5107](https://linear.app/ixo-world/issue/IXO-5107) | Exact boundaries, grouped denominators, nonzero finite-sample error bounds |
| Runner and provenance | eval-oracle | [ORA-502](https://linear.app/ixo-world/issue/ORA-502) | Actual handlers with injected transports; explicit provider budget |
| Packaging/publication | eval-oracle | [ORA-503](https://linear.app/ixo-world/issue/ORA-503) | Final resource bytes match the benchmark; bundled model card |
| Fact and cache bindings | eval-oracle | [ORA-504](https://linear.app/ixo-world/issue/ORA-504) | Raw typed predictions and complete execution/input cache identity |
| Confidence/policy runtime | decision-engine | [IXO-2452](https://linear.app/ixo-world/issue/IXO-2452) | Server-accepted release; both approval and rejection gated |
| Receipts/replay/suspension | decision-engine | [IXO-5108](https://linear.app/ixo-world/issue/IXO-5108) | Immutable history, no v1 downgrade, request conflicts fail |
| Yoma mapping DTP | eval-oracle/examples | [IXO-5109](https://linear.app/ixo-world/issue/IXO-5109) | Representative independent labels and partner policy |
| Connectivity DTB | eval-oracle/examples | [IXO-5110](https://linear.app/ixo-world/issue/IXO-5110) | Independent acceptable-option labels with frozen preferences |

The Engine comparison foundation is [IXO-5104](https://linear.app/ixo-world/issue/IXO-5104), whose comparison-manifest PR was open when implementation began. Shared contracts reuse IXO-5103 and ORA-501. Both pilot issues are related to IXO-4668 and IXO-4701; their existing delivery scope now includes calibration and model cards. IXO-2452 retains its history and targets the current decision-engine repository.

## Cross-repository contracts

The Oracle adapter consumes this exact protocol implementation. Offline replay has no provider or action capability. A provider run explicitly selects a driver, reserves its maximum cost before each invocation, captures resolved revision and rendered request/response commitments, and records every incomplete or unattempted observation. A hosted alias without a resolved revision cannot pass configuration validation. A digest records provenance, not truth; retained transcripts and adjudication evidence must be available to authorized auditors.

Publication occurs after protocol/form references are final. Kit preflight checks resource bytes and the full replayable bundle. A failed or insufficient card may be distributed only as experimental. No command in Open Decisions retrieves evidence, signs transactions, or executes actions.

The Engine resolves registration and policy through its existing operator authority. A versioned v2 request contains raw prediction evidence; submitted confidence is never trusted as calibrated confidence. The engine freezes the accepted artifacts, computes the base rubric result and calibration separately, and retains a use/review gate. Missing confidence is not a false fact or an automatic adverse decision. Existing decided-once claim behavior and legacy receipt verification stay intact. Comparison request IDs are scoped to callers and cannot be reused with different input digests.

Receipts bind the release, model card, configuration, calibrations, policy event, request and result. Suspension and replacement append new events; historical computation stays reproducible against its original time and artifacts. A valid historical receipt is not current authorization to act.

## Statistical and operational gates

Public fixtures are fictional and report insufficient validation. Domain partners must supply independent labels, error limits, minimum sample sizes, required populations/strata and adjudication provenance. No schedule, thresholds, partner approval or real performance claim is invented in this implementation.

Freeze groups and partitions before acceptance testing; fit facts, then determination mappings, then test the complete frozen pipeline. Calibration fitting replay verifies that published parameters follow the declared observations. It cannot independently establish that the runner executed the declared configuration, that labels are independent, or that supplied evidence is authentic. These require audited provenance and domain review.

The initial reference reports use conservative per-metric 95% Hoeffding bounds on independent baseline groups. They do not promise simultaneous familywise coverage across all metrics or strata. Point-valued descriptive metrics carry denominators; where the reference implementation does not estimate an interval it publishes null bounds with an explanation. Cost/latency do not decide acceptance.

After independent validation: shadow operation, partner approval, explicit operator acceptance, then monitored activation. Coverage, errors, configuration changes and calibration drift require reviewed monitoring; a policy breach suspends the affected configuration and reactivation requires a new reviewed acceptance event. Production provider benchmarking, deployed migrations, operational evidence collection, and activation are separate rollout work, not accomplished by passing synthetic tests.
