import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { digest, reference, inputDigest, bundleDigest, parseJSON } from '../tools/json.mjs';
import { validateBundle, evaluateSnapshot } from '../tools/validator.mjs';

const read = name => parseJSON(readFileSync(new URL(`../examples/valid/${name}.json`, import.meta.url), 'utf8'));
const buy = () => read('buy-after-clarification');
function pay() {
  const b = read('pay-simulation');
  for (const k of ['action', 'authorization', 'execution', 'settlement']) delete b[k];
  return refresh(b);
}
// Re-bind edited fixtures; expected outcomes in tests are independently specified.
function refresh(b, replay = false) {
  b.request.protocolRef = reference(b.protocol);
  for (const e of b.evaluations) e.requestRef = reference(b.request);
  b.decision.inputDigest = inputDigest(b);
  if (replay) b.decision.result = evaluateSnapshot(b, b.decision.createdAt);
  if (b.action) b.action.decisionRef = reference(b.decision);
  if (b.authorization && b.action) b.authorization.actionRef = reference(b.action);
  if (b.execution) {
    if (b.action) b.execution.actionRef = reference(b.action);
    if (b.authorization) b.execution.authorizationRef = reference(b.authorization);
  }
  if (b.settlement && b.execution) b.settlement.executionRef = reference(b.execution);
  b.integrity.digest = bundleDigest(b);
  return b;
}
function reject(b, code) {
  const r = validateBundle(b);
  assert.equal(r.valid, false);
  assert.ok(r.errors.some(e => e.code === code), `${code}: ${JSON.stringify(r.errors)}`);
}
function result(b) {
  refresh(b, true);
  const r = validateBundle(b);
  assert.equal(r.valid, true, JSON.stringify(r.errors));
  return b.decision.result;
}

test('stored scenario examples replay exact, independently calculated totals', () => {
  assert.deepEqual(buy().decision.result, {
    outcome: 'recommended', reasons: ['scenario_support_met'], selectedOptionId: 'repairable',
    rankings: [{ optionId: 'repairable', soleFirstMassBp: 7900, meanUtilityBp: 7975 }, { optionId: 'endurance', soleFirstMassBp: 2100, meanUtilityBp: 5430 }], tieMassBp: 0, excludedOptionIds: []
  });
  const before = read('buy-before-clarification');
  assert.equal(before.decision.result.outcome, 'review');
  assert.deepEqual(before.decision.result.rankings.map(x => x.meanUtilityBp), [7250, 6300]);
  assert.deepEqual(buy().request.supersedes, reference(before.request));
  assert.deepEqual(buy().decision.supersedes, reference(before.decision));
  assert.deepEqual(buy().protocol, before.protocol);
});

test('eligibility is never authority or evidence verification', () => {
  const r = validateBundle(read('pay-simulation'));
  assert.equal(r.valid, true);
  assert.deepEqual(Object.values(r.checks), [true, true, true, true]);
  assert.ok(Object.values(r.verification).every(v => v === 'not_performed'));
});

for (const [value, expected] of [[9500, 'eligible'], [9499, 'review'], [2001, 'review'], [2000, 'not_eligible'], [0, 'not_eligible'], [10000, 'eligible']]) {
  test(`threshold boundary ${value} yields ${expected}`, () => {
    const b = pay(); b.evaluations[0].value.probabilityBp = value;
    assert.equal(result(b).outcome, expected);
  });
}

