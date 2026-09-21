import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { UDID_PROFILE, validateUdidRecord } from '../udid/index.mjs';
import { digest } from '../tools/json.mjs';

const root = new URL('../examples/udid/2.0.0-draft.1/', import.meta.url);
const read = name => JSON.parse(readFileSync(new URL(name, root), 'utf8'));
const options = { profile: UDID_PROFILE, kind: 'claim-set' };
const validate = record => validateUdidRecord(record, options);
const decision = () => read('valid/dtb-decision.json');
const receipt = () => read('valid/dtb-settled.json');
const multi = () => read('valid/dtp-multi-leg-decision.json');
const info = () => read('valid/extension-info.json');
const ajv = new Ajv2020({ strict: true, strictTypes: false, strictRequired: false });
addFormats(ajv);
const schema = JSON.parse(readFileSync(new URL('../schemas/udid/2.0.0-draft.1/processed-claim-set.schema.json', import.meta.url)));
const validateSchema = ajv.compile(schema);

test('UDID schemas compile offline and match pinned candidate bytes and identifiers', () => {
  const dir = new URL('../schemas/udid/2.0.0-draft.1/', import.meta.url);
  const lock = JSON.parse(readFileSync(new URL('schema-lock.json', dir)));
  assert.equal(lock.profile, UDID_PROFILE);
  assert.equal(lock.status, 'draft-candidate');
  assert.equal(lock.schemas.length, 2);
  for (const entry of lock.schemas) {
    const bytes = readFileSync(new URL(entry.file, dir));
    const json = JSON.parse(bytes);
    assert.equal(json.$id, entry.id);
    assert.equal(json.$id, `https://raw.githubusercontent.com/impactsai/open-decisions/main/schemas/udid/2.0.0-draft.1/${entry.file}`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256);
    assert.equal(ajv.validateSchema(json), true);
  }
});

test('every published UDID record fixture has the declared outcome', () => {
  const manifest = read('manifest.json');
  const listed = new Set(manifest.fixtures.map(f => f.path));
  const onDisk = ['valid', 'invalid'].flatMap(dir => readdirSync(new URL(dir, root)).map(file => `${dir}/${file}`));
  assert.deepEqual([...listed].sort(), onDisk.sort());
  assert.equal(listed.size, manifest.fixtures.length);
  for (const fixture of manifest.fixtures) {
    const report = validateUdidRecord(read(fixture.path), { profile: manifest.profile, kind: fixture.kind });
    assert.equal(report.recordValid, fixture.recordValid, fixture.path);
    assert.equal(report.verification, 'not_performed');
    if (fixture.errorCode) assert.ok(report.errors.some(e => e.code === fixture.errorCode), fixture.path);
  }
});

test('Appendix C retains all 13 vector families, their variants and pending owner agreement', () => {
  const plan = read('vector-plan.json');
  assert.deepEqual(plan.vectors.map(v => v.id), Array.from({ length: 13 }, (_, i) => i + 1));
  assert.deepEqual(plan.vectors.map(v => v.cases.length), [1, 1, 2, 1, 2, 1, 2, 1, 2, 5, 2, 1, 2]);
  assert.equal(plan.execution.networkCalls, false);
  assert.equal(plan.execution.realActions, false);
  assert.equal(plan.execution.signedFixturesGenerated, false);
  for (const vector of plan.vectors) {
    assert.equal(vector.status, 'planned');
    assert.ok(read(vector.seed));
    assert.equal(new Set(vector.cases.map(c => c.id)).size, vector.cases.length);
    for (const entry of vector.cases) assert.ok(['accept', 'reject'].includes(entry.expected.result));
  }
  for (const role of ['protocolOwner', 'gatewayOwner']) {
    assert.equal(plan.agreement[role].name, 'Shaun Conway');
    assert.equal(plan.agreement[role].status, 'pending');
    assert.equal(plan.agreement[role].evidence, null);
  }
  assert.ok(plan.supplemental.some(c => c.expected === 'udid_status_unavailable'));
});

