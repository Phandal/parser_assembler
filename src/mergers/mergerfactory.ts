import { isPushMerge, push } from './pushmerger';
import { isSetMerge, set } from './setmerger';
import type { Merger, Rule } from '../types';

export function createMerger(rule: Rule): Merger {
  if (isPushMerge(rule.mergeInto)) {
    return push(rule.mergeInto);
  }

  if (isSetMerge(rule.mergeInto)) {
    return set(rule.mergeInto);
  }

  throw new Error(`Unknown merge operation: ${JSON.stringify(rule.mergeInto)}`);
}