test('provider failure takes precedence over a failed gate', () => {
  const b = pay(); delete b.evaluations[0].value;
  b.evaluations[0].status = 'error'; b.evaluations[0].issue = { code: 'timeout', description: 'Timed out' };
  b.evaluations[1].value.value = false;
  assert.deepEqual(result(b), { outcome: 'review', reasons: ['evaluator_error'] });
});
test('missing evaluation is not a failed claim', () => {
  const b = pay(); b.evaluations = [];
  assert.equal(result(b).outcome, 'needs_information');
});
test('an empty evidence submission can request more information', () => {
  const b = pay(); b.request.evidence = []; b.evaluations = [];
  assert.equal(result(b).outcome, 'needs_information');
});
test('an unavailable result carries its issue and requests more information', () => {
  const b = pay(); delete b.evaluations[0].value;
  b.evaluations[0].status = 'unavailable'; b.evaluations[0].issue = { code: 'withheld', description: 'Source not available' };
  assert.equal(result(b).outcome, 'needs_information');
});
test('a missing required evidence record cannot be bypassed by other complete inputs', () => {
  const b = pay(); b.protocol.evidencePolicy.requiredEvidenceIds.push('urn:example:missing');
  assert.equal(result(b).outcome, 'needs_information');
});
test('stale evidence forces information request at the exact expiry boundary', () => {
  const b = pay(); b.request.evidence[0].expiresAt = b.decision.createdAt;
  assert.deepEqual(result(b), { outcome: 'needs_information', reasons: ['stale_evidence'] });
});
test('boolean hard constraints cannot be offset by a high utility score', () => {
  const b = buy(); b.evaluations.find(e => e.optionId === 'repairable' && e.criterionId === 'budget').value.value = false;
  const r = result(b);
  assert.equal(r.selectedOptionId, 'endurance');
  assert.deepEqual(r.excludedOptionIds, ['repairable']);
  assert.equal(r.rankings[0].soleFirstMassBp, 10000);
});
test('all failed constraints yield no viable option', () => {
  const b = buy(); b.evaluations.filter(e => e.criterionId === 'budget').forEach(e => { e.value.value = false; });
  assert.equal(result(b).outcome, 'no_viable_option');
});
test('ties retain their mass and never get an arbitrary winner', () => {
  const b = buy(); b.evaluations.filter(e => e.value.kind === 'utility').forEach(e => { e.value.utilityBp = 7000; });
  const r = result(b);
  assert.equal(r.outcome, 'review'); assert.equal(r.tieMassBp, 10000);
  assert.equal(r.rankings.reduce((sum, x) => sum + x.soleFirstMassBp, 0), 0);
  assert.ok(!Object.hasOwn(r, 'selectedOptionId'));
});
test('recommendation support boundary is inclusive', () => {
  for (const [mass, expected] of [[7499, 'review'], [7500, 'recommended']]) {
    const b = buy(); b.request.scenarios[0].massBp = mass; b.request.scenarios[1].massBp = 10000 - mass;
    assert.equal(result(b).outcome, expected);
  }
});
test('zero-weight preference is explicit and cannot override other scores', () => {
  const b = buy(); for (const s of b.request.scenarios) { s.weights[0].weightBp = 0; s.weights[1].weightBp = 10000; }
  assert.equal(result(b).rankings[0].meanUtilityBp, 10000);
  assert.equal(b.decision.result.selectedOptionId, 'repairable');
});
test('half-unit means round upward using integer arithmetic', () => {
  const b = buy(); for (const s of b.request.scenarios) { s.massBp = 5000; s.weights[0].weightBp = 10000; s.weights[1].weightBp = 0; }
  for (const e of b.evaluations.filter(e => e.value.kind === 'utility')) e.value.utilityBp = e.optionId === 'repairable' ? (e.scenarioId === 'repair-first' ? 1 : 0) : 0;
  assert.equal(result(b).rankings.find(x => x.optionId === 'repairable').meanUtilityBp, 1);
});
test('reordered independent evaluations give the same result but change the snapshot digest', () => {
  const b = buy(); const expected = b.decision.result; const hash = b.decision.inputDigest;
  b.evaluations.reverse(); assert.deepEqual(result(b), expected); assert.notEqual(b.decision.inputDigest, hash);
});
test('validator does not mutate shared input', () => {
  const b = buy(); const original = structuredClone(b); validateBundle(b); assert.deepEqual(b, original);
});

