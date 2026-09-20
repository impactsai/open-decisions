import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { assertJSON, digest, inputDigest, bundleDigest } from './json.mjs';
import { evaluationKey, replayValidated } from './profiles.mjs';

const schema = JSON.parse(readFileSync(new URL('../schemas/0.1.0-draft.1/bundle.schema.json', import.meta.url), 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: true, ownProperties: true });
addFormats(ajv);
const validateShape = ajv.compile(schema);
const inputValidators = Object.fromEntries(['protocol', 'request', 'evaluation'].map(name => [name, ajv.getSchema(`${schema.$id}#/$defs/${name}`)]));
const same = (a, b) => digest(a) === digest(b);
const before = (a, b) => Date.parse(a) < Date.parse(b);
const notAfter = (a, b) => Date.parse(a) <= Date.parse(b);

function diagnostics() {
  const errors = [];
  const check = (condition, code, path, message) => {
    if (!condition) errors.push({ code, path, message });
  };
  return { errors, check };
}

function unique(items, getId, check, path) {
  const ids = items.map(getId);
  check(new Set(ids).size === ids.length, 'duplicate_id', path, 'Identifiers must be unique');
}

function bound(ref, target, check, path) {
  check(Boolean(target) && ref.id === target.id && ref.digest === digest(target), 'reference_mismatch', path, 'Reference must bind the exact record ID and digest');
}

function checkSnapshot({ protocol: p, request: r, evaluations: es }, check) {
  unique(p.criteria, x => x.id, check, '/protocol/criteria');
  unique(r.options, x => x.id, check, '/request/options');
  unique(r.scenarios, x => x.id, check, '/request/scenarios');
  unique(r.evidence, x => x.id, check, '/request/evidence');
  unique(es, x => evaluationKey(x.scenarioId, x.optionId, x.criterionId), check, '/evaluations');
  bound(r.protocolRef, p, check, '/request/protocolRef');
  check(r.scenarios.reduce((sum, s) => sum + s.massBp, 0) === 10000, 'scenario_mass', '/request/scenarios', 'Scenario masses must sum to 10000');
  check(before(r.createdAt, r.contextPolicy.retentionUntil), 'time_order', '/request/contextPolicy/retentionUntil', 'Retention must end after request creation');
  check(r.contextPolicy.allowedRecipients.includes(p.authority.determiner), 'recipient_scope', '/request/contextPolicy/allowedRecipients', 'Determiner must be a declared context recipient');
  if (r.supersedes) check(r.supersedes.id !== r.id, 'self_reference', '/request/supersedes', 'A revision needs a new ID');
  const criteria = new Map(p.criteria.map(c => [c.id, c]));
  const evidence = new Map(r.evidence.map(e => [e.id, e]));
  const options = new Set(r.options.map(o => o.id));
  const scenarios = new Set(r.scenarios.map(s => s.id));
  for (const e of r.evidence) {
    check(notAfter(e.observedAt, r.createdAt), 'time_order', '/request/evidence', 'Evidence snapshot must precede or equal request creation');
    if (e.expiresAt) check(before(e.observedAt, e.expiresAt), 'time_order', '/request/evidence', 'Evidence validity interval must be positive');
  }
  if (p.method.id === 'threshold-gates-v1') {
    check(r.options.length === 1 && r.scenarios.length === 1 && r.scenarios[0].weights.length === 0, 'threshold_shape', '/request', 'Threshold profile requires one option, one scenario, and no weights');
    check(p.criteria.every(c => c.role === 'requirement' && ['boolean', 'probability'].includes(c.valueType)), 'criterion_type', '/protocol/criteria', 'Threshold criteria must be boolean or probability requirements');
    unique(p.method.gates, g => g.criterionId, check, '/protocol/method/gates');
    check(same(p.method.gates.map(g => g.criterionId).sort(), [...criteria.keys()].sort()), 'gate_coverage', '/protocol/method/gates', 'Each requirement needs exactly one gate');
    for (const g of p.method.gates) check(g.rejectMaxBp < g.acceptMinBp, 'gate_overlap', '/protocol/method/gates', 'Rejection and acceptance bands must not overlap');
  } else {
    const preferences = p.criteria.filter(c => c.role === 'preference').map(c => c.id).sort();
    check(preferences.length > 0 && p.criteria.every(c => c.role === 'preference' && c.valueType === 'utility' || c.role === 'constraint' && c.valueType === 'boolean'), 'criterion_type', '/protocol/criteria', 'Ranking requires utility preferences and optional boolean constraints');
    for (const s of r.scenarios) {
      unique(s.weights, w => w.criterionId, check, '/request/scenarios/weights');
      check(s.weights.reduce((sum, w) => sum + w.weightBp, 0) === 10000, 'weight_sum', '/request/scenarios/weights', 'Scenario weights must sum to 10000');
      check(same(s.weights.map(w => w.criterionId).sort(), preferences), 'weight_coverage', '/request/scenarios/weights', 'Weights must cover exactly the preference criteria');
    }
  }
  for (const e of es) {
    const c = criteria.get(e.criterionId);
    check(c && options.has(e.optionId) && scenarios.has(e.scenarioId), 'unknown_target', '/evaluations', 'Evaluation target must exist in the snapshot');
    bound(e.requestRef, r, check, '/evaluations/requestRef');
    if (c) {
      check(same(c.method, e.evaluator.method), 'method_mismatch', '/evaluations/evaluator/method', 'Evaluation must use the declared criterion method');
      if (e.status === 'complete') check(c.valueType === e.value.kind, 'value_type', '/evaluations/value', 'Result type must match criterion type');
    }
    check(notAfter(r.createdAt, e.completedAt), 'time_order', '/evaluations/completedAt', 'Evaluation must follow request creation');
    check(e.evidenceIds.every(id => evidence.has(id)), 'unknown_evidence', '/evaluations/evidenceIds', 'Evidence references must resolve within the request');
    check(r.contextPolicy.allowedRecipients.includes(e.evaluator.id), 'recipient_scope', '/evaluations/evaluator/id', 'Evaluator must be a declared context recipient');
  }
}

