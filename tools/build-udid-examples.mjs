import { mkdirSync, writeFileSync } from 'node:fs';
import { digest } from './json.mjs';

const root = new URL('../examples/udid/2.0.0-draft.1/', import.meta.url);
for (const dir of ['valid', 'invalid']) mkdirSync(new URL(dir, root), { recursive: true });
const hash = label => digest({ fictional: label });
const proof = { jws: 'eyJhbGciOiJFZERTQSJ9..ZmljdGlvbmFs' };
const decision = {
  iss: 'did:web:issuer.example', jti: 'urn:udid:01J9Z8Q3H4K6Y2N7T1R5V8W0XA',
  iat: 1796205600, nbf: 1796205600, exp: 1796206500,
  vct: 'https://ixo.world/udid/v2', dig: hash('placeholder'), sub: hash('fictional cart'),
  aud: ['https://verifier.example', 'did:web:merchant.example'],
  cnf: { jwk: { kty: 'OKP', crv: 'Ed25519', x: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' } },
  status: { status_list: { idx: 0, uri: 'https://issuer.example/status/fictional' } },
  dec: { type: 'DecisionToBuy', outcome: 'approved', reasons: ['fixture:conditions-met'], confidence: 0.97, reviewed: false, reviewLevel: 'none' },
  act: {
    kind: 'purchase', pay: {
      scheme: 'exact', network: 'example:offline', asset: 'TEST', amount: '2500000',
      payTo: 'fictional-merchant', payer: 'fictional-buyer', maxTimeoutSeconds: 300,
    },
    resource: { urlHash: hash('fictional resource'), description: 'Fictional connectivity bundle; no order is placed.' },
    validUntil: 1796206500,
  },
  rub: { id: 'urn:example:rubric:connectivity', version: '1.0.2', cid: 'fictional-rubric-reference', blueprint: 'urn:example:blueprint:connectivity' },
  aut: {
    principal: 'urn:example:principal', agent: 'urn:example:agent',
    invocation: 'fictional-invocation-reference', delegationRoot: 'fictional-delegation-reference',
    cmd: '/ixo/decide/buy', policyDigest: hash('fictional policy'),
  },
  evl: {
    oracles: [{ did: 'did:web:evaluator.example', model: 'fictional-evaluator', version: '1' }],
    checks: [{ id: 'mandate.within-limits', result: 'pass' }, { id: 'price.reasonable', result: 'pass', score: 0.97 }],
    reviewers: ['urn:example:reviewer'], trace: { cid: 'fictional-trace-reference', hash: hash('fictional trace') },
  },
  evd: [{ id: 'offer', type: 'application/json', hash: hash('fictional evidence'), accessPolicy: 'urn:example:restricted' }],
  clm: [{ type: 'FictionalOffer', issuer: 'did:web:merchant.example', hash: hash('fictional credential') }],
  lnk: { x402: { resourceUrlHash: hash('fictional resource'), acceptedHash: hash('fictional requirements') } },
  explanation: 'Fictional approved determination. No authority, evidence, keys, or payments have been verified.',
  extensions: { 'urn:example:fixture': { mode: 'simulation', cryptographicMaterial: 'placeholder' } },
};
function sourceDigest(record) {
  const { dig: _dig, prf: _prf, stl: _stl, ...claims } = record;
  return digest(claims);
}
decision.dig = sourceDigest(decision);
function settled(record, ids) {
  const result = structuredClone(record);
  delete result.exp;
  const legs = record.act.pay ? [record.act.pay] : record.act.legs;
  result.stl = legs.filter(leg => ids.includes(leg.id ?? 'primary')).map(leg => ({
    leg: leg.id ?? 'primary', rail: 'fictional', network: leg.network, scheme: leg.scheme,
    asset: leg.asset, amount: leg.amount, payTo: leg.payTo,
    ...(leg.payer ? { payer: leg.payer } : {}),
    settledAt: record.iat + 45, settler: 'did:web:settler.example',
    transaction: `fictional-transaction-${leg.id ?? 'primary'}`, proof,
  }));
  return result;
}
const merchant = structuredClone(decision);
delete merchant.aut.principal;
delete merchant.evl.reviewers;
delete merchant.evl.trace;
for (const name of ['evd', 'clm', 'explanation']) delete merchant[name];
const multi = structuredClone(decision);
multi.jti = 'urn:udid:01J9Z8Q3H4K6Y2N7T1R5V8W0XB';
multi.dec.type = 'DecisionToPay';
multi.aut.cmd = '/ixo/decide/pay';
delete multi.act.pay;
delete multi.act.resource;
delete multi.lnk;
multi.act.kind = 'payout';
multi.act.legs = [
  { id: 'fund', role: 'fund', scheme: 'release', network: 'eip155:5042002', asset: 'FICTIONAL-TOKEN', amount: '5000000', payTo: 'fictional-programme' },
  { id: 'disburse', role: 'disburse', group: 'recipient', scheme: 'payout', network: 'stripe:global-payouts', asset: 'ZAR', amount: '9000', payTo: 'fictional-recipient' },
  { id: 'alternative', role: 'alternative', group: 'recipient', scheme: 'oct', network: 'visa:direct', asset: 'ZAR', amount: '9000', payTo: 'fictional-recipient-token' },
];
multi.dig = sourceDigest(multi);
const incomplete = structuredClone(decision);
incomplete.dec.outcome = 'manual_review_required';
incomplete.dec.reasons = ['fixture:evaluator-unavailable'];
incomplete.evl.checks = [{ id: 'price.reasonable', result: 'unavailable' }];
incomplete.dig = sourceDigest(incomplete);
const info = {
  version: '2', required: true, decisionType: 'DecisionToBuy', issuers: ['did:web:issuer.example'],
  verifier: 'https://verifier.example', challenge: 'v1.1796205590.0123456789abcdef', kb: true,
  bind: ['payTo', 'asset', 'network', 'amount', 'resourceUrl', 'payer'],
  disclose: ['dec', 'act', 'rub.id', 'lnk.x402'],
  rubric: 'urn:example:rubric:connectivity', decideUrl: 'https://issuer.example/decisions',
};
const fixtures = [];
function save(path, kind, record, expected, errorCode) {
  const bytes = `${JSON.stringify(record, null, 2)}\n`;
  writeFileSync(new URL(path, root), bytes);
  fixtures.push({ path, kind, recordValid: expected, ...(errorCode ? { errorCode } : {}), verification: 'not_performed' });
}
save('valid/dtb-decision.json', 'claim-set', decision, true);
save('valid/dtb-merchant-disclosure.json', 'claim-set', merchant, true);
const receipt = settled(decision, ['primary']);
save('valid/dtb-settled.json', 'claim-set', receipt, true);
save('valid/dtp-multi-leg-decision.json', 'claim-set', multi, true);
const multiReceipt = settled(multi, ['fund', 'disburse']);
save('valid/dtp-multi-leg-settled.json', 'claim-set', multiReceipt, true);
save('valid/evaluator-unavailable.json', 'claim-set', incomplete, true);
save('valid/extension-info.json', 'info', info, true);
function invalid(name, base, mutate, errorCode = 'schema', kind = 'claim-set') {
  const record = structuredClone(base);
  mutate(record);
  save(`invalid/${name}.json`, kind, record, false, errorCode);
}
invalid('unknown-version', decision, r => { r.vct = 'https://ixo.world/udid/v3'; });
invalid('raw-disclosures', decision, r => { r.aut._sd = ['fictional']; });
invalid('missing-dtb-payer', decision, r => { delete r.act.pay.payer; });
invalid('missing-dtb-agent', decision, r => { delete r.aut.agent; });
invalid('both-lifecycle-forms', receipt, r => { r.exp = decision.exp; });
invalid('neither-lifecycle-form', decision, r => { delete r.exp; });
invalid('unknown-scheme', decision, r => { r.act.pay.scheme = 'future-payment'; });
invalid('decimal-amount', decision, r => { r.act.pay.amount = '2.50'; });
invalid('duplicate-leg', multi, r => { r.act.legs[1].id = 'fund'; }, 'duplicate_leg');
invalid('unknown-settlement-leg', receipt, r => { r.stl[0].leg = 'missing'; }, 'unknown_leg');
invalid('settlement-payee-mismatch', receipt, r => { r.stl[0].payTo = 'other'; }, 'binding_mismatch');
invalid('upto-over-ceiling', receipt, r => { r.act.pay.scheme = r.stl[0].scheme = 'upto'; r.stl[0].amount = '2500001'; }, 'binding_mismatch');
invalid('two-alternatives-settled', multiReceipt, r => { r.stl.push(settled(multi, ['alternative']).stl[0]); }, 'alternative_already_settled');
invalid('approved-with-failed-evaluator', decision, r => { r.evl.checks[0].result = 'error'; }, 'evaluation_incomplete');
invalid('invalid-challenge', info, r => { r.challenge = 'v1x1796205590x0123456789abcdef'; }, 'schema', 'info');
writeFileSync(new URL('manifest.json', root), `${JSON.stringify({
  profile: 'udid/2.0.0-draft.1',
  description: 'Fictional processed-record examples, not signed Appendix C vectors. The source digest rule cannot recompute for both trimmed and settled forms; see RFC 0005.',
  fixtures,
}, null, 2)}\n`);
