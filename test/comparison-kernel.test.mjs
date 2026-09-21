import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { compare as compute, digest, validateShape } from '../comparison/index.mjs';

// Every successful and failed-dependency result must obey the normative output shape.
async function compare(b) {
  const result = await compute(b);
  validateShape('result', result);
  return result;
}

const fixture = () => JSON.parse(readFileSync(new URL('../examples/comparison/fictional-buy.json', import.meta.url)));
const num = r => Number(r.numerator) / Number(r.denominator);
const at = (b, option, criterion) => b.assessments.assessments.find(a => a.optionId === option && a.criterionId === criterion);
async function rebind(b) {
  b.context.kitDigest = await digest(b.kit);
  b.assessments.contextDigest = await digest(b.context);
  b.request.contextDigest = await digest(b.context);
  b.request.assessmentDigest = await digest(b.assessments);
  return b;
}

test('published exact and Monte Carlo vectors replay byte-for-byte', async () => {
  const b = fixture();
  assert.deepEqual(await compare(b), JSON.parse(readFileSync(new URL('../examples/comparison/expected-exact.json', import.meta.url))));
  b.request.computation = { mode: 'monte-carlo', algorithm: 'xoshiro128ss-v1', samples: 10000 };
  assert.deepEqual(await compare(b), JSON.parse(readFileSync(new URL('../examples/comparison/expected-monte-carlo.json', import.meta.url))));
});

test('exact results match an independent two-state calculation', async () => {
  const r = await compare(fixture());
  // High: A=9000, B=7500 (mass .8). Low: A=4000, B=7500 (mass .2).
  assert.equal(r.outcome, 'recommended'); assert.equal(r.selectedOptionId, 'A');
  assert.deepEqual(r.excludedOptionIds, ['C']);
  assert.equal(num(r.rankings[0].soleFirstSupport), .8);
  assert.equal(num(r.rankings[0].expectedUtilityBp), 8000);
  assert.equal(num(r.rankings[0].expectedRegretBp), 700);
  assert.equal(num(r.rankings[1].expectedRegretBp), 1200);
  assert.equal(num(r.pairwise[0].aWins), .8);
  assert.equal(r.computation.samplingError.simultaneousSupportAndRegretErrorPpm, 0);
});

test('preference revision reuses frozen assessments but changes the result', async () => {
  const b = fixture(), original = await compare(b), originalDigest = b.request.assessmentDigest;
  b.request.id = 'price-only'; b.request.weights[0].weights[0].weightBp = 10000; b.request.weights[0].weights[1].weightBp = 0;
  const revised = await compare(b);
  assert.equal(revised.inputs.assessmentDigest, originalDigest);
  assert.notEqual(revised.inputs.requestDigest, original.inputs.requestDigest);
  assert.equal(num(revised.rankings[0].soleFirstSupport), 1);
  assert.equal(num(revised.rankings[0].expectedUtilityBp), 8000);
});

test('finite preference uncertainty integrates independently and obeys constraints', async () => {
  const b = fixture();
  b.request.weights = [
    { id: 'price', massPpm: 500000, weights: [{ criterionId: 'price', weightBp: 10000 }, { criterionId: 'fit', weightBp: 0 }] },
    { id: 'fit', massPpm: 500000, weights: [{ criterionId: 'price', weightBp: 0 }, { criterionId: 'fit', weightBp: 10000 }] },
  ];
  let r = await compare(b);
  assert.equal(num(r.rankings[0].soleFirstSupport), .5);
  assert.equal(num(r.tieSupport), .4);
  assert.equal(num(r.rankings[1].soleFirstSupport), .1);
  b.kit.weightOrders.push({ higher: 'price', lower: 'fit' }); await rebind(b);
  await assert.rejects(compare(b), { code: 'WEIGHTS' });
});

test('ties remain shared competition ranks with no arbitrary winner', async () => {
  const b = fixture(); at(b, 'A', 'price').outcomes = structuredClone(at(b, 'B', 'price').outcomes); at(b, 'A', 'fit').outcomes = structuredClone(at(b, 'B', 'fit').outcomes);
  const r = await compare(await rebind(b));
  assert.equal(r.outcome, 'no-robust-winner'); assert.equal(r.selectedOptionId, undefined);
  assert.equal(num(r.tieSupport), 1);
  for (const row of r.rankings) { assert.equal(num(row.rankSupport[0].support), 1); assert.equal(num(row.soleFirstSupport), 0); }
  assert.equal(num(r.pairwise[0].tie), 1);
});

