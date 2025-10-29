import { isTakeRule, take } from './takeapplicator';
import { isWhenRule, when } from './whenapplicator';
import type { Applicator, Rule } from '../types';

export function createApplicator(rule: Rule): Applicator {
  if (isTakeRule(rule)) {
    return take(rule);
  } else if (isWhenRule(rule)) {
    return when(rule);
  }

  throw new Error(`Unknown rule: ${JSON.stringify(rule)}`);
}

