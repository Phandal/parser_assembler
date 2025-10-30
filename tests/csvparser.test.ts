import { describe, it } from 'node:test';
import assert from 'node:assert';
import { csvParser } from '../src/parsers/csvparser';
import type { CSVParserConfig } from '../src/types';

const input = `Name,Age\nJack  ,14  \nMark ,15 \nSusan,56\n`;

describe('csvParser', () => {
  it('skipsLines', async () => {
    const config: CSVParserConfig = {
      kind: 'csv',
      skipLines: 2,
      delimiter: ',',
      trim: false,
      fields: [
        { name: 'name', index: 0 },
        { name: 'age', index: 1 }
      ]
    }

    const parser = csvParser(config);
    const results = await parser(input);
    assert.deepEqual(results, [{ name: 'Mark ', age: '15 ' }, { name: 'Susan', age: '56' }]);
  });

  it('trim', async () => {
    const config: CSVParserConfig = {
      kind: 'csv',
      skipLines: 1,
      delimiter: ',',
      trim: true,
      fields: [
        { name: 'name', index: 0 },
        { name: 'age', index: 1 }
      ]
    }

    const parser = csvParser(config);
    const results = await parser(input);
    assert.deepEqual(results, [{ name: 'Jack', age: '14' }, { name: 'Mark', age: '15' }, { name: 'Susan', age: '56' }]);
  });
});