for (const [name, change] of [
  ['missing agent', r => { delete r.aut.agent; }],
  ['missing payer', r => { delete r.act.pay.payer; }],
  ['DTB multi-leg substitution', r => { r.act.legs = multi().act.legs; delete r.act.pay; }],
  ['both pay and legs', r => { r.act.legs = multi().act.legs; }],
  ['empty audience', r => { r.aud = []; }],
  ['duplicate audience', r => { r.aud = ['urn:example:a', 'urn:example:a']; }],
  ['unknown root property', r => { r.future = true; }],
  ['unknown nested property', r => { r.act.pay.future = true; }],
  ['private holder key', r => { r.cnf.jwk.d = 'private'; }],
  ['mismatched holder curve', r => { r.cnf.jwk.crv = 'P-256'; }],
  ['missing status index', r => { delete r.status.status_list.idx; }],
  ['fractional status index', r => { r.status.status_list.idx = 0.5; }],
  ['malformed digest', r => { r.dig = 'sha256:short'; }],
  ['digest with trailing newline', r => { r.dig += '\n'; }],
  ['identifier with trailing newline', r => { r.jti += '\n'; }],
  ['overflowed ULID', r => { r.jti = 'urn:udid:81J9Z8Q3H4K6Y2N7T1R5V8W0XA'; }],
  ['unsupported decision outcome', r => { r.dec.outcome = 'eligible'; }],
  ['unsupported method', r => { r.act.pay.scheme = 'unknown'; }],
  ['raw SD marker in nested extension', r => { r.extensions['urn:example:fixture'].array = [{ _sd: [] }]; }],
  ['nonnamespaced extension', r => { r.extensions.unregistered = true; }],
]) {
  test(`UDID wire schema rejects ${name} without relying on semantic code`, () => {
    const record = decision();
    change(record);
    assert.equal(validateSchema(record), false);
    assert.equal(validate(record).checks.schema, 'failed');
  });
}

test('amount grammar rejects floating point, signs, leading zeros and exponents', () => {
  for (const amount of [1, 1.5, '-1', '+1', '01', '1.0', '1e3', '', ' 1', '1\n', '1\r']) {
    const record = decision();
    record.act.pay.amount = amount;
    assert.equal(validateSchema(record), false, String(amount));
  }
  for (const amount of ['0', '9007199254740993123456789']) {
    const record = receipt();
    record.act.pay.amount = record.stl[0].amount = amount;
    assert.equal(validate(record).recordValid, true);
    record.stl[0].amount = (BigInt(amount) + 1n).toString();
    assert.equal(validate(record).recordValid, false);
  }
});

test('upto boundary is inclusive and a one-unit overspend fails', () => {
  for (const [amount, expected] of [['0', true], ['2499999', true], ['2500000', true], ['2500001', false]]) {
    const record = receipt();
    record.act.pay.scheme = record.stl[0].scheme = 'upto';
    record.stl[0].amount = amount;
    assert.equal(validate(record).recordValid, expected);
  }
});

test('receipt requires complete binding, declared legs, unique receipts and group exclusion', () => {
  for (const change of [
    r => { r.stl[0].network = 'example:other'; },
    r => { r.stl[0].asset = 'OTHER'; },
    r => { r.stl[0].scheme = 'upto'; },
    r => { delete r.stl[0].payer; },
    r => { r.stl[0].payer = 'other'; },
    r => { r.stl[0].leg = 'missing'; },
    r => { r.stl.push(structuredClone(r.stl[0])); },
    r => { r.dec.outcome = 'rejected'; },
    r => { r.stl[0].proof = {}; },
  ]) {
    const record = receipt();
    change(record);
    assert.equal(validate(record).recordValid, false);
  }
  const record = multi();
  delete record.act.legs[2].group;
  assert.equal(validate(record).recordValid, false);
  const partial = read('valid/dtp-multi-leg-settled.json');
  partial.stl = [partial.stl[0]];
  assert.equal(validate(partial).recordValid, true, 'One receipt does not claim all legs settled');
});

test('historical timestamps are checked without applying the current clock', () => {
  const record = decision();
  record.exp = record.nbf;
  assert.equal(validate(record).recordValid, false);
  record.exp = record.act.validUntil + 1;
  assert.equal(validate(record).recordValid, false);
  record.exp = record.act.validUntil - 1;
  assert.equal(validate(record).recordValid, true, 'Deferred deadline can be represented');
  for (const [offset, expected] of [[-1, false], [0, true], [900, true], [901, false]]) {
    const settled = receipt();
    settled.stl[0].settledAt = settled.iat + offset;
    assert.equal(validate(settled).recordValid, expected);
  }
});

test('failed evaluation dependencies remain failures and cannot support approval', () => {
  for (const result of ['error', 'unavailable']) {
    const record = decision();
    record.evl.checks[0].result = result;
    assert.ok(validate(record).errors.some(e => e.code === 'evaluation_incomplete'));
    record.dec.outcome = 'manual_review_required';
    assert.equal(validate(record).recordValid, true);
  }
});

test('internal resource and commitment references cannot contradict their action', () => {
  const record = decision();
  record.lnk.x402.resourceUrlHash = `sha256:${'0'.repeat(64)}`;
  assert.ok(validate(record).errors.some(e => e.code === 'resource_mismatch'));
  const payout = multi();
  payout.prf = { eip712: [{ leg: 'fund', chainId: 5042002, verifyingContract: `0x${'0'.repeat(40)}`, signature: `0x${'0'.repeat(130)}` }] };
  assert.equal(validate(payout).recordValid, true);
  payout.prf.eip712[0].chainId = 8453;
  assert.ok(validate(payout).errors.some(e => e.code === 'commitment_leg_mismatch'));
});

