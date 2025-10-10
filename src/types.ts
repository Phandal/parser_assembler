export type ParsedRecord = { [key: string]: string };

export type MergedRecord = { [key: string]: string | string[] | MergedRecord[] };

export type Config = {
  parser: ParserConfig;
  assembler: AssemblerConfig;
}

export type MergeStrategy = 'first' | 'last' | 'list' | 'sum' | ObjectMergeStrategy;

export type ObjectMergeStrategy = ObjectListMergeStrategy | ColumnPivotMergeStrategy

export type ObjectListMergeStrategy = {
  kind: 'object-list';
  valueMap: { [field: string]: { [key: string]: string } };
  output: {
    key: string;
    value: string;
  }
}

export type ColumnPivotMergeStrategy = {
  kind: 'column-pivot';
  fields: string[];
  output: {
    name: string;
    value: string;
  }
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
