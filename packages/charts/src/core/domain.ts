/**
 * Domain utilities for chart x-axis values.
 *
 * Pure functions for collecting, deduplicating, and sorting categorical
 * domain values across multiple data series.
 */

/**
 * A minimal data-point shape used by domain utilities.
 */
export interface DomainDataPoint {
  x: number | string | Date;
}

/**
 * A minimal series shape used by domain utilities.
 */
export interface DomainDataSeries {
  data: DomainDataPoint[];
}

/**
 * Try to parse a string as a date.
 * Returns a finite timestamp on success, or NaN on failure.
 */
function tryParseDate(value: string): number {
  const ts = Date.parse(value);
  return Number.isFinite(ts) ? ts : NaN;
}

/**
 * Collect all unique X values across all series, sorted in a natural order.
 *
 * - Numeric values are sorted numerically.
 * - Date values are sorted chronologically.
 * - String values are sorted chronologically if they all parse as dates,
 *   otherwise lexicographically.
 */
export function getAllXValues(data: DomainDataSeries[]): (number | string | Date)[] {
  const values: (number | string | Date)[] = [];
  const seen = new Set<string>();

  for (const series of data) {
    for (const point of series.data) {
      const key = String(point.x);
      if (!seen.has(key)) {
        seen.add(key);
        values.push(point.x);
      }
    }
  }

  if (values.length <= 1) return values;

  // Determine the dominant type for sorting
  const first = values[0];

  if (first instanceof Date) {
    // Date values: sort chronologically
    return values.sort((a, b) => {
      const ta = a instanceof Date ? a.getTime() : 0;
      const tb = b instanceof Date ? b.getTime() : 0;
      return ta - tb;
    });
  }

  if (typeof first === 'number') {
    // Numeric values: sort numerically
    return values.sort((a, b) => Number(a) - Number(b));
  }

  // String values: attempt chronological sort if all values parse as dates
  const timestamps = values.map((v) => tryParseDate(String(v)));
  const allParseable = timestamps.every((ts) => !Number.isNaN(ts));

  if (allParseable) {
    // Sort by parsed date timestamp
    const indexed = values.map((v, i) => ({ v, ts: timestamps[i] }));
    indexed.sort((a, b) => a.ts - b.ts);
    return indexed.map((item) => item.v);
  }

  // Fallback: lexicographic sort
  return values.sort((a, b) => String(a).localeCompare(String(b)));
}
