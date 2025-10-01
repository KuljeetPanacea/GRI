// utils/debounce.ts
import { debounce } from 'lodash';

export const createDebounce = <T extends (...args: unknown[]) => void>(
  callback: T,
  delay = 1000
): ((...args: Parameters<T>) => void) => {
  return debounce(callback, delay);
};
