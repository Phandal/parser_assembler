import { AssemblerConfig, MergeStrategy } from "./types";
import { transformerFactory } from "./transformers";

export function assemble(config: AssemblerConfig, records: Record<string, string>[]): MergedRecord[] {
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

export function groupBy(key: string, records: Record<string, string>[]): Record<string, Record<string, string>[]> {
  const grouped: Record<string, Record<string, string>[]> = {};

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

type MergedRecord = { [key: string]: string | string[] | MergedRecord };

export function merge(records: Record<string, string>[], mergers: Record<string, MergeStrategy>): MergedRecord {
  const merged: MergedRecord = {};
  for (const [field, mergeStrategy] of Object.entries(mergers)) {
    if (typeof mergeStrategy === 'string') {
      const values = records.map(record => record[field]).filter(r => r !== "");

      switch (mergeStrategy) {
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
          merged[field] = values.reduce((acc, val) => { return acc += Number(val) ?? 0 }, 0).toString();
      }
    } else {
      merged[field] = merge(records, mergeStrategy);
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
