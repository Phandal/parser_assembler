import { AssemblerConfig } from "./types";

export function assemble(config: AssemblerConfig, records: Record<string, string>[]): Record<string, string | Record<string, string>[]>[] {
  const assembled = [];
  const grouped = groupBy(config.groupBy, records);

  for (const [groupKey, groupedRecords] of Object.entries(grouped)) {
    const merged: Record<string, string | string[]> = {};

    for (const [field, mergeStrategy] of Object.entries(config.mergeStrategy)) {
      const values = groupedRecords.map(record => record[field]).filter(r => r !== "");

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
      }
    }

    merged[config.groupBy] = groupKey;

    const transformed = transform(merged, config.transforms);

    const mapped = mapOutput(transformed, config.outputMapping);
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

export function transform(record: Record<string, string | string[]>, transforms: AssemblerConfig['transforms']): Record<string, string | string[]> {
  const transformed = structuredClone(record);
  for (const [field, transformStrategy] of Object.entries(transforms)) {
    switch (transformStrategy) {
      case 'upcase':
        transformed[field] = Array.isArray(transformed[field]) ? transformed[field].map(val => val?.toUpperCase()) : transformed[field]?.toUpperCase();
        break;
      case 'sum':
        if (Array.isArray(transformed[field])) {
          transformed[field] = transformed[field].reduce((total, val) => total += Number(val), 0).toString();
        }
    }
  }

  return transformed;
}

export function mapOutput(record: Record<string, string | string[]>, mapping: AssemblerConfig['outputMapping']): Record<string, string | Record<string, string>[]> {
  const mapped: Record<string, string | Record<string, string>[]> = {};

  for (const [target, source] of Object.entries(mapping)) {
    if (Array.isArray(source)) {
      mapped[target] = source.map((item) => {
        const obj: Record<string, string> = {};
        for (const [k, v] of Object.entries(item)) {
          obj[k] = <string>record[v];
        }
        return obj
      });
    } else {
      mapped[target] = <string>record[source];
    }
  }

  return mapped;
}
