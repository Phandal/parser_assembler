import type { ApplicatorResult, Merger, Rule, SetMerge, Member } from '../types';

export function isSetMerge(mergeInto: Rule['mergeInto']): mergeInto is SetMerge {
  return (mergeInto.operation === 'set');
}

export function set(mergeInto: SetMerge): Merger {
  return (member: Member, result: ApplicatorResult): Member => {
    let current: any = member;
    for (const path of mergeInto.path.split('.')) {
      if (current === undefined) {
        throw new Error(`could not find path in member '${mergeInto.path}'`);
      }
      current = current[path];
    }

    current = result;
    return member;
  }
}
