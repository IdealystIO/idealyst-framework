/**
 * Tests for autoSkipBandLabels and estimateLabelWidth.
 *
 * Verifies that the label-skipping logic:
 * 1. Returns all labels when they fit without overlap
 * 2. Steps through labels at regular intervals
 * 3. Always includes the first and last label
 * 4. Does NOT produce collisions when force-including the final label
 */

import { autoSkipBandLabels, estimateLabelWidth } from '../src/core/labelSkip';

const identity = (v: number | string | Date) => String(v);

describe('estimateLabelWidth', () => {
  it('estimates width proportional to character count and font size', () => {
    expect(estimateLabelWidth('abc', 10)).toBeCloseTo(18); // 3 * 10 * 0.6
    expect(estimateLabelWidth('abcdef', 12)).toBeCloseTo(43.2); // 6 * 12 * 0.6
  });
});

describe('autoSkipBandLabels', () => {
  it('returns all labels when they fit', () => {
    const domain = ['A', 'B', 'C'];
    // 3 labels, each ~1 char wide at fontSize 10 = 6px each.
    // axisLength = 500, so plenty of room.
    const result = autoSkipBandLabels(domain, 500, 10, identity);
    expect(result).toEqual(['A', 'B', 'C']);
  });

  it('returns single-element domains unchanged', () => {
    expect(autoSkipBandLabels(['X'], 100, 10, identity)).toEqual(['X']);
  });

  it('returns empty domains unchanged', () => {
    expect(autoSkipBandLabels([], 100, 10, identity)).toEqual([]);
  });

  it('includes first and last labels when stepping', () => {
    // Create a domain large enough that stepping kicks in
    const domain = Array.from({ length: 20 }, (_, i) => `Label ${i}`);
    // Each label is ~7 chars, at fontSize 10 => ~42px wide.
    // axisLength = 200, so only ~4 labels fit (200 / (42 + 8) = 4).
    const result = autoSkipBandLabels(domain, 200, 10, identity);
    expect(result[0]).toBe('Label 0');
    expect(result[result.length - 1]).toBe('Label 19');
  });

  it('does not produce a collision when appending the final label', () => {
    // Construct a scenario where the last stepped label is close to the
    // final domain entry, which would cause a collision in the old code.
    // 10 labels at fontSize 11, narrow axis of 150px.
    const domain = Array.from({ length: 10 }, (_, i) => `Item ${i}`);
    const fontSize = 11;
    const result = autoSkipBandLabels(domain, 150, fontSize, identity);

    // Verify no two adjacent labels in the result would collide.
    // For each adjacent pair, compute their index positions in the domain
    // and check the gap is sufficient.
    const bandWidth = 150 / domain.length;
    for (let i = 0; i < result.length - 1; i++) {
      const idxA = domain.indexOf(result[i] as string);
      const idxB = domain.indexOf(result[i + 1] as string);
      const gap = (idxB - idxA) * bandWidth;
      const labelWidth = estimateLabelWidth(identity(result[i]), fontSize);
      // Gap must be at least as large as the label width
      expect(gap).toBeGreaterThanOrEqual(labelWidth);
    }
  });

  it('replaces the last stepped label when the final label would collide', () => {
    // 7 labels, fontSize 12, axisLength 150 => stepping required
    const domain = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const result = autoSkipBandLabels(domain, 150, 12, identity);
    // The last element must always be 'Sun'
    expect(result[result.length - 1]).toBe('Sun');
    // And there should be no duplicate of the replaced label
    const counts = new Map<string, number>();
    for (const v of result) {
      const key = String(v);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    for (const [, count] of counts) {
      expect(count).toBe(1);
    }
  });

  it('preserves stepped labels when final label does not collide', () => {
    // Large enough axis that final label can be appended without collision
    const domain = Array.from({ length: 10 }, (_, i) => `V${i}`);
    // Each label is ~2 chars at fontSize 10 => 12px. axisLength=300 => step ~1-2
    const result = autoSkipBandLabels(domain, 300, 10, identity);
    expect(result[0]).toBe('V0');
    expect(result[result.length - 1]).toBe('V9');
    // All results should be unique
    expect(new Set(result.map(String)).size).toBe(result.length);
  });
});
