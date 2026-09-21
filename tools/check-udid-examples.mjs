import { readFileSync } from 'node:fs';
import { validateUdidRecord } from '../udid/index.mjs';

const root = new URL('../examples/udid/2.0.0-draft.1/', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('manifest.json', root), 'utf8'));
let failures = 0;
for (const fixture of manifest.fixtures) {
  const report = validateUdidRecord(readFileSync(new URL(fixture.path, root), 'utf8'), {
    profile: manifest.profile, kind: fixture.kind,
  });
  const matches = report.recordValid === fixture.recordValid && report.verification === fixture.verification &&
    (!fixture.errorCode || report.errors.some(error => error.code === fixture.errorCode));
  if (!matches) {
    failures++;
    console.error(`FAIL ${fixture.path}: ${JSON.stringify(report)}`);
  } else console.log(`${report.recordValid ? 'PASS' : 'REJECT'} ${fixture.path}`);
}
if (failures) process.exitCode = 1;
else console.log('UDID record fixtures passed. Token verification and all 13 M1 signed-vector families remain unperformed.');
