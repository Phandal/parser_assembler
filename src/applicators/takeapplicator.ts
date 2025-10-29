import assert from 'node:assert';
import type { Rule, TakeRule, Applicator, ApplicatorResult, ParsedRecord } from '../types';

export function isTakeRule(rule: Rule): rule is TakeRule {
  return 'take' in rule;
}

export function take(rule: TakeRule): Applicator {
  return (records: ParsedRecord[]): ApplicatorResult => {
    assert(records.length !== 0);

    switch (rule.take.sequence) {
      case 'first':
        return records[0][rule.mergeInto.output];
      case 'last':
        return records[records.length - 1][rule.mergeInto.output];
    }
  }
}


