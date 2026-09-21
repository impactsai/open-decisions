import * as validators from './validators.mjs';

export const PROFILE_VERSION = 'comparison/0.1.0-draft.1';
export const METHOD = 'smaa-weighted-sum-v1';
export class ComparisonError extends Error {
  constructor(code, message) { super(message); this.name = 'ComparisonError'; this.code = code; }
}
export function requireCondition(condition, code, message) {
  if (!condition) throw new ComparisonError(code, message);
}

// Reject values whose JSON representation would discard information or run user code.
// Also bounds aggregate input before schema validation or hashing, including JS callers.
export function canonicalJSON(value) {
  let nodes = 0;
  const ancestors = new Set();
  function encode(v, depth) {
    requireCondition(++nodes <= 2000000 && depth <= 32, 'LIMIT', 'JSON complexity limit exceeded');
    if (v === null || typeof v === 'boolean') return JSON.stringify(v);
    if (typeof v === 'string') {
      requireCondition(!/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(v), 'JSON', 'Unpaired surrogate');
      return JSON.stringify(v);
    }
    if (typeof v === 'number') {
      requireCondition(Number.isSafeInteger(v), 'JSON', 'Only safe integers are allowed');
      return JSON.stringify(v);
    }
    requireCondition(typeof v === 'object' && !ancestors.has(v), 'JSON', 'Expected acyclic JSON');
    const array = Array.isArray(v);
    requireCondition(array || Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null, 'JSON', 'Expected plain JSON object');
    const keys = Reflect.ownKeys(v).filter(k => !(array && k === 'length'));
    requireCondition(keys.every(k => typeof k === 'string' && Object.getOwnPropertyDescriptor(v, k).enumerable && 'value' in Object.getOwnPropertyDescriptor(v, k)), 'JSON', 'Invalid JSON property');
    if (array) requireCondition(keys.length === v.length && keys.every((k, i) => k === String(i)), 'JSON', 'Sparse or extended array');
    ancestors.add(v);
    const result = array ? `[${keys.map(k => encode(v[k], depth + 1)).join(',')}]` :
      `{${keys.sort().map(k => `${encode(k, depth + 1)}:${encode(v[k], depth + 1)}`).join(',')}}`;
    ancestors.delete(v);
    return result;
  }
  const result = encode(value, 0);
  requireCondition(new TextEncoder().encode(result).length <= 4 * 1024 * 1024, 'LIMIT', 'JSON exceeds 4 MiB');
  return result;
}

export async function digest(value) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonicalJSON(value)));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
}

export function parseComparisonJSON(text) {
  requireCondition(typeof text === 'string' && new TextEncoder().encode(text).length <= 4 * 1024 * 1024, 'LIMIT', 'JSON exceeds 4 MiB');
  let parsed;
  try { parsed = JSON.parse(text); } catch { throw new ComparisonError('JSON', 'Invalid JSON syntax'); }
  const tokens = text.match(/"(?:[^"\\]|\\.)*"|[{}\[\],:]|[^\s{}\[\],:]+/g) ?? [];
  let i = 0;
  function walk(depth = 0) {
    requireCondition(depth <= 32, 'LIMIT', 'JSON depth exceeded');
    const token = tokens[i++];
    if (token === '{') {
      const keys = new Set();
      while (tokens[i] !== '}') {
        const key = JSON.parse(tokens[i++]);
        requireCondition(!keys.has(key), 'JSON', 'Duplicate JSON key'); keys.add(key);
        i++; walk(depth + 1);
        if (tokens[i] !== ',') break;
        i++;
      }
      i++;
    } else if (token === '[') {
      while (tokens[i] !== ']') {
        walk(depth + 1);
        if (tokens[i] !== ',') break;
        i++;
      }
      i++;
    }
  }
  walk(); canonicalJSON(parsed); return parsed;
}

export function validateShape(name, value) {
  canonicalJSON(value);
  requireCondition(Object.hasOwn(validators, name), 'SCHEMA', `Unknown comparison schema: ${name}`);
  const validate = validators[name];
  requireCondition(validate(value), 'SCHEMA', `${name}: ${JSON.stringify(validate.errors)}`);
  return value;
}