const corruptions = [
  ['unknown version', b => { b.specVersion = '99.0.0'; }, 'schema'],
  ['unknown method', b => { b.protocol.method.id = 'guess'; }, 'schema'],
  ['unknown field', b => { b.decision.authorized = true; }, 'schema'],
  ['negative utility', b => { b.evaluations[0].value.utilityBp = -1; }, 'schema'],
  ['fractional basis points', b => { b.evaluations[0].value.utilityBp = 0.5; }, 'schema'],
  ['missing outcome', b => { delete b.decision.result.outcome; }, 'schema'],
  ['invalid calendar timestamp', b => { b.decision.createdAt = '2026-02-30T12:00:00Z'; }, 'schema'],
  ['duplicate criterion', b => { b.protocol.criteria.push(structuredClone(b.protocol.criteria[0])); }, 'duplicate_id'],
  ['duplicate evaluation target', b => { b.evaluations.push({ ...b.evaluations[0], id: 'urn:example:duplicate' }); }, 'duplicate_id'],
  ['duplicate object id', b => { b.decision.id = b.request.id; }, 'duplicate_id'],
  ['unknown evidence', b => { b.evaluations[0].evidenceIds = ['urn:example:missing']; }, 'unknown_evidence'],
  ['unknown option', b => { b.evaluations[0].optionId = 'missing'; }, 'unknown_target'],
  ['wrong evaluator method', b => { b.evaluations[0].evaluator.method = { ...b.evaluations[0].evaluator.method, version: '2' }; }, 'method_mismatch'],
  ['wrong value type', b => { b.evaluations[0].value = { kind: 'boolean', value: true }; }, 'value_type'],
  ['missing context permission', b => { b.request.contextPolicy.allowedRecipients = ['urn:example:other']; }, 'recipient_scope'],
  ['bad scenario mass', b => { b.request.scenarios[0].massBp = 7901; }, 'scenario_mass'],
  ['bad weight sum', b => { b.request.scenarios[0].weights[0].weightBp = 1; }, 'weight_sum'],
  ['unknown weighted criterion', b => { b.request.scenarios[0].weights[0].criterionId = 'missing'; }, 'weight_coverage'],
  ['wrong issuer', b => { b.decision.issuer = 'urn:example:intruder'; }, 'issuer_mismatch'],
  ['future evidence', b => { b.request.evidence[0].observedAt = '2030-01-01T00:00:00Z'; }, 'time_order'],
  ['decision before evaluation', b => { b.decision.createdAt = b.request.createdAt; }, 'time_order'],
  ['decision outlives evidence', b => { b.decision.expiresAt = '2027-01-01T00:00:00Z'; }, 'decision_expiry'],
  ['self-superseding decision', b => { b.decision.supersedes = reference(b.decision); }, 'self_reference'],
  ['forged recommendation', b => { b.decision.result.selectedOptionId = 'endurance'; }, 'replay_mismatch']
];
for (const [name, corrupt, code] of corruptions) test(`reject ${name}`, () => { const b = buy(); corrupt(b); refresh(b); reject(b, code); });

test('concurrent request revision invalidates existing evaluation bindings', () => {
  const b = buy(); b.request.purpose = 'Changed by another actor';
  b.decision.inputDigest = inputDigest(b); b.integrity.digest = bundleDigest(b);
  reject(b, 'reference_mismatch');
});
test('content tampering cannot be repaired by the bundle digest alone', () => {
  const b = buy(); b.protocol.purpose = 'changed'; b.integrity.digest = bundleDigest(b);
  reject(b, 'reference_mismatch');
});
test('overlapping threshold bands are invalid', () => {
  const b = pay(); b.protocol.method.gates[0].rejectMaxBp = 9500; refresh(b); reject(b, 'gate_overlap');
});
test('an error cannot carry a usable value', () => {
  const b = pay(); b.evaluations[0].status = 'error'; b.evaluations[0].issue = { code: 'timeout', description: 'Timed out' }; refresh(b); reject(b, 'schema');
});
test('uncalibrated live eligibility is invalid even with well-formed probabilities', () => {
  const b = pay(); b.request.mode = 'live'; refresh(b); reject(b, 'uncalibrated_live');
  b.evaluations[0].value.calibration = { status: 'reported', report: { id: 'urn:example:calibration', digest: digest({ fixture: true }) } };
  refresh(b); assert.equal(validateBundle(b).valid, true);
  assert.equal(validateBundle(b).verification.evidence, 'not_performed');
});

const lifecycleCorruptions = [
  ['execution without authorization', b => { delete b.authorization; }, 'authorization_required'],
  ['denied authorization', b => { b.authorization.status = 'denied'; }, 'authorization_required'],
  ['different executor', b => { b.execution.executor = 'urn:example:other'; }, 'executor_mismatch'],
  ['different action option', b => { b.action.optionId = 'other'; }, 'non_actionable'],
  ['simulation to live action', b => { b.action.mode = 'live'; }, 'mode_mismatch'],
  ['simulation to live execution', b => { b.execution.mode = 'live'; }, 'mode_mismatch'],
  ['simulation to live settlement', b => { b.settlement.mode = 'live'; }, 'mode_mismatch'],
  ['execution at authorization expiry', b => { b.execution.startedAt = b.authorization.expiresAt; b.execution.completedAt = b.authorization.expiresAt; b.settlement.observedAt = b.authorization.expiresAt; }, 'expired_authorization'],
  ['settlement after failed execution', b => { b.execution.status = 'failed'; }, 'execution_required'],
  ['settlement without execution', b => { delete b.execution; }, 'execution_required'],
  ['authorization without action', b => { delete b.action; }, 'reference_mismatch']
];
for (const [name, corrupt, code] of lifecycleCorruptions) test(`reject ${name}`, () => { const b = read('pay-simulation'); corrupt(b); refresh(b); reject(b, code); });

