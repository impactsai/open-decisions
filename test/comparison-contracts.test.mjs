import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { digest, manifestOf, validateManifest, validateAssessments, validateKit, utilityBp, parseComparisonJSON, canonicalJSON } from '../comparison/contracts.mjs';

const read = name => JSON.parse(readFileSync(new URL(`../examples/comparison/${name}.json`, import.meta.url), 'utf8'));
const fixture = () => read('fictional-buy');

test('compiled work order and frozen assessment fixture agree', async () => {
  const b = fixture();
  const m = await manifestOf(b.kit);
  assert.deepEqual(m, read('manifest'));
  assert.deepEqual(validateManifest(m, b.context.kitDigest), m);
  assert.deepEqual(await validateAssessments(b.assessments, b.context, m), b.assessments);
});
test('old core, unknown method/version/keys cannot masquerade as a comparison kit', async () => {
  for (const change of [k => k.profileVersion = '0.1.0-draft.1', k => k.method = 'mystery', k => k.extra = true]) {
    const b = fixture(); change(b.kit);
    assert.throws(() => validateKit(b.kit), { code: 'SCHEMA' });
  }
});
test('kit rejects duplicate IDs, absent slots, impossible weights and utility anchors', () => {
  for (const change of [k => k.criteria.push(k.criteria[0]), k => k.criteria[0].requiredEvidenceSlots.push('absent'), k => k.criteria[1].scale.maximum = 0, k => k.criteria[1].weightBounds.minBp = 10000, k => k.criteria[2].scale.levels.push(k.criteria[2].scale.levels[0])]) {
    const b = fixture(); b.kit.criteria[2].weightBounds.minBp = 1; change(b.kit);
    assert.throws(() => validateKit(b.kit));
  }
});
test('assessment boundary rejects missing/duplicate cells, bad mass, binding, provenance and values', async () => {
  const changes = [
    a => a.assessments.pop(), a => a.assessments.push(a.assessments[0]),
    a => a.assessments[0].outcomes[0].massPpm--,
    a => a.assessments[0].outcomes[0].value = 'true',
    a => a.assessments[0].evaluator.methodVersion = 'unknown',
    a => a.contextDigest = 'f'.repeat(64),
    a => a.assessments[0].evidence[0].digest = 'f'.repeat(64),
    a => a.assessments[2].outcomes[0].value = 'not-a-level',
    a => a.assessments[1].outcomes[0].value = 1001,
  ];
  for (const change of changes) {
    const b = fixture(); change(b.assessments);
    await assert.rejects(validateAssessments(b.assessments, b.context, await manifestOf(b.kit)));
  }
});
test('model revision and calibration are explicit, not confidence strings', async () => {
  const b = fixture();
  const e = { kind: 'model', id: 'jev', methodVersion: 'v1', provider: 'fixture', model: 'fictional-model', modelVersion: 'v1', promptDigest: 'a'.repeat(64), mappingDigest: 'b'.repeat(64) };
  b.kit.criteria[2].evaluator = e;
  b.context.kitDigest = await digest(b.kit);
  b.assessments.contextDigest = await digest(b.context);
  for (const a of b.assessments.assessments.filter(a => a.criterionId === 'fit')) { a.evaluator = e; a.rawOutputDigest = 'c'.repeat(64); }
  const m = await manifestOf(b.kit);
  await validateAssessments(b.assessments, b.context, m);
  b.assessments.assessments[2].evaluator = { ...e, modelVersion: 'fallback' };
  await assert.rejects(validateAssessments(b.assessments, b.context, m), { code: 'EVALUATOR' });
});
test('numeric utilities use exact integer half-up rounding and fixed anchors', () => {
  const scale = { kind: 'numeric', minimum: 0, maximum: 20000, direction: 'maximize', unit: 'units' };
  assert.equal(utilityBp(scale, 1), 1);
  assert.equal(utilityBp(scale, 3), 2);
  assert.throws(() => utilityBp(scale, -1));
});
test('wire and object inputs reject ambiguous JSON without invoking getters', () => {
  assert.throws(() => parseComparisonJSON('{"x":1,"\\u0078":2}'), { code: 'JSON' });
  assert.throws(() => parseComparisonJSON('{bad'), { code: 'JSON' });
  for (const v of [NaN, Infinity, 0.5, undefined, new Date(), [1,,2], '\ud800', { get value() { throw Error('getter executed'); } }]) {
    assert.throws(() => canonicalJSON(v), e => e.code === 'JSON');
  }
  assert.equal(canonicalJSON({ z: 1, a: true }), '{"a":true,"z":1}');
});
test('asynchronous manifest build snapshots the validated kit', async () => {
  const b = fixture(), old = structuredClone(b.kit);
  const pending = manifestOf(b.kit); b.kit.criteria[0].id = 'mutated';
  assert.deepEqual(await pending, await manifestOf(old));
});