export function unique(items, key, label) {
  const seen = new Set();
  for (const item of items) {
    const id = key(item);
    requireCondition(!seen.has(id), 'DUPLICATE', `Duplicate ${label}: ${id}`);
    seen.add(id);
  }
  return seen;
}
export const sorted = (items, key = x => x.id) => [...items].sort((a, b) => key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0);

export function validateKit(value) {
  const kit = validateShape('kit', value);
  const slots = unique(kit.evidenceSlots, x => x.id, 'evidence slot');
  unique(kit.criteria, x => x.id, 'criterion');
  const preferences = kit.criteria.filter(c => c.role === 'preference');
  requireCondition(preferences.length > 0, 'KIT', 'At least one preference criterion is required');
  for (const c of kit.criteria) {
    unique(c.acceptedCalibrationDigests ?? [], x => x, 'accepted calibration digest');
    unique(c.requiredEvidenceSlots, x => x, 'required slot');
    requireCondition(c.requiredEvidenceSlots.every(s => slots.has(s)), 'KIT', 'Unknown evidence slot');
    validateScale(c.scale);
    if (c.role === 'preference') requireCondition(c.weightBounds.minBp <= c.weightBounds.maxBp, 'KIT', 'Reversed weight bounds');
  }
  const ids = new Set(preferences.map(c => c.id));
  unique(kit.weightOrders, x => `${x.higher}/${x.lower}`, 'weight order');
  requireCondition(kit.weightOrders.every(o => ids.has(o.higher) && ids.has(o.lower) && o.higher !== o.lower), 'KIT', 'Invalid weight order');
  const low = new Map(preferences.map(c => [c.id, c.weightBounds.minBp]));
  const high = new Map(preferences.map(c => [c.id, c.weightBounds.maxBp]));
  for (let i = 0; i < preferences.length; i++) for (const o of kit.weightOrders) {
    low.set(o.higher, Math.max(low.get(o.higher), low.get(o.lower)));
    high.set(o.lower, Math.min(high.get(o.lower), high.get(o.higher)));
  }
  requireCondition(preferences.every(c => low.get(c.id) <= high.get(c.id)) && [...low.values()].reduce((a,b) => a+b,0) <= 10000 && [...high.values()].reduce((a,b) => a+b,0) >= 10000, 'KIT', 'Infeasible weight constraints');
  return kit;
}

function validateScale(scale) {
  if (scale.kind === 'numeric') requireCondition(scale.minimum < scale.maximum, 'KIT', 'Numeric utility anchors must increase');
  if (scale.kind === 'categorical') unique(scale.levels, x => x.id, 'scale level');
}

export async function manifestOf(value) {
  const kit = structuredClone(validateKit(value));
  return {
    profileVersion: PROFILE_VERSION, kind: 'comparison-manifest', kitDigest: await digest(kit), method: METHOD,
    evidenceSlots: structuredClone(sorted(kit.evidenceSlots)),
    tasks: sorted(kit.criteria).map(c => ({ criterionId: c.id, evaluator: structuredClone(c.evaluator), scale: structuredClone(c.scale), requiredEvidenceSlots: [...c.requiredEvidenceSlots].sort(), ...(c.acceptedCalibrationDigests ? { acceptedCalibrationDigests: [...c.acceptedCalibrationDigests].sort() } : {}) })),
  };
}

export function validateManifest(value, expectedKitDigest) {
  const manifest = validateShape('manifest', value);
  requireCondition(manifest.kitDigest === expectedKitDigest, 'BINDING', 'Manifest kit digest mismatch');
  const slots = unique(manifest.evidenceSlots, s => s.id, 'evidence slot');
  unique(manifest.tasks, t => t.criterionId, 'manifest task');
  for (const task of manifest.tasks) {
    unique(task.acceptedCalibrationDigests ?? [], x => x, 'accepted calibration digest');
    validateScale(task.scale);
    unique(task.requiredEvidenceSlots, x => x, 'required slot');
    requireCondition(task.requiredEvidenceSlots.every(s => slots.has(s)), 'MANIFEST', 'Unknown evidence slot');
  }
  return manifest;
}