export function evaluateSnapshot(snapshot, at) {
  assertJSON(snapshot);
  for (const name of ['protocol', 'request']) if (!inputValidators[name](snapshot[name])) throw new Error(`Invalid ${name} shape`);
  if (!Array.isArray(snapshot.evaluations) || !snapshot.evaluations.every(e => inputValidators.evaluation(e))) throw new Error('Invalid evaluations shape');
  if (!ajv.validate({ type: 'string', format: 'date-time', pattern: 'Z$' }, at)) throw new Error('Invalid evaluation time');
  const { errors, check } = diagnostics();
  unique([snapshot.protocol, snapshot.request, ...snapshot.evaluations], x => x.id, check, '/');
  checkSnapshot(snapshot, check);
  check(notAfter(snapshot.request.createdAt, at) && snapshot.evaluations.every(e => notAfter(e.completedAt, at)), 'time_order', '/', 'Replay time must follow all inputs');
  if (errors.length) throw new Error(errors.map(e => e.code).join(', '));
  return replayValidated(snapshot, at);
}

function checkLifecycle(b, check) {
  const { request: r, decision: d, action: a, authorization: z, execution: e, settlement: s } = b;
  if (a) {
    bound(a.decisionRef, d, check, '/action/decisionRef');
    check(['eligible', 'recommended'].includes(d.result.outcome) && a.optionId === d.result.selectedOptionId, 'non_actionable', '/action', 'An action must bind the selected option of an affirmative determination');
    check(a.mode === r.mode, 'mode_mismatch', '/action/mode', 'Simulation and live records cannot be mixed');
    check(notAfter(d.createdAt, a.createdAt) && before(a.createdAt, a.expiresAt) && notAfter(a.expiresAt, d.expiresAt), 'time_order', '/action', 'Action validity must be within decision validity');
  }
  if (z) {
    bound(z.actionRef, a, check, '/authorization/actionRef');
    if (a) {
      check(z.executor === a.executor, 'executor_mismatch', '/authorization/executor', 'Authorization must name the intended executor');
      check(notAfter(a.createdAt, z.createdAt) && before(z.createdAt, z.expiresAt) && notAfter(z.expiresAt, a.expiresAt), 'time_order', '/authorization', 'Authorization validity must be within action validity');
    }
  }
  if (e) {
    bound(e.actionRef, a, check, '/execution/actionRef');
    bound(e.authorizationRef, z, check, '/execution/authorizationRef');
    check(z?.status === 'granted', 'authorization_required', '/execution', 'Execution requires a separate granted authorization record');
    check(e.mode === r.mode, 'mode_mismatch', '/execution/mode', 'Simulation and live records cannot be mixed');
    check(e.executor === a?.executor && e.executor === z?.executor, 'executor_mismatch', '/execution/executor', 'Execution must use the authorized executor');
    check(notAfter(e.startedAt, e.completedAt), 'time_order', '/execution', 'Execution completion cannot precede its start');
    if (z) check(notAfter(z.createdAt, e.startedAt) && before(e.startedAt, z.expiresAt), 'expired_authorization', '/execution/startedAt', 'Execution must start within authorization validity');
  }
  if (s) {
    bound(s.executionRef, e, check, '/settlement/executionRef');
    check(e?.status === 'succeeded', 'execution_required', '/settlement', 'Settlement record requires a successful execution record');
    check(s.mode === r.mode, 'mode_mismatch', '/settlement/mode', 'Simulation and live records cannot be mixed');
    if (e) check(notAfter(e.completedAt, s.observedAt), 'time_order', '/settlement/observedAt', 'Settlement observation must follow execution');
  }
}

