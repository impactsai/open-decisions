import { readFileSync, statSync } from 'node:fs';
import { parseJSON } from './json.mjs';
import { validateBundle } from './validator.mjs';

if (process.argv.length !== 3) {
  console.error('Usage: npm run validate -- path/to/bundle.json');
  process.exitCode = 2;
} else {
  try {
    const path = process.argv[2];
    if (statSync(path).size > 4 * 1024 * 1024) throw new Error('JSON input exceeds 4 MiB');
    const text = new TextDecoder('utf-8', { fatal: true }).decode(readFileSync(path));
    const report = validateBundle(parseJSON(text));
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.valid ? 0 : 1;
  } catch (error) {
    console.error(JSON.stringify({ valid: false, errors: [{ code: 'input', message: error.message }] }));
    process.exitCode = 1;
  }
}
