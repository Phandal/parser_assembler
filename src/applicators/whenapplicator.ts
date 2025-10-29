import type { HardCoded, Rule, WhenRule, Applicator, ApplicatorResult, ParsedRecord } from '../types';

export function isWhenRule(rule: Rule): rule is WhenRule {
  return 'when' in rule;
}

export function when(rule: WhenRule): Applicator {
  return (records: ParsedRecord[]): ApplicatorResult => {
    const applicator = createWhenApplicator(rule)
    return applicator(records);
  }
}

export function createWhenApplicator(rule: WhenRule): Applicator {
  if (isStringMapper(rule.mergeInto.output)) {
    return stringMapper(rule.when, rule.mergeInto.output);
  } else if (isObjectMapper(rule.mergeInto.output)) {
    return objectMapper(rule.when, rule.mergeInto.output)
  }

  throw new Error(`Unknown merge output format: ${JSON.stringify(rule.mergeInto)}`);
}

export function isStringMapper(output: Rule['mergeInto']['output']): output is string {
  return typeof output === 'string';
}

export function isObjectMapper(output: Rule['mergeInto']['output']): output is Record<string, string | HardCoded> {
  return typeof output === 'object';
}

export function evaluateWhen(when: WhenRule['when'], record: ParsedRecord): boolean {
  const value = record[when.field];
  return (value === when.equals);
}

export function stringMapper(when: WhenRule['when'], output: string): Applicator {
  return (records: ParsedRecord[]): ApplicatorResult => {
    let result = null;
    for (const record of records) {
      if (evaluateWhen(when, record)) {
        result = record[output];
      }
    }
    return result;
  }
}

export function objectMapper(when: WhenRule['when'], output: Record<string, string | HardCoded>): Applicator {
  return (records: ParsedRecord[]): ApplicatorResult => {
    const results: Record<string, string>[] = [];
    for (const record of records) {
      if (evaluateWhen(when, record)) {
        const result: Record<string, string> = {};
        for (const [key, value] of Object.entries(output)) {
          if (typeof value === 'object') {
            result[key] = value._value;
          } else {
            result[key] = record[value]
          }
          results.push(result);
        }
      }
    }
    if (results.length !== 0) {
      return results;
    }
    return null;
  }
}

