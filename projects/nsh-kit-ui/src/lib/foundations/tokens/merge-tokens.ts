import type { DeepPartial } from './deep-partial';

export function mergeDeep<T>(base: T, overrides?: DeepPartial<T>): T {
  if (!overrides) {
    return base;
  }

  if (typeof base !== 'object' || base === null) {
    return base;
  }

  const result: any = Array.isArray(base) ? [...(base as any)] : { ...(base as any) };
  for (const [key, value] of Object.entries(overrides as any)) {
    if (value === undefined) {
      continue;
    }

    const current = (result as any)[key];
    if (typeof value === 'object' && value !== null && typeof current === 'object' && current !== null) {
      (result as any)[key] = mergeDeep(current, value);
    } else {
      (result as any)[key] = value;
    }
  }
  return result;
}
