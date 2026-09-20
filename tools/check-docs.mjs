import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const failures = [];
function walk(dir) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules'].includes(item.name)) continue;
    const file = resolve(dir, item.name);
    if (item.isDirectory()) walk(file);
    else if (item.name.endsWith('.md')) {
      const text = readFileSync(file, 'utf8');
      for (const match of text.matchAll(/\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
        const target = match[1].split('#')[0];
        if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
        if (!existsSync(resolve(dirname(file), decodeURIComponent(target)))) failures.push(`${file}: ${target}`);
      }
    }
  }
}
walk(root);
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log('Local Markdown file links resolve (fragment anchors and remote URLs not checked).');
