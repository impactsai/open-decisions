import { readFileSync, writeFileSync } from 'node:fs';
const schema=JSON.parse(readFileSync(new URL('../schemas/decision-evals/0.1.0-draft.1/contract.schema.json',import.meta.url)));
const name=s=>s[0].toUpperCase()+s.slice(1);
function type(s){
 if(s.$ref?.startsWith('https://'))return "import('../comparison/contracts').ComparisonBundle";
 if(s.$ref)return name(s.$ref.split('/').at(-1));
 if('const'in s)return JSON.stringify(s.const);
 if(s.enum)return s.enum.map(x=>JSON.stringify(x)).join(' | ');
 if(s.oneOf||s.anyOf)return (s.oneOf??s.anyOf).map(type).join(' | ');
 if(s.type==='object')return `{ ${Object.entries(s.properties).map(([k,v])=>`${JSON.stringify(k)}${s.required.includes(k)?'':'?'}: ${type(v)}`).join('; ')} }`;
 if(s.type==='array')return `Array<${type(s.items)}>`;
 return {integer:'number',string:'string',boolean:'boolean',null:'null'}[s.type]??'unknown';
}
const code='// Generated from the normative JSON Schema.\n'+Object.entries(schema.$defs).map(([k,v])=>`export type ${name(k)} = ${type(v)};`).join('\n')+'\n';
const path=new URL('../evals/types.d.ts',import.meta.url);
if(process.argv.includes('--check')){if(readFileSync(path,'utf8')!==code)throw new Error('Evals types are stale');}else writeFileSync(path,code);
