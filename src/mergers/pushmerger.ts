import type { ApplicatorResult, Merger, Rule, PushMerge, Member } from '../types';

export function isPushMerge(mergeInto: Rule['mergeInto']): mergeInto is PushMerge {
  return (mergeInto.operation === 'push');
}

export function push(mergeInto: PushMerge): Merger {
  return (member: Member, result: ApplicatorResult): Member => {
    let current: any = member;
    for (const path of mergeInto.path.split('.')) {
      if (current === undefined) {
        throw new Error(`could not find path in member '${mergeInto.path}'`);
      }
      current = current[path];
    }

    if (!Array.isArray(current)) {
      throw new Error(`can not push to non array member property '${mergeInto.path}'`);
    }

    if (Array.isArray(result)) {
      current.push(...result);
    } else {
      current.push(result);
    }
    return member;
  }
}

