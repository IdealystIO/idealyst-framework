/**
 * Tests for getAllXValues domain-building logic.
 *
 * Verifies that the categorical x-axis domain is sorted in a natural order:
 * - Date-like strings are sorted chronologically
 * - Numeric values are sorted numerically
 * - Date objects are sorted chronologically
 * - Non-date strings are sorted lexicographically
 */

import { getAllXValues } from '../src/core/domain';
import type { DomainDataSeries } from '../src/core/domain';

function makeSeries(id: string, xValues: (string | number | Date)[]): DomainDataSeries {
  return {
    data: xValues.map((x, i) => ({ x, y: i * 10 })),
  };
}

describe('getAllXValues', () => {
  it('returns an empty array for empty input', () => {
    expect(getAllXValues([])).toEqual([]);
  });

  it('returns a single value for single-point data', () => {
    const result = getAllXValues([makeSeries('a', ['Jun 18'])]);
    expect(result).toEqual(['Jun 18']);
  });

  it('deduplicates x values across multiple series', () => {
    const series1 = makeSeries('a', ['Jun 18', 'Jun 19']);
    const series2 = makeSeries('b', ['Jun 19', 'Jun 20']);
    const result = getAllXValues([series1, series2]);
    expect(result).toHaveLength(3);
  });

  it('sorts date-like string values chronologically', () => {
    // Series with different coverage ranges: this used to produce
    // an insertion-order array like ['Jun 24', 'Jul 2', 'Jun 18', 'Jun 23']
    const series1 = makeSeries('a', ['Jun 24, 2024', 'Jul 2, 2024']);
    const series2 = makeSeries('b', ['Jun 18, 2024', 'Jun 23, 2024']);
    const result = getAllXValues([series1, series2]);
    expect(result).toEqual(['Jun 18, 2024', 'Jun 23, 2024', 'Jun 24, 2024', 'Jul 2, 2024']);
  });

  it('sorts ISO date strings chronologically', () => {
    const series1 = makeSeries('a', ['2024-07-02', '2024-06-24']);
    const series2 = makeSeries('b', ['2024-06-18', '2024-06-23']);
    const result = getAllXValues([series1, series2]);
    expect(result).toEqual(['2024-06-18', '2024-06-23', '2024-06-24', '2024-07-02']);
  });

  it('sorts Date objects chronologically', () => {
    const d1 = new Date('2024-07-02');
    const d2 = new Date('2024-06-18');
    const d3 = new Date('2024-06-24');
    const result = getAllXValues([
      makeSeries('a', [d1, d3]),
      makeSeries('b', [d2]),
    ]);
    expect(result).toEqual([d2, d3, d1]);
  });

  it('sorts numeric values numerically', () => {
    const series1 = makeSeries('a', [30, 10]);
    const series2 = makeSeries('b', [20, 40]);
    const result = getAllXValues([series1, series2]);
    expect(result).toEqual([10, 20, 30, 40]);
  });

  it('sorts non-date strings lexicographically', () => {
    const series1 = makeSeries('a', ['banana', 'apple']);
    const series2 = makeSeries('b', ['cherry', 'date']);
    const result = getAllXValues([series1, series2]);
    expect(result).toEqual(['apple', 'banana', 'cherry', 'date']);
  });

  it('handles mixed date-like series with partial overlap', () => {
    // Simulating the exact bug scenario: series A has later dates,
    // series B has earlier dates. Result should be chronological.
    const seriesA = makeSeries('a', ['Mar 10, 2025', 'Mar 17, 2025', 'Mar 24, 2025']);
    const seriesB = makeSeries('b', ['Mar 3, 2025', 'Mar 10, 2025', 'Mar 17, 2025']);
    const result = getAllXValues([seriesA, seriesB]);
    expect(result).toEqual([
      'Mar 3, 2025',
      'Mar 10, 2025',
      'Mar 17, 2025',
      'Mar 24, 2025',
    ]);
  });
});
