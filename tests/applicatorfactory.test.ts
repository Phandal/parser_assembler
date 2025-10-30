import { describe, it } from 'node:test';
import assert from 'node:assert';

import { createApplicator } from '../src/applicators/applicatorfactory';
import type { Rule } from '../src/types';

describe('applicatorFactory', () => {
  it('createApplicator::fail', () => {
    assert.throws(() => createApplicator({} as Rule))
  });

  it('createApplicator::take', () => {
    const applicator = createApplicator({ take: {} } as Rule);
    assert(typeof applicator === 'function');
  });

  it('createApplicator::when', () => {
    const applicator = createApplicator({ when: {} } as Rule);
    assert(typeof applicator === 'function');
  });
});
