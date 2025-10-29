import Papa from 'papaparse';
import type { Parser, CSVParserConfig, ParsedRecord } from '../types';

export function csvParser(config: CSVParserConfig): Parser {
  return async (input: string): Promise<ParsedRecord[]> => {
    const results = Papa.parse<string[]>(input, { delimiter: config.delimiter, skipFirstNLines: config.skipLines, header: false, skipEmptyLines: true, });

    if (results.errors.length !== 0) {
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
