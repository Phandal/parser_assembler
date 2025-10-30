import type { ApplicatorResult, Merger, Rule, PushMerge, Member } from '../types';

export function isPushMerge(mergeInto: Rule['mergeInto']): mergeInto is PushMerge {
  return (mergeInto.operation === 'push');
}

export function push(mergeInto: PushMerge): Merger {
  return (member: Member, result: ApplicatorResult): Member => {
    let current: any = member;
    const pathParts = mergeInto.path.split('.');

    for (let i = 0; i < pathParts.length - 1; ++i) {
      if (current === undefined) {
        throw new Error(`could not find path in member '${mergeInto.path}'`);
      }
      current = current[pathParts[i]];
    }

    if (current === undefined) {
      throw new Error(`could not find path in member '${mergeInto.path}'`);
    }

    if (!Array.isArray(current[pathParts[pathParts.length - 1]])) {
      throw new Error(`can not push to non array member property '${mergeInto.path}'`);
    }

    if (Array.isArray(result)) {
      current[pathParts[pathParts.length - 1]].push(...result);
    } else {
      current[pathParts[pathParts.length - 1]].push(result);
    }
    return member;
  }
}

