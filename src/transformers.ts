import * as registry from './registry';
import { AssemblerConfig, TransformStrategy, Transformer } from './types';

export function applyTransform(data: string, strategy: TransformStrategy): string {
  switch (strategy) {
    case 'upcase':
      return registry.upcase(data);
    case 'downcase':
      return registry.downcase(data);
  }
}

export function transformerFactory(transforms: AssemblerConfig['transforms']): Transformer {
  return (record: Record<string, string>): Record<string, string> => {
    const transformed = structuredClone(record);

    for (const [field, transformStrategy] of Object.entries(transforms)) {
      transformed[field] = applyTransform(transformed[field], transformStrategy)
    }

    return transformed;
  }
}
