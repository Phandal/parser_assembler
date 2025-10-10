import { Parser, CSVParserConfig } from '../types';
import * as fs from 'node:fs/promises';
import Papa from 'papaparse';

export function csvParser(config: CSVParserConfig): Parser {
  return async (path: string): Promise<Record<string, string>[]> => {
    const input = await fs.readFile(path, 'utf8');
    const results = Papa.parse<string[]>(input, { delimiter: config.delimiter, skipFirstNLines: config.skipLines, });

    if (results.errors.length) {
      console.error(results.errors);
      throw new Error('Failed to parse csv file.');
    }

    return results.data.map((result) => {
      const record: Record<string, string> = {};
      for (const field of config.fields) {
        let data = result[field.index];

        if (config.trim) {
          data = data?.trim();
        }

        record[field.name] = data ?? '';
      }
      return record;
    });
  }
}
