import { AssemblerConfig, MergeStrategy, MergedRecord, ParsedRecord } from "./types";
import { transformerFactory } from "./transformers";

export function assemble(config: AssemblerConfig, records: ParsedRecord[]): MergedRecord[] {
  const assembled: MergedRecord[] = [];

  const transformer = transformerFactory(config.transforms);
  const transformed = records.map(transformer);

  const grouped = groupBy(config.groupBy, transformed);

  for (const [groupKey, groupedRecords] of Object.entries(grouped)) {
    const merged = merge(groupedRecords, config.mergeStrategy);
    merged[config.groupBy] = groupKey;

    const mapped = mapOutput(merged, config.outputMapping);
    assembled.push(mapped);
  }

  return assembled;
}

export function groupBy(key: string, records: ParsedRecord[]): Record<string, ParsedRecord[]> {
  const grouped: Record<string, ParsedRecord[]> = {};

  for (const record of records) {
    const keyValue = record[key];
    if (keyValue === "" || keyValue === undefined) continue;

    if (!grouped[keyValue]) {
      grouped[keyValue] = [record];
    } else {
      grouped[keyValue].push(record);
    }
  }

  return grouped;
}

export function merge(records: ParsedRecord[], mergers: Record<string, MergeStrategy>): MergedRecord {
  const merged: MergedRecord = {};

  for (const [field, strategy] of Object.entries(mergers)) {
    if (typeof strategy === 'string') {
      const values = records.map(r => r[field]).filter(v => v !== undefined && v !== "");

      switch (strategy) {
        case 'first':
          merged[field] = values[0];
          break;
        case 'last':
          merged[field] = values[values.length - 1];
          break;
        case 'list':
          merged[field] = values;
          break;
        case 'sum':
          merged[field] = values.reduce((acc, val) => acc + Number(val ?? 0), 0).toString();
          break;
      }
    } else {
      switch (strategy.kind) {
        case 'object-list':
          merged[field] = records.map((record) => {
            const obj: MergedRecord = {};
            let keyField = record[strategy.output.key];

            if (strategy.valueMap[strategy.output.key][keyField] !== undefined) {
              keyField = strategy.valueMap[strategy.output.key][keyField];
            }

            obj[keyField] = record[strategy.output.value];
            return obj;
          });
          break;
        case 'column-pivot':
          const results: MergedRecord[] = [];
          records.forEach((record) => {
            for (const field of strategy.fields) {
              const value = record[field];

              if (value !== "") {
                const obj: MergedRecord = {};
                obj[strategy.output.name] = field;
                obj[strategy.output.value] = value;
                results.push(obj);
              }
            }
          });
          merged[field] = results;
          break;
      }
    }
  }

  return merged;
}

export function mapOutput(record: MergedRecord, mapping: AssemblerConfig['outputMapping']): MergedRecord {
  const mapped: MergedRecord = {};

  for (const [target, source] of Object.entries(mapping)) {
    mapped[target] = <string>record[source];
  }

  return mapped;
}
