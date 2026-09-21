import { readFileSync, statSync } from 'node:fs';
import { validateUdidRecord } from '../udid/index.mjs';

if (process.argv.length !== 5) {
  console.error('Usage: npm run validate:udid -- udid/2.0.0-draft.1 <claim-set|info> path/to/record.json');
  process.exitCode = 2;
} else {
  try {
    const [profile, kind, path] = process.argv.slice(2);
    if (statSync(path).size > 4 * 1024 * 1024) throw new Error('JSON input exceeds 4 MiB');
    const input = new TextDecoder('utf-8', { fatal: true }).decode(readFileSync(path));
    const report = validateUdidRecord(input, { profile, kind });
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.recordValid ? 0 : 1;
  } catch (error) {
    console.error(JSON.stringify({ recordValid: false, verification: 'not_performed', errors: [{ code: 'input', message: error.message }] }));
    process.exitCode = 1;
  }
}
