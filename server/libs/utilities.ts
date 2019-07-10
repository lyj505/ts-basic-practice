import db from './db';
import { closeLoggers } from './logger';

/**
 * Filter an array so that values are not null or undefined:
 * From https://stackoverflow.com/questions/43118692/typescript-filter-out-nulls-from-an-array
 */
export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null && value !== undefined;
}

/** Close all handles that might prevent our process from ending */
export function closeHandles() {
  db.close();
  closeLoggers();
}

/** Return a promise that resolves after a certain number of milliseconds */
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
