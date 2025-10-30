import type { Rule, TakeRule, Applicator, ApplicatorResult, ParsedRecord } from '../types';

export function isTakeRule(rule: Rule): rule is TakeRule {
  return 'take' in rule;
}

export function take(rule: TakeRule): Applicator {
  return (records: ParsedRecord[]): ApplicatorResult => {
    switch (rule.take.sequence) {
      case 'first':
        break;
      case 'last':
        records = records.reverse();
        break;
    }

    for (const record of records) {
      const value = record[rule.mergeInto.output];
      if (value !== undefined && value !== '') {
        return value;
      }
    }

    return null;
  }
}