test('hard constraint eligibility precedes ranking and retains an all-failed outcome', async () => {
  const b = fixture(); at(b, 'A', 'eligible').outcomes[0].value = false;
  const r = await compare(await rebind(b));
  assert.equal(r.selectedOptionId, 'B'); assert.deepEqual(r.excludedOptionIds, ['A','C']);
  at(b, 'B', 'eligible').outcomes[0].value = false;
  const none = await compare(await rebind(b));
  assert.equal(none.outcome, 'no-eligible-option'); assert.equal(none.rankings, undefined);
});

test('three-way competition ranks skip rank two when two options tie for first', async () => {
  const b = fixture();
  at(b, 'C', 'eligible').outcomes[0].value = true;
  at(b, 'A', 'price').outcomes[0].value = 500;
  at(b, 'A', 'fit').outcomes = structuredClone(at(b, 'B', 'fit').outcomes);
  at(b, 'C', 'price').outcomes[0].value = 1000;
  const r = await compare(await rebind(b));
  assert.equal(num(r.tieSupport), 1);
  assert.equal(num(r.rankings[2].rankSupport[2].support), 1);
  assert.equal(num(r.rankings[2].rankSupport[1].support), 0);
});

test('constraint threshold is inclusive and cannot be compensated by price utility', async () => {
  const b = fixture(); b.kit.criteria[0].minSatisfactionPpm = 900000;
  at(b, 'A', 'eligible').outcomes = [{ id: 'yes', value: true, massPpm: 900000 }, { id: 'no', value: false, massPpm: 100000 }];
  assert.equal((await compare(await rebind(b))).selectedOptionId, 'A');
  at(b, 'A', 'eligible').outcomes[0].massPpm--; at(b, 'A', 'eligible').outcomes[1].massPpm++;
  assert.equal((await compare(await rebind(b))).selectedOptionId, 'B');
});

test('failures block a partial ranking; error takes precedence over unavailable', async () => {
  const b = fixture(), a = at(b, 'A', 'fit');
  delete a.outcomes; delete a.calibration; a.status = 'unavailable'; a.detail = 'Fictional source missing';
  let r = await compare(await rebind(b));
  assert.equal(r.outcome, 'needs-information'); assert.equal(r.rankings, undefined);
  const c = at(b, 'C', 'fit'); delete c.outcomes; delete c.calibration; c.status = 'error'; c.detail = 'Fictional provider failed';
  r = await compare(await rebind(b));
  assert.equal(r.outcome, 'review-required'); assert.equal(r.rankings, undefined);
});

test('model scenario support cannot silently become a calibrated recommendation', async () => {
  const b = fixture();
  const e = { kind: 'model', id: 'jev', methodVersion: 'v1', provider: 'fixture', model: 'fictional', modelVersion: 'v1', promptDigest: 'a'.repeat(64), mappingDigest: 'b'.repeat(64) };
  b.kit.criteria[2].evaluator = e;
  for (const a of b.assessments.assessments.filter(a => a.criterionId === 'fit')) { a.evaluator = e; a.rawOutputDigest = 'c'.repeat(64); }
  assert.equal((await compare(await rebind(b))).outcome, 'review-required');
  for (const a of b.assessments.assessments.filter(a => a.criterionId === 'fit')) a.calibration = { status: 'validated', reportDigest: 'd'.repeat(64) };
  await assert.rejects(compare(await rebind(b)), { code: 'CALIBRATION' });
  b.kit.criteria[2].acceptedCalibrationDigests = ['d'.repeat(64)];
  assert.equal((await compare(await rebind(b))).outcome, 'recommended');
});

