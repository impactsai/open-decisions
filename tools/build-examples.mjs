import { writeFileSync } from 'node:fs';
import canonicalize from 'canonicalize';
import { digest, reference, inputDigest, bundleDigest } from './json.mjs';
import { evaluateSnapshot } from './validator.mjs';

const issued = '2026-09-20T12:00:00Z';
const evaluated = '2026-09-20T12:01:00Z';
const decided = '2026-09-20T12:02:00Z';
const expiry = '2026-09-21T12:00:00Z';
const engine = 'urn:example:decision-service';
const evaluator = 'urn:example:evaluator';
const method = { id: 'urn:example:method:fixture', version: '1', digest: digest({ method: 'Fictional fixture; values supplied for conformance testing only.' }) };
const basis = { id: 'urn:example:authority:terms', digest: digest({ authority: 'Fictional programme terms; grants no real authority.' }) };
const rawEvidence = { fictional: true, description: 'A fictional work report and fictional product comparison. No real person, product, claim, price, or payment.' };
writeFileSync(new URL('../examples/evidence/fixture.json', import.meta.url), canonicalize(rawEvidence));
const evidence = { id: 'urn:example:evidence:fixture', digest: digest(rawEvidence), mediaType: 'application/json', source: 'urn:example:local-file:examples/evidence/fixture.json', observedAt: '2026-09-20T11:00:00Z', expiresAt: expiry, access: 'public', description: 'Synthetic test evidence only; not an attestation of real events.' };