export function validateContext(value, manifest) {
  const context = validateShape('context', value);
  validateManifest(manifest, context.kitDigest);
  unique(context.options, x => x.id, 'option');
  const slots = new Set(manifest.evidenceSlots.map(s => s.id));
  const required = new Set(manifest.tasks.flatMap(t => t.requiredEvidenceSlots));
  for (const option of context.options) {
    const present = unique(option.evidence, x => x.slotId, 'option evidence slot');
    requireCondition(option.evidence.every(e => slots.has(e.slotId)) && [...required].every(s => present.has(s)), 'EVIDENCE', 'Missing or unknown option evidence slot');
  }
  return context;
}

export function utilityBp(scale, value) {
  if (scale.kind === 'boolean') {
    requireCondition(typeof value === 'boolean', 'VALUE', 'Expected boolean');
    return value ? 10000 : 0;
  }
  if (scale.kind === 'categorical') {
    const level = scale.levels.find(l => l.id === value);
    requireCondition(level, 'VALUE', 'Unknown categorical level');
    return level.utilityBp;
  }
  requireCondition(typeof value === 'number' && Number.isSafeInteger(value) && value >= scale.minimum && value <= scale.maximum, 'VALUE', 'Numeric value outside declared utility anchors');
  const distance = scale.direction === 'maximize' ? value - scale.minimum : scale.maximum - value;
  const range = BigInt(scale.maximum - scale.minimum);
  return Number((BigInt(distance) * 20000n + range) / (2n * range));
}

export async function validateAssessments(value, contextValue, manifestValue) {
  // Snapshot before asynchronous hashing so the caller cannot change validated inputs mid-flight.
  const context = structuredClone(validateContext(contextValue, manifestValue));
  const manifest = structuredClone(manifestValue);
  const set = structuredClone(validateShape('assessments', value));
  requireCondition(set.contextDigest === await digest(context), 'BINDING', 'Assessment context digest mismatch');
  const options = new Map(context.options.map(o => [o.id, o]));
  const tasks = new Map(manifest.tasks.map(t => [t.criterionId, t]));
  unique(set.assessments, a => `${a.optionId}/${a.criterionId}`, 'assessment cell');
  requireCondition(set.assessments.length === options.size * tasks.size, 'COVERAGE', 'Exactly one assessment per option and criterion is required');
  for (const a of set.assessments) {
    const task = tasks.get(a.criterionId), option = options.get(a.optionId);
    requireCondition(task && option, 'COVERAGE', 'Unknown option or criterion');
    requireCondition(canonicalJSON(a.evaluator) === canonicalJSON(task.evaluator), 'EVALUATOR', 'Evaluator identity, model, or transformation differs from manifest');
    unique(a.evidence, e => e.slotId, 'assessment evidence slot');
    requireCondition(a.evidence.length === task.requiredEvidenceSlots.length && task.requiredEvidenceSlots.every(s => a.evidence.some(e => e.slotId === s && option.evidence.some(o => o.slotId === s && o.digest === e.digest))), 'EVIDENCE', 'Assessment evidence differs from frozen work order');
    if (a.status !== 'ok') continue;
    unique(a.outcomes, o => o.id, 'outcome');
    requireCondition(a.outcomes.reduce((s,o) => s+o.massPpm,0) === 1000000, 'MASS', 'Outcome mass must sum to 1000000');
    for (const outcome of a.outcomes) utilityBp(task.scale, outcome.value);
    if (a.evaluator.kind === 'model') requireCondition(a.rawOutputDigest, 'PROVENANCE', 'Model assessments require a raw output digest');
    if (a.evaluator.kind === 'model' && a.calibration.status === 'validated') requireCondition(task.acceptedCalibrationDigests?.includes(a.calibration.reportDigest), 'CALIBRATION', 'Calibration report is not accepted by this kit criterion');
  }
  return set;
}
