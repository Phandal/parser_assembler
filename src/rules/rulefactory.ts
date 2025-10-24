import type { Applicator, Merger, Option, PushMerge, Rule, SetMerge, TakeRule, WhenRule } from '../types';

const Unimplemented = new Error('not implemented yet');

export function createApplicator(rule: Rule): Option<Applicator> {
  if (rule.take !== undefined) {
    return take(rule);
  }

  if (rule.when !== undefined) {
    return when(rule);
  }

  throw new Error(`Unknown rule: ${JSON.stringify(rule)}`);
}

export function take(rule: TakeRule): Option<Applicator> {
  throw Unimplemented;
}

export function when(rule: WhenRule): Option<Applicator> {
  throw Unimplemented;
}


export function createMerger(rule: Rule): Merger {
  if (rule.mergeInto.operation === 'push') {
    return push(rule.mergeInto);
  }

  if (rule.mergeInto.operation === 'set') {
    return set(rule.mergeInto);
  }

  throw new Error(`Unknown merge operation: ${JSON.stringify(rule.mergeInto)}`);
}

export function push(mergeInto: PushMerge): Merger {
  throw Unimplemented;
}

export function set(mergeInto: SetMerge): Merger {
  throw Unimplemented;
}
