export type ParsedRecord = { [key: string]: string };

export type MergedRecord = { [key: string]: string | string[] | MergedRecord[] };

export type Config = {
  /** configuration for the parsing stage */
  parser: ParserConfig;
  /** configuration for the assembling stage */
  assembler: AssemblerConfig;
}

export type MergeStrategy = 'first' | 'last' | 'list' | 'sum' | ObjectMergeStrategy;

export type ObjectMergeStrategy = ObjectListMergeStrategy | ColumnPivotMergeStrategy

export type ObjectListMergeStrategy = {
  kind: 'object-list';
  /** allows for a map of keys to values for any field */
  valueMap: { [field: string]: { [key: string]: string } };
  output: {
    /** the field in the parsed member that corresponds to the `type` of change */
    key: string;
    /** the name of the property that key should be attached to */
    keyName: string;
    /** the field in the parsed member that corresponds to the `value` of a change */
    value: string;
    /** the name of the property that value should be attached to */
    valueName: string;
  }
}

export type ColumnPivotMergeStrategy = {
  kind: 'column-pivot';
  /** the list of fields that should generate an entry in the object list */
  fields: string[];
  output: {
    /** the name of the property that the field from the field array should get attached to */
    keyName: string;
    /** the name of the property that the value from the field array shoudl get attached to */
    valueName: string;
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
