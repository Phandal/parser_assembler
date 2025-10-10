export type ParsedRecord = { [key: string]: string };

export type MergedRecord = { [key: string]: string | string[] | MergedRecord[] };

export type Config = {
  parser: ParserConfig;
  assembler: AssemblerConfig;
}

export type MergeStrategy = 'first' | 'last' | 'list' | 'sum' | MergeObjectStrategy;

export type MergeObjectStrategy = {
  fields: string[];
}

export type TransformStrategy = 'downcase' | 'upcase';

export type AssemblerConfig = {
  groupBy: string;
  mergeStrategy: Record<string, MergeStrategy>;
  transforms: Record<string, TransformStrategy>;
  outputMapping: Record<string, string>;
}

export type ParserConfig = CSVParserConfig;

export type CSVParserConfig = {
  type: 'csv';
  delimiter: string;
  skipLines: number;
  trim: boolean;
  fields: { name: string, index: number }[];
}

export type Parser = (filepath: string) => Promise<ParsedRecord[]>;

export type Transformer = (record: ParsedRecord) => ParsedRecord;