function protocol(id, criteria, calculation) {
  return { id: `urn:example:protocol:${id}`, version: '1', title: `Fictional ${id}`, purpose: 'Demonstrate interoperable records without live actions.', criteria, method: calculation, authority: { determiner: engine, basis, reviewContact: 'https://example.org/review' }, evidencePolicy: { description: 'Retain the synthetic input used by these fixtures.', requiredEvidenceIds: [evidence.id] } };
}
function criterion(id, role, valueType) {
  return { id, label: id, question: `What is the declared ${id} result?`, role, valueType, method };
}
function request(p, options, scenarios) {
  return { id: `urn:example:request:${p.id.split(':').at(-1)}`, protocolRef: reference(p), createdAt: issued, purpose: p.purpose, mode: 'simulation', disclosures: [], options, evidence: [structuredClone(evidence)], scenarios, contextPolicy: { basis: 'Synthetic public fixture with no personal context.', allowedRecipients: [engine, evaluator], retentionUntil: '2026-10-20T12:00:00Z' } };
}
function evaluation(r, scenarioId, optionId, criterionId, value) {
  return { id: `urn:example:evaluation:${r.id.split(':').at(-1)}:${scenarioId}:${optionId}:${criterionId}`, requestRef: reference(r), scenarioId, optionId, criterionId, evidenceIds: [evidence.id], evaluator: { id: evaluator, kind: 'deterministic', method }, completedAt: evaluated, status: 'complete', value };
}
function seal(bundle, recalculate = true) {
  bundle.request.protocolRef = reference(bundle.protocol);
  for (const e of bundle.evaluations) e.requestRef = reference(bundle.request);
  bundle.decision.inputDigest = inputDigest(bundle);
  if (recalculate) bundle.decision.result = evaluateSnapshot(bundle, bundle.decision.createdAt);
  if (bundle.action) bundle.action.decisionRef = reference(bundle.decision);
  if (bundle.authorization && bundle.action) bundle.authorization.actionRef = reference(bundle.action);
  if (bundle.execution) {
    if (bundle.action) bundle.execution.actionRef = reference(bundle.action);
    if (bundle.authorization) bundle.execution.authorizationRef = reference(bundle.authorization);
  }
  if (bundle.settlement && bundle.execution) bundle.settlement.executionRef = reference(bundle.execution);
  bundle.integrity = { algorithm: 'sha-256-jcs', digest: bundleDigest(bundle) };
  return bundle;
}
function bundle(p, r, es) {
  return seal({ specVersion: '0.1.0-draft.1', protocol: p, request: r, evaluations: es, decision: { id: `urn:example:decision:${r.id.split(':').at(-1)}`, issuer: engine, createdAt: decided, expiresAt: expiry, inputDigest: inputDigest({ protocol: p, request: r, evaluations: es }), result: { outcome: 'review', reasons: ['pending'] } } });
}
function pay() {
  const p = protocol('pay', [criterion('completion', 'requirement', 'probability'), criterion('supervisor', 'requirement', 'boolean')], { id: 'threshold-gates-v1', gates: [{ criterionId: 'completion', acceptMinBp: 9500, rejectMaxBp: 2000 }, { criterionId: 'supervisor', acceptMinBp: 10000, rejectMaxBp: 0 }] });
  const r = request(p, [{ id: 'claim', label: 'Fictional work claim' }], [{ id: 'base', massBp: 10000, weights: [] }]);
  return bundle(p, r, [evaluation(r, 'base', 'claim', 'completion', { kind: 'probability', probabilityBp: 9800, calibration: { status: 'uncalibrated' } }), evaluation(r, 'base', 'claim', 'supervisor', { kind: 'boolean', value: true })]);
}
function buy(mass, id) {
  const p = protocol('buy', [criterion('battery', 'preference', 'utility'), criterion('repair', 'preference', 'utility'), criterion('budget', 'constraint', 'boolean')], { id: 'weighted-scenarios-v1', minimumTopShareBp: 7500, minimumLeadBp: 2000 });
  const r = request(p, [{ id: 'repairable', label: 'Fictional repairable laptop' }, { id: 'endurance', label: 'Fictional long-battery laptop' }], [
    { id: 'repair-first', massBp: mass, weights: [{ criterionId: 'battery', weightBp: 3000 }, { criterionId: 'repair', weightBp: 7000 }] },
    { id: 'battery-first', massBp: 10000 - mass, weights: [{ criterionId: 'battery', weightBp: 8000 }, { criterionId: 'repair', weightBp: 2000 }] }
  ]);
  r.id = `urn:example:request:${id}`;
  const es = r.scenarios.flatMap(s => r.options.flatMap(o => [
    evaluation(r, s.id, o.id, 'battery', { kind: 'utility', utilityBp: o.id === 'repairable' ? 5000 : 9000 }),
    evaluation(r, s.id, o.id, 'repair', { kind: 'utility', utilityBp: o.id === 'repairable' ? 10000 : 3000 }),
    evaluation(r, s.id, o.id, 'budget', { kind: 'boolean', value: true })
  ]));
  return bundle(p, r, es);
}
function lifecycle(b) {
  const executor = 'urn:example:simulator';
  b.action = { id: 'urn:example:action:pay', decisionRef: reference(b.decision), mode: 'simulation', optionId: 'claim', type: 'urn:example:action-type:payment', parameters: { currency: 'USD', amountMinor: '2000', beneficiary: 'urn:example:beneficiary:fictional' }, executor, createdAt: '2026-09-20T12:03:00Z', expiresAt: expiry, idempotencyKey: 'fictional-pay-001' };
  b.authorization = { id: 'urn:example:authorization:pay', actionRef: reference(b.action), issuer: 'urn:example:programme-owner', executor, status: 'granted', createdAt: '2026-09-20T12:04:00Z', expiresAt: expiry, authorityEvidence: basis };
  b.execution = { id: 'urn:example:execution:pay', actionRef: reference(b.action), authorizationRef: reference(b.authorization), executor, mode: 'simulation', startedAt: '2026-09-20T12:05:00Z', completedAt: '2026-09-20T12:06:00Z', status: 'succeeded', externalRef: { id: 'urn:example:simulation:execution', digest: digest({ simulated: true }) } };
  b.settlement = { id: 'urn:example:settlement:pay', executionRef: reference(b.execution), issuer: executor, mode: 'simulation', observedAt: '2026-09-20T12:07:00Z', status: 'settled', externalRef: { id: 'urn:example:simulation:settlement', digest: digest({ simulated: true, settled: true }) } };
  return seal(b);
}
const before = buy(5000, 'buy-before');
const after = buy(7900, 'buy-after');
after.request.supersedes = reference(before.request);
after.decision.supersedes = reference(before.decision);
seal(after);
const missing = pay(); missing.evaluations.pop(); seal(missing);
const error = pay(); delete error.evaluations[0].value; error.evaluations[0].status = 'error'; error.evaluations[0].issue = { code: 'provider_unavailable', description: 'Fictional provider outage.' }; seal(error);
const rejected = pay(); rejected.evaluations[1].value.value = false; seal(rejected);
const valid = { 'pay-simulation': lifecycle(pay()), 'pay-missing-evidence': missing, 'pay-provider-error': error, 'pay-not-eligible': rejected, 'buy-before-clarification': before, 'buy-after-clarification': after };
const invalid = {};
let b = structuredClone(valid['pay-simulation']); b.execution.mode = 'live'; seal(b); invalid['mixed-simulation-live'] = { bundle: b, code: 'mode_mismatch' };
b = structuredClone(valid['pay-simulation']); delete b.authorization; seal(b); invalid['missing-authorization'] = { bundle: b, code: 'authorization_required' };
b = structuredClone(after); b.decision.result.selectedOptionId = 'endurance'; seal(b, false); invalid['forged-recommendation'] = { bundle: b, code: 'replay_mismatch' };
b = structuredClone(after); b.request.scenarios[0].massBp = 7901; seal(b, false); invalid['invalid-scenario-mass'] = { bundle: b, code: 'scenario_mass' };
b = structuredClone(after); b.protocol.purpose = 'Tampered after hashing'; invalid['tampered-protocol'] = { bundle: b, code: 'reference_mismatch' };
for (const [name, value] of Object.entries(valid)) writeFileSync(new URL(`../examples/valid/${name}.json`, import.meta.url), JSON.stringify(value, null, 2) + '\n');
for (const [name, value] of Object.entries(invalid)) writeFileSync(new URL(`../examples/invalid/${name}.json`, import.meta.url), JSON.stringify(value.bundle, null, 2) + '\n');
writeFileSync(new URL('../examples/manifest.json', import.meta.url), JSON.stringify({ valid: Object.keys(valid).map(n => `valid/${n}.json`), invalid: Object.entries(invalid).map(([n, v]) => ({ file: `invalid/${n}.json`, expectedCode: v.code })) }, null, 2) + '\n');