test('review outcome cannot carry an action even if all references are rehashed', () => {
  const b = read('pay-simulation'); b.evaluations[0].value.probabilityBp = 5000;
  refresh(b, true); reject(b, 'non_actionable');
});
test('failed or unknown execution remains representable without a settlement record', () => {
  for (const status of ['failed', 'unknown']) {
    const b = read('pay-simulation'); delete b.settlement; b.execution.status = status;
    assert.equal(validateBundle(refresh(b)).valid, true);
  }
});

test('canonical digest has an independently fixed byte vector', () => {
  assert.equal(digest({ b: 2, a: 1 }), 'sha256:43258cff783fe7036d8a43033f830adfc60ec037382473548ac742b888292777');
  assert.equal(digest({ b: 2, a: 1 }), digest({ a: 1, b: 2 }));
  assert.notEqual(digest([1, 2]), digest([2, 1]));
});
test('fixture evidence digest binds the actual retained bytes', () => {
  const bytes = readFileSync(new URL('../examples/evidence/fixture.json', import.meta.url));
  assert.equal(`sha256:${createHash('sha256').update(bytes).digest('hex')}`, buy().request.evidence[0].digest);
});
for (const [name, text] of [
  ['duplicate key', '{"a":1,"a":2}'], ['escaped duplicate key', '{"a":1,"\\u0061":2}'],
  ['nested duplicate key', '{"x":[{"a":1,"a":2}]}'], ['lone surrogate', '"\\ud800"'],
  ['infinite number', '1e400'], ['unsafe integer', '9007199254740992'],
  ['excessive nesting', '['.repeat(66) + '0' + ']'.repeat(66)]
]) test(`reject wire JSON ${name}`, () => assert.throws(() => parseJSON(text)));
test('quoted punctuation and astral Unicode survive strict parsing', () => {
  const text = '{"a":"{\\\"x\\\":1}","b":[{},[],"🙂"],"__proto__":{"safe":true}}';
  assert.deepEqual(parseJSON(text), JSON.parse(text));
});
test('in-memory inputs cannot hide accessors or mutate while hashing', () => {
  assert.throws(() => digest({ get value() { return 1; } }));
  assert.throws(() => digest({ [Symbol('hidden')]: 1 }));
  assert.throws(() => digest([, 1]));
  assert.throws(() => digest({ v: undefined }));
});
test('extensions are namespaced, retained, and covered by integrity', () => {
  const b = buy(); b.extensions = { 'https://example.org/annotation': { note: 'Display only' } }; refresh(b);
  assert.equal(validateBundle(b).valid, true);
  b.extensions['https://example.org/annotation'].note = 'Changed'; reject(b, 'bundle_digest');
});
test('public evaluator rejects malformed inputs instead of producing a recommendation', () => {
  const b = buy(); b.request.scenarios[0].massBp = 1;
  assert.throws(() => evaluateSnapshot(b, b.decision.createdAt));
});
test('a large incomplete scenario matrix needs information without constructing missing cells', () => {
  const b = buy(); b.evaluations = [];
  b.request.options = Array.from({ length: 1000 }, (_, i) => ({ id: `option_${i}`, label: `Option ${i}` }));
  b.request.scenarios = Array.from({ length: 1000 }, (_, i) => ({ id: `scenario_${i}`, massBp: 10, weights: structuredClone(b.request.scenarios[0].weights) }));
  assert.equal(result(b).outcome, 'needs_information');
});
test('CLI rejects invalid UTF-8 before decoding can replace bytes', () => {
  const dir = mkdtempSync(join(tmpdir(), 'open-decisions-'));
  try {
    const path = join(dir, 'invalid.json');
    const text = JSON.stringify(buy());
    const marker = text.indexOf('Fictional');
    const bytes = Buffer.from(text); bytes[marker] = 0xff; writeFileSync(path, bytes);
    const run = spawnSync(process.execPath, ['tools/validate.mjs', path], { cwd: new URL('..', import.meta.url), encoding: 'utf8' });
    assert.equal(run.status, 1); assert.equal(JSON.parse(run.stderr).errors[0].code, 'input');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
test('CLI has useful success and failure exit codes', () => {
  const run = file => spawnSync(process.execPath, ['tools/validate.mjs', file], { cwd: new URL('..', import.meta.url), encoding: 'utf8' });
  assert.equal(run('examples/valid/pay-simulation.json').status, 0);
  assert.equal(run('examples/invalid/forged-recommendation.json').status, 1);
  assert.equal(run('examples/not-present.json').status, 1);
});
