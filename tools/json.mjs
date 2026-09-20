import canonicalize from 'canonicalize';
import { createHash } from 'node:crypto';

// Apply the same JSON domain to in-memory inputs and wire inputs before hashing.
export function assertJSON(value, depth = 0, ancestors = new Set()) {
  if (depth > 64) throw new Error('JSON nesting exceeds 64 levels');
  if (value === null || typeof value === 'boolean') return;
  if (typeof value === 'string') {
    if (/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(value)) {
      throw new Error('JSON contains a lone Unicode surrogate');
    }
    return;
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || (Number.isInteger(value) && !Number.isSafeInteger(value))) {
      throw new Error('JSON numbers must be finite and integers must be safe');
    }
    return;
  }
  if (typeof value !== 'object' || ancestors.has(value)) throw new Error('Invalid JSON value');
  const prototype = Object.getPrototypeOf(value);
  if (!Array.isArray(value) && prototype !== Object.prototype && prototype !== null) {
    throw new Error('JSON records must be plain objects');
  }
  for (const key of Reflect.ownKeys(value)) {
    if (Array.isArray(value) && key === 'length') continue;
    const property = Object.getOwnPropertyDescriptor(value, key);
    if (typeof key !== 'string' || !property.enumerable || !Object.hasOwn(property, 'value')) {
      throw new Error('JSON properties must be enumerable string data properties');
    }
  }
  if (Array.isArray(value) && (Object.keys(value).length !== value.length ||
      !Array.from({ length: value.length }, (_, i) => Object.hasOwn(value, i)).every(Boolean))) {
    throw new Error('Sparse or extended JSON array');
  }
  ancestors.add(value);
  for (const [key, item] of Object.entries(value)) {
    assertJSON(key, depth + 1, ancestors);
    assertJSON(item, depth + 1, ancestors);
  }
  ancestors.delete(value);
}

export function parseJSON(text) {
  if (Buffer.byteLength(text, 'utf8') > 4 * 1024 * 1024) throw new Error('JSON input exceeds 4 MiB');
  // JSON.parse validates syntax; this second pass detects keys it would overwrite.
  const parsed = JSON.parse(text);
  const tokens = text.match(/"(?:[^"\\]|\\.)*"|[{}\[\],:]|[^\s{}\[\],:]+/g) ?? [];
  let index = 0;
  function walk(depth = 0) {
    if (depth > 64) throw new Error('JSON nesting exceeds 64 levels');
    const token = tokens[index++];
    if (token === '{') {
      const keys = new Set();
      while (tokens[index] !== '}') {
        const key = JSON.parse(tokens[index++]);
        if (keys.has(key)) throw new Error('Duplicate JSON object key');
        keys.add(key);
        index++; // colon; syntax was validated above
        walk(depth + 1);
        if (tokens[index] !== ',') break;
        index++;
      }
      index++;
    } else if (token === '[') {
      while (tokens[index] !== ']') {
        walk(depth + 1);
        if (tokens[index] !== ',') break;
        index++;
      }
      index++;
    }
  }
  walk();
  assertJSON(parsed);
  return parsed;
}

export function digest(value) {
  assertJSON(value);
  return `sha256:${createHash('sha256').update(canonicalize(value), 'utf8').digest('hex')}`;
}

export function reference(record) {
  return { id: record.id, digest: digest(record) };
}

export function inputDigest({ protocol, request, evaluations }) {
  return digest({ protocol, request, evaluations });
}

export function bundleDigest(bundle) {
  const { integrity: _integrity, ...payload } = bundle;
  return digest(payload);
}
