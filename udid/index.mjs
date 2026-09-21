import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { assertJSON, parseJSON } from '../tools/json.mjs';

export const UDID_PROFILE = 'udid/2.0.0-draft.1';
const ajv = new Ajv2020({ allErrors: true, strict: true, strictTypes: false, strictRequired: false });
addFormats(ajv);
const validators = Object.fromEntries([
  ['claim-set', 'processed-claim-set'], ['info', 'udid-info'],
].map(([kind, file]) => {
  const schema = parseJSON(readFileSync(new URL(`../schemas/udid/2.0.0-draft.1/${file}.schema.json`, import.meta.url), 'utf8'));
  return [kind, { id: schema.$id, validate: ajv.compile(schema) }];
}));

function checkClaimSet(record, errors) {
  const fail = (code, path, message) => errors.push({ code, path, message });
  const legs = record.act.pay ? [record.act.pay] : record.act.legs;
  const legId = leg => leg.id ?? 'primary';
  const indexed = new Map();
  for (const [i, leg] of legs.entries()) {
    if (indexed.has(legId(leg))) fail('duplicate_leg', '/act', `Duplicate leg id at index ${i}`);
    indexed.set(legId(leg), leg);
  }
  if (record.nbf !== undefined && record.nbf < record.iat) {
    fail('invalid_time', '/nbf', 'nbf must be at or after iat');
  }
  if (record.act.validUntil <= (record.nbf ?? record.iat)) {
    fail('invalid_time', '/act/validUntil', 'Action deadline must follow the start of validity');
  }
  if (record.exp !== undefined && (record.exp <= (record.nbf ?? record.iat) || record.exp > record.act.validUntil)) {
    fail('invalid_time', '/exp', 'exp must follow the start of validity and not exceed act.validUntil');
  }
  const checks = record.evl?.checks ?? [];
  if (new Set(checks.map(check => check.id)).size !== checks.length) {
    fail('duplicate_check', '/evl/checks', 'Evaluation check ids must be unique');
  }
  if (record.dec.outcome === 'approved' && checks.some(check => check.result === 'error' || check.result === 'unavailable')) {
    fail('evaluation_incomplete', '/dec/outcome', 'An unavailable or failed evaluation cannot support approval');
  }
  if (record.evd && new Set(record.evd.map(item => item.id)).size !== record.evd.length) {
    fail('duplicate_evidence', '/evd', 'Evidence ids must be unique');
  }
  if (record.act.resource && record.lnk?.x402 && record.act.resource.urlHash !== record.lnk.x402.resourceUrlHash) {
    fail('resource_mismatch', '/lnk/x402/resourceUrlHash', 'Resource hashes must agree');
  }
  const settledLegs = new Set();
  const settledGroups = new Set();
  for (const [i, settlement] of (record.stl ?? []).entries()) {
    const path = `/stl/${i}`;
    const leg = indexed.get(settlement.leg);
    if (!leg) {
      fail('unknown_leg', `${path}/leg`, 'Settlement must reference a declared leg');
      continue;
    }
    if (settledLegs.has(settlement.leg)) fail('duplicate_settlement', `${path}/leg`, 'A leg may appear only once');
    settledLegs.add(settlement.leg);
    if (leg.group) {
      if (settledGroups.has(leg.group)) fail('alternative_already_settled', `${path}/leg`, 'At most one leg per group may be recorded as settled');
      settledGroups.add(leg.group);
    }
    for (const field of ['network', 'asset', 'payTo']) {
      if (settlement[field] !== leg[field]) fail('binding_mismatch', `${path}/${field}`, 'Settlement must match its declared leg exactly');
    }
    for (const field of ['scheme', 'payer']) {
      if ((field === 'payer' && leg.payer !== undefined) || settlement[field] !== undefined) {
        if (settlement[field] !== leg[field]) fail('binding_mismatch', `${path}/${field}`, 'Settlement must match its declared leg exactly');
      }
    }
    const amount = BigInt(settlement.amount);
    const limit = BigInt(leg.amount);
    if (leg.scheme === 'upto' ? amount > limit : amount !== limit) {
      fail('binding_mismatch', `${path}/amount`, 'Amount must equal its leg, or be at most the ceiling for upto');
    }
    if (settlement.settledAt < (record.nbf ?? record.iat) || settlement.settledAt > record.act.validUntil) {
      fail('invalid_time', `${path}/settledAt`, 'Settlement time must lie within the recorded action window');
    }
  }
  if (record.stl && !['approved', 'partial_success'].includes(record.dec.outcome)) {
    fail('outcome_not_settleable', '/dec/outcome', 'A settlement claim requires approved or partial_success');
  }
  for (const [i, commitment] of (record.prf?.eip712 ?? []).entries()) {
    const leg = indexed.get(commitment.leg);
    if (!leg || leg.network !== `eip155:${commitment.chainId}`) {
      fail('commitment_leg_mismatch', `/prf/eip712/${i}`, 'Commitment must name an EVM leg on its recorded chain');
    }
  }
}

/** Check a processed JSON record only; never a token verifier or action gate. */
export function validateUdidRecord(input, { profile, kind } = {}) {
  const report = {
    profile: UDID_PROFILE,
    conformanceClass: 'processed-record',
    recordValid: false,
    verification: 'not_performed',
    checks: { schema: 'not_performed', semantics: 'not_performed' },
    notPerformed: ['issuer_signature', 'selective_disclosure', 'decision_digest', 'schema_integrity',
      'holder_binding', 'issuer_trust', 'authority', 'evidence', 'current_validity', 'status',
      'redemption', 'settler_signature', 'settlement', 'decision_replay', 'decision_lineage'],
    errors: [],
  };
  if (profile !== UDID_PROFILE || !Object.hasOwn(validators, kind ?? '')) {
    report.errors.push({ code: 'unsupported_profile', path: '', message: 'Select udid/2.0.0-draft.1 and kind claim-set or info explicitly' });
    return report;
  }
  const { id, validate } = validators[kind];
  report.schemaId = id;
  try {
    const record = typeof input === 'string' ? parseJSON(input) : input;
    assertJSON(record);
    if (!validate(record)) {
      report.checks.schema = 'failed';
      report.errors = validate.errors.map(error => ({ code: 'schema', path: error.instancePath, message: error.message }));
      return report;
    }
    report.checks.schema = 'passed';
    if (kind === 'claim-set') checkClaimSet(record, report.errors);
    report.checks.semantics = report.errors.length ? 'failed' : 'passed';
    report.recordValid = report.errors.length === 0;
  } catch (error) {
    report.errors.push({ code: 'input', path: '', message: error.message });
  }
  return report;
}
