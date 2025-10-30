import { describe, it } from 'node:test';
import assert from 'node:assert';

import { createParser } from '../src/parsers/parserfactory.ts';
import type { CSVParserConfig } from '../src/types.ts';

describe('parserFactory', () => {
  it('createParser::fail', () => {
    assert.throws(() => createParser({ kind: 'unknown' } as unknown as CSVParserConfig));
  });

  it('createParser::csv', () => {
    const csvConfig: CSVParserConfig = {
      kind: 'csv',
      skipLines: 0,
      delimiter: ',',
      trim: false,
      fields: [],
    };

    const parser = createParser(csvConfig);
    assert(typeof parser === 'function');
  });
});
