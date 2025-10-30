export type ApplicatorResult = string | Record<string, string>[] | null;

export type Applicator = (records: ParsedRecord[]) => ApplicatorResult;

export type Merger = (member: Member, result: ApplicatorResult) => Member;

export type Config = {
  parser: ParserConfig;
  assembler: AssemblerConfig;
}

export type Member = {
  ssn: string;
  effectiveDate: string;
  demographic: Demographic;
  deferrals: Deferral[];
}

export type Demographic = {
  addr1?: string;
  addr2?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export type Deferral = {
  kind: '401K' | 'ROTH' | 'LOAN';
  amount: string;
  percent: string;
}

export type ParsedRecord = { [name: string]: string };

export type Parser = (input: string) => Promise<ParsedRecord[]>;

export type ParserConfig = CSVParserConfig;

export type CSVParserConfig = {
  kind: 'csv';
  delimiter: string;
  skipLines: number;
  trim: boolean;
  fields: Array<{ name: string, index: number }>;
}

export type AssemblerConfig = {
  groupBy: string;
  rules: Rule[];
}

export type Rule = TakeRule | WhenRule;

export type TakeRule = {
  take: TakeRuleOptions;
  mergeInto: (SetMerge);
}

export type TakeRuleOptions = {
  sequence: 'first' | 'last';
}

export type WhenRule = {
  when: WhenRuleOptions;
  mergeInto: (PushMerge | SetMerge);
}

export type WhenRuleOptions = WhenRuleNotEqualOptions | WhenRuleEqualOptions;

export type WhenRuleNotEqualOptions = {
  field: string;
  notequals: string | HardCoded
}

export type WhenRuleEqualOptions = {
  field: string;
  equals: string | HardCoded
}

export type HardCoded = { _value: string };

export type PushMergeOutput = string | Record<string, string | HardCoded>;

export type PushMerge = {
  path: string;
  operation: 'push';
  output: PushMergeOutput;
}

export type SetMerge = {
  path: string;
  operation: 'set';
  output: string;
}

// export type ParsedRecord = { [key: string]: string };

// export type MergedRecord = { [key: string]: string | string[] | MergedRecord[] };

// export type Config = {
//   /** configuration for the parsing stage */
//   parser: ParserConfig;
//   /** configuration for the assembling stage */
//   assembler: AssemblerConfig;
// }

// export type MergeStrategy = 'first' | 'last' | 'list' | 'sum' | ObjectMergeStrategy;

// export type ObjectMergeStrategy = ObjectListMergeStrategy | ColumnPivotMergeStrategy

// export type ObjectListMergeStrategy = {
//   kind: 'object-list';
//   /** allows for a map of keys to values for any field */
//   valueMap: { [field: string]: { [key: string]: string } };
//   output: {
//     /** the field in the parsed member that corresponds to the `type` of change */
//     key: string;
//     /** the name of the property that key should be attached to */
//     keyName: string;
//     /** the field in the parsed member that corresponds to the `value` of a change */
//     value: string;
//     /** the name of the property that value should be attached to */
//     valueName: string;
//   }
// }

// export type ColumnPivotMergeStrategy = {
//   kind: 'column-pivot';
//   /** the list of fields that should generate an entry in the object list */
//   fields: string[];
//   output: {
//     /** the name of the property that the field from the field array should get attached to */
//     keyName: string;
//     /** the name of the property that the value from the field array shoudl get attached to */
//     valueName: string;
//   }
// }

// export type TransformStrategy = 'downcase' | 'upcase';

// export type AssemblerConfig = {
//   groupBy: string;
//   mergeStrategy: Record<string, MergeStrategy>;
//   transforms: Record<string, TransformStrategy>;
//   outputMapping: Record<string, string>;
// }

// export type ParserConfig = CSVParserConfig;

// export type CSVParserConfig = {
//   type: 'csv';
//   delimiter: string;
//   skipLines: number;
//   trim: boolean;
//   fields: { name: string, index: number }[];
// }

// export type Parser = (filepath: string) => Promise<ParsedRecord[]>;

// export type Transformer = (record: ParsedRecord) => ParsedRecord;
