import { csvParser } from './csvparser.ts';
import type { ParserConfig, Parser } from '../types.ts';

export function createParser(config: ParserConfig): Parser {
  switch (config.kind) {
    case 'csv':
      return csvParser(config);
    default:
      throw new Error('Unsupported parser type: ' + config.kind);
  }
}
