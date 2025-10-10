export type Config = {
  parser: ParserConfig;
  assembler: AssemblerConfig;
}

export type MergeStrategy = 'first' | 'last' | 'list' | 'sum' | MergeObjectStrategy;

export type MergeObjectStrategy = {
  fields: MergeStrategy;
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

export type Parser = (filepath: string) => Promise<Record<string, string>[]>;

export type Transformer = (record: Record<string, string>) => Record<string, string>;
