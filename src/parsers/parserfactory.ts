import { ParserConfig, Parser } from '../types.ts';
import { csvParser } from './csvparser.ts';

export function createParser(config: ParserConfig): Parser {
  switch (config.kind) {
    case 'csv':
      return csvParser(config);
    default:
      throw new Error('Unsupported parser type: ' + config.kind);
  }
}