test('extension challenge has literal dots and kb defaults never modify the record', () => {
  const config = { profile: UDID_PROFILE, kind: 'info' };
  for (const challenge of ['v1x123x0123456789abcdef', 'v1\\.123\\.0123456789abcdef', 'v1.0123.0123456789abcdef', 'v1.123.0123', 'v2.123.0123456789abcdef']) {
    const record = info();
    record.challenge = challenge;
    assert.equal(validateUdidRecord(record, config).recordValid, false);
  }
  const record = info();
  record.challenge += '\n';
  assert.equal(validateUdidRecord(record, config).recordValid, false);
  record.challenge = info().challenge;
  delete record.kb;
  const original = structuredClone(record);
  assert.equal(validateUdidRecord(record, config).recordValid, true);
  assert.deepEqual(record, original);
  record.version = 2;
  assert.equal(validateUdidRecord(record, config).recordValid, false);
});

test('unknown or omitted profile selection never falls back to a known schema', () => {
  for (const config of [undefined, {}, { ...options, profile: 'udid/2' }, { ...options, kind: '__proto__' }, { ...options, kind: 'token' }]) {
    assert.equal(validateUdidRecord(decision(), config).recordValid, false);
  }
  const core = JSON.parse(readFileSync(new URL('../examples/valid/pay-simulation.json', import.meta.url)));
  assert.equal(validate(core).recordValid, false);
});

test('malformed JSON, unsafe values and accessors are rejected without evaluating them', () => {
  for (const input of ['{"a":1,"a":2}', '{"a":1,"\\u0061":2}', '{"x":1e400}', '{"x":"\\ud800"}', '{"x":9007199254740992}']) {
    const report = validate(input);
    assert.equal(report.recordValid, false);
    assert.equal(report.errors[0].code, 'input');
  }
  const record = decision();
  Object.defineProperty(record, 'dig', { enumerable: true, get() { throw new Error('getter was called'); } });
  assert.equal(validate(record).errors[0].message, 'JSON properties must be enumerable string data properties');
});

test('valid JSON and claimed status never imply verified tokens or trigger dependencies', () => {
  const previous = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Network dependency invoked'); };
  try {
    const record = decision();
    record.dig = `sha256:${'0'.repeat(64)}`;
    const before = structuredClone(record);
    const report = validate(record);
    assert.equal(report.recordValid, true);
    assert.equal(report.verification, 'not_performed');
    assert.ok(report.notPerformed.includes('status'));
    assert.ok(report.notPerformed.includes('decision_digest'));
    assert.ok(report.notPerformed.includes('authority'));
    assert.ok(report.notPerformed.includes('settlement'));
    assert.deepEqual(record, before);
    assert.equal(validate('eyJ...~disclosure~').recordValid, false);
  } finally { globalThis.fetch = previous; }
});

test('source digest conflicts remain reproducible for trimmed and settled claim sets', () => {
  const sourceDigest = record => {
    const { dig: _dig, prf: _prf, stl: _stl, ...preimage } = record;
    return digest(preimage);
  };
  const full = decision();
  const merchant = read('valid/dtb-merchant-disclosure.json');
  const settled = receipt();
  assert.equal(sourceDigest(full), full.dig);
  assert.equal(full.dig, merchant.dig);
  assert.equal(full.dig, settled.dig);
  assert.notEqual(sourceDigest(merchant), merchant.dig);
  assert.notEqual(sourceDigest(settled), settled.dig);
});

test('UDID CLI returns structured boundaries and rejects malformed UTF-8 and bad usage', () => {
  const cli = new URL('../tools/validate-udid.mjs', import.meta.url);
  const run = args => spawnSync(process.execPath, [cli.pathname, ...args], { encoding: 'utf8' });
  const valid = run([UDID_PROFILE, 'claim-set', new URL('valid/dtb-decision.json', root).pathname]);
  assert.equal(valid.status, 0);
  assert.equal(JSON.parse(valid.stdout).verification, 'not_performed');
  const invalid = run([UDID_PROFILE, 'claim-set', new URL('invalid/missing-dtb-agent.json', root).pathname]);
  assert.equal(invalid.status, 1);
  assert.equal(run([]).status, 2);
  const dir = mkdtempSync(join(tmpdir(), 'udid-cli-'));
  try {
    const file = join(dir, 'invalid-utf8.json');
    writeFileSync(file, Buffer.from([0x22, 0xc3, 0x28, 0x22]));
    const result = run([UDID_PROFILE, 'claim-set', file]);
    assert.equal(result.status, 1);
    assert.equal(JSON.parse(result.stderr).errors[0].code, 'input');
    assert.equal(run([UDID_PROFILE, 'claim-set', join(dir, 'missing.json')]).status, 1);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
