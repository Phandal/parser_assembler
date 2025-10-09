export type ParserConfig = CSVParserConfig;

export type CSVParserConfig = {
  type: 'csv';
  delimiter: string;
  skipLines: number;
  trim_fields: boolean;
  fields: { name: string, index: number }[];
}
export type Parser = (filepath: string) => Promise<unknown[]>;

