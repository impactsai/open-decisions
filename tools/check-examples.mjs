import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import { parseJSON } from './json.mjs';
import { validateBundle } from './validator.mjs';
const read = file => parseJSON(readFileSync(new URL(`../examples/${file}`, import.meta.url), 'utf8'));
const manifest = read('manifest.json');
for (const kind of ['valid', 'invalid']) {
  const files = readdirSync(new URL(`../examples/${kind}/`, import.meta.url)).filter(f => f.endsWith('.json')).map(f => `${kind}/${f}`).sort();
  const listed = (kind === 'valid' ? manifest.valid : manifest.invalid.map(f => f.file)).toSorted();
  assert.deepEqual(files, listed, `Every ${kind} fixture must appear exactly once in the manifest`);
}
for (const file of manifest.valid) {
  const report = validateBundle(read(file));
  assert.equal(report.valid, true, `${file}: ${JSON.stringify(report.errors)}`);
  console.log(`PASS ${file}`);
}
for (const { file, expectedCode } of manifest.invalid) {
  const report = validateBundle(read(file));
  assert.equal(report.valid, false, `${file} must be rejected`);
  assert.ok(report.errors.some(e => e.code === expectedCode), `${file}: expected ${expectedCode}; got ${JSON.stringify(report.errors)}`);
  console.log(`REJECT ${file}: ${expectedCode}`);
}
console.log('Conformance fixtures passed; no external truth, authority, or execution was verified.');
