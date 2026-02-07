/**
 * Linear Scale
 *
 * Maps continuous numeric values to continuous output range.
 * Used for Y-axis values and numeric X-axis values.
 */

import type { LinearScaleConfig, LinearScale } from './types';

/**
 * Round a value to a "nice" number (1, 2, 5, 10, 20, 50, etc.)
 */
function niceNumber(value: number, round: boolean): number {
  const exponent = Math.floor(Math.log10(value));
  const fraction = value / Math.pow(10, exponent);

  let niceFraction: number;
  if (round) {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else {
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
  }

  return niceFraction * Math.pow(10, exponent);
}

/**
 * Compute nice domain extent
 */
function niceExtent(min: number, max: number, tickCount: number = 10): [number, number] {
  if (min === max) {
    // Handle single value
    return min === 0 ? [-1, 1] : [min * 0.9, min * 1.1];
  }

  const range = niceNumber(max - min, false);
  const step = niceNumber(range / (tickCount - 1), true);
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;

  return [niceMin, niceMax];
}

/**
 * Generate evenly spaced tick values
 */
function generateTicks(min: number, max: number, count: number = 10): number[] {
  if (min === max) return [min];

  const range = max - min;
  const step = niceNumber(range / (count - 1), true);
  const niceMin = Math.ceil(min / step) * step;
  const niceMax = Math.floor(max / step) * step;

  const ticks: number[] = [];
  for (let value = niceMin; value <= niceMax + step * 0.5; value += step) {
    // Round to avoid floating point issues
    const rounded = Math.round(value * 1e12) / 1e12;
    ticks.push(rounded);
  }

  return ticks;
}

/**
 * Create a linear scale
 *
 * @example
 * ```ts
 * const yScale = createLinearScale({
 *   domain: [0, 100],
 *   range: [300, 0], // Inverted for SVG coordinate system
 *   nice: true,
 * });
 *
 * yScale(50); // Returns 150 (middle of range)
 * yScale.invert(150); // Returns 50
 * yScale.ticks(5); // Returns [0, 25, 50, 75, 100]
 * ```
 */
export function createLinearScale(config: LinearScaleConfig): LinearScale {
  const { nice = false, clamp = false } = config;

  // Apply nice rounding if requested
  const [d0, d1] = nice ? niceExtent(config.domain[0], config.domain[1]) : config.domain;
  const [r0, r1] = config.range;

  const domainSpan = d1 - d0;
  const rangeSpan = r1 - r0;

  // Avoid division by zero
  const ratio = domainSpan === 0 ? 0 : rangeSpan / domainSpan;

  // The scale function
  const scale = ((value: number): number => {
    let result = r0 + (value - d0) * ratio;

    if (clamp) {
      const minRange = Math.min(r0, r1);
      const maxRange = Math.max(r0, r1);
      result = Math.max(minRange, Math.min(maxRange, result));
    }

    return result;
  }) as LinearScale;

  // Invert function (range -> domain)
  scale.invert = (value: number): number => {
    if (ratio === 0) return d0;
    return d0 + (value - r0) / ratio;
  };

  // Getters
  scale.domain = (): [number, number] => [d0, d1];
  scale.range = (): [number, number] => [r0, r1];

  // Generate ticks
  scale.ticks = (count: number = 10): number[] => {
    return generateTicks(d0, d1, count);
  };

  // Copy with same config
  scale.copy = (): LinearScale => {
    return createLinearScale({ domain: [d0, d1], range: [r0, r1], nice, clamp });
  };

  return scale;
}

/**
 * Compute the extent (min/max) of an array of numbers
 */
export function extent(values: number[]): [number, number] {
  if (values.length === 0) return [0, 0];

  let min = Infinity;
  let max = -Infinity;

  for (const value of values) {
    if (value < min) min = value;
    if (value > max) max = value;
  }

  return [min, max];
}

/**
 * Compute extent with optional padding
 */
export function extentWithPadding(
  values: number[],
  padding: number = 0.1
): [number, number] {
  const [min, max] = extent(values);
  const range = max - min;
  const pad = range * padding;

  return [min - pad, max + pad];
}
