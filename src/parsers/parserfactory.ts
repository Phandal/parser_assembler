import { ParserConfig, Parser } from '../types';
import { csvParser } from './csvparser';

export function createParser(config: ParserConfig): Parser {
  switch (config.type) {
    case 'csv':
      return csvParser(config);
    default:
      throw new Error('Unsupported parser type: ' + config.type);
  }
}
