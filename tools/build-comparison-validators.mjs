import { readFileSync, writeFileSync } from 'node:fs';
import Ajv from 'ajv/dist/2020.js';
import standalone from 'ajv/dist/standalone/index.js';

const schema = JSON.parse(readFileSync(new URL('../schemas/comparison/0.1.0-draft.1/contract.schema.json', import.meta.url)));
const ajv = new Ajv({ strict: true, ownProperties: true, code: { source: true, esm: true, lines: true } });
ajv.addSchema(schema);
const names = ['kit', 'context', 'assessments', 'request', 'manifest', 'bundle'];
const code = '// Generated from the normative JSON Schema. Run npm run comparison:generate.\n' +
  standalone(ajv, Object.fromEntries(names.map(n => [n, `${schema.$id}#/$defs/${n}`])));
// The runtime must load in Workers without eval, Node imports, or CommonJS helpers.
if (/\brequire\(|\bnew Function\(/.test(code)) throw new Error('Non-portable standalone validator');
const path = new URL('../comparison/validators.mjs', import.meta.url);
if (process.argv.includes('--check')) {
  if (readFileSync(path, 'utf8') !== code) throw new Error('Comparison validators are stale');
} else writeFileSync(path, code);
