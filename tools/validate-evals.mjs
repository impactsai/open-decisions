import { readFileSync } from 'node:fs';
import { parseEvalsJSON, validateBundle } from '../evals/index.mjs';
try {
  if(process.argv.length!==3)throw new Error('Usage: npm run evals:validate -- <bundle.json>');
  const bytes=readFileSync(process.argv[2]);
  const bundle=await validateBundle(parseEvalsJSON(new TextDecoder('utf-8',{fatal:true}).decode(bytes)));
  console.log(JSON.stringify({valid:true,kit:bundle.subject.kit,configurations:bundle.modelCard.configurations.map(c=>({status:c.status,permittedModes:c.permittedModes})),verification:{schema:'passed',semantics:'passed',replay:'passed',independentLabels:'not_performed',authority:'not_performed',evidenceAuthenticity:'not_performed',execution:'not_performed'}},null,2));
}catch(error){console.error(error.message);process.exitCode=1;}