test('joint scenarios preserve correlations without changing declared marginals', async () => {
  const b = fixture();
  at(b, 'A', 'price').outcomes[0].value = 500;
  for (const id of ['A','B']) at(b, id, 'fit').outcomes = [{ id: 'high', value: 'high', massPpm: 500000 }, { id: 'low', value: 'low', massPpm: 500000 }];
  const independent = await compare(await rebind(b));
  assert.equal(num(independent.tieSupport), .5); assert.equal(num(independent.rankings[0].soleFirstSupport), .25);
  b.request.dependence = { kind: 'joint', justification: 'Shared fictional factor', scenarios: ['high','low'].map(id => ({ id, massPpm: 500000, weightScenarioId: 'balanced', selections: b.assessments.assessments.map(a => ({ optionId: a.optionId, criterionId: a.criterionId, outcomeId: a.criterionId === 'fit' && a.optionId !== 'C' ? id : a.outcomes[0].id })) })) };
  const correlated = await compare(b);
  assert.equal(num(correlated.tieSupport), 1);
  b.request.dependence.scenarios[0].selections[2].outcomeId = 'low';
  await assert.rejects(compare(b), { code: 'JOINT' });
});

test('Monte Carlo is reproducible, calibrated by exact reference, with conservative policy', async () => {
  const b = fixture(); b.request.computation = { mode: 'monte-carlo', algorithm: 'xoshiro128ss-v1', samples: 10000 };
  const first = await compare(b), second = await compare(b);
  assert.deepEqual(first, second);
  assert.ok(Math.abs(num(first.rankings[0].soleFirstSupport) - .8) <= first.computation.samplingError.simultaneousSupportAndRegretErrorPpm / 1000000);
  assert.equal(first.outcome, 'recommended');
  b.request.computation.samples = 100;
  assert.equal((await compare(b)).outcome, 'no-robust-winner');
});

test('input permutations preserve sampling seed and statistics, while wire digests bind order', async () => {
  const b = fixture(); b.request.computation = { mode: 'monte-carlo', algorithm: 'xoshiro128ss-v1', samples: 1000 };
  const first = await compare(b);
  b.kit.criteria.reverse(); b.context.options.reverse(); b.assessments.assessments.reverse();
  for (const a of b.assessments.assessments) a.outcomes.reverse();
  b.request.weights[0].weights.reverse(); b.request.id = 'renamed';
  const second = await compare(await rebind(b));
  assert.notEqual(first.inputs.requestDigest, second.inputs.requestDigest);
  assert.equal(first.computation.seedMaterialDigest, second.computation.seedMaterialDigest);
  assert.deepEqual(first.rankings, second.rankings); assert.deepEqual(first.pairwise, second.pairwise);
});

test('invalid requests fail closed before sampling, including impossible budgets', async () => {
  for (const change of [
    b => b.request.weights[0].weights[0].weightBp++,
    b => b.request.weights[0].weights.pop(),
    b => b.request.assessmentDigest = 'f'.repeat(64),
    b => b.request.computation = { mode: 'monte-carlo', algorithm: 'unknown', samples: 1000 },
    b => b.kit.limits.maxExactScenarios = 1,
    b => b.kit.limits.maxOptions = 2,
    b => b.kit.limits.maxWork = 1,
    b => { b.kit.limits.maxSamples = 100; b.request.computation = { mode: 'monte-carlo', algorithm: 'xoshiro128ss-v1', samples: 101 }; },
  ]) {
    const b = fixture(); change(b);
    // Preserve deliberately bad request binding while refreshing any changed kit.
    b.context.kitDigest = await digest(b.kit); b.assessments.contextDigest = await digest(b.context); b.request.contextDigest = await digest(b.context);
    if (b.request.assessmentDigest !== 'f'.repeat(64)) b.request.assessmentDigest = await digest(b.assessments);
    await assert.rejects(compare(b));
  }
});

test('support and regret policy boundaries use exact ratios', async () => {
  const b = fixture(); b.kit.recommendation.minSoleFirstPpm = 800000; b.kit.recommendation.maxExpectedRegretBp = 700;
  assert.equal((await compare(await rebind(b))).outcome, 'recommended');
  b.kit.recommendation.minSoleFirstPpm++;
  assert.equal((await compare(await rebind(b))).outcome, 'no-robust-winner');
  b.kit.recommendation.minSoleFirstPpm--; b.kit.recommendation.maxExpectedRegretBp--;
  assert.equal((await compare(await rebind(b))).outcome, 'no-robust-winner');
});

test('comparison snapshots caller inputs and does not mutate them', async () => {
  const b = fixture(), frozen = structuredClone(b), pending = compare(b);
  b.request.weights[0].weights[0].weightBp = 0;
  assert.deepEqual(await pending, await compare(frozen));
});