export function validateBundle(bundle) {
  const report = { valid: false, checks: { schema: false, semantics: false, replay: false, integrity: false },
    verification: { evidence: 'not_performed', authority: 'not_performed', signatures: 'not_performed', execution: 'not_performed', settlement: 'not_performed' }, errors: [] };
  try { assertJSON(bundle); } catch (error) { report.errors.push({ code: 'json_domain', path: '/', message: error.message }); return report; }
  if (!validateShape(bundle)) {
    report.errors = validateShape.errors.map(e => ({ code: 'schema', path: e.instancePath, message: e.message }));
    return report;
  }
  report.checks.schema = true;
  const { errors, check } = diagnostics();
  const { protocol: p, request: r, evaluations: es, decision: d } = bundle;
  unique([p, r, ...es, d, bundle.action, bundle.authorization, bundle.execution, bundle.settlement].filter(Boolean), x => x.id, check, '/');
  checkSnapshot(bundle, check);
  check(d.issuer === p.authority.determiner, 'issuer_mismatch', '/decision/issuer', 'Decision issuer must match the declared determiner');
  check(d.inputDigest === inputDigest(bundle), 'input_digest', '/decision/inputDigest', 'Decision must bind the exact protocol, request, and ordered evaluations');
  check(notAfter(r.createdAt, d.createdAt) && es.every(e => notAfter(e.completedAt, d.createdAt)) && before(d.createdAt, d.expiresAt), 'time_order', '/decision', 'Decision must follow its inputs and have a positive validity interval');
  if (d.supersedes) check(d.supersedes.id !== d.id, 'self_reference', '/decision/supersedes', 'A revision needs a new ID');
  if (['eligible', 'recommended'].includes(d.result.outcome)) {
    const used = new Set([...p.evidencePolicy.requiredEvidenceIds, ...es.flatMap(e => e.evidenceIds)]);
    check(r.evidence.filter(e => used.has(e.id)).every(e => !e.expiresAt || notAfter(d.expiresAt, e.expiresAt)), 'decision_expiry', '/decision/expiresAt', 'Affirmative decision cannot outlive its evidence');
    if (r.mode === 'live') check(es.every(e => e.value?.kind !== 'probability' || e.value.calibration.status === 'reported'), 'uncalibrated_live', '/evaluations/value/calibration', 'Live affirmative determinations using probabilities require calibration report references');
  }
  checkLifecycle(bundle, check);
  report.checks.semantics = errors.length === 0;
  if (report.checks.semantics) {
    const expected = replayValidated(bundle, d.createdAt);
    check(same(expected, d.result), 'replay_mismatch', '/decision/result', 'Recorded result differs from deterministic replay');
    report.checks.replay = !errors.some(e => e.code === 'replay_mismatch');
  }
  report.checks.integrity = bundle.integrity.digest === bundleDigest(bundle);
  check(report.checks.integrity, 'bundle_digest', '/integrity/digest', 'Bundle content differs from its declared digest');
  report.errors = errors;
  report.valid = errors.length === 0;
  return report;
}
