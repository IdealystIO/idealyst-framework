/**
 * Linear Scale
 *
 * Maps continuous numeric values to continuous output range.
 * Backed by d3-scale's scaleLinear.
 */

import { scaleLinear } from 'd3-scale';
import { extent as d3Extent } from 'd3-array';
import type { LinearScaleConfig, LinearScale } from './types';

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

  const scale = scaleLinear()
    .domain(config.domain)
    .range(config.range)
    .clamp(clamp);

  if (nice) scale.nice();

  return scale;
}

/**
 * Compute the extent (min/max) of an array of numbers
 */
export function extent(values: number[]): [number, number] {
  const result = d3Extent(values);
  return [result[0] ?? 0, result[1] ?? 0];
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
