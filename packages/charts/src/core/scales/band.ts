/**
 * Band Scale
 *
 * Maps discrete categorical values to continuous bands.
 * Backed by d3-scale's scaleBand.
 */

import { scaleBand } from 'd3-scale';
import type { BandScaleConfig, BandScale } from './types';

/**
 * Create a band scale
 *
 * @example
 * ```ts
 * const xScale = createBandScale({
 *   domain: ['Jan', 'Feb', 'Mar', 'Apr'],
 *   range: [0, 400],
 *   padding: 0.2,
 * });
 *
 * xScale('Jan'); // Returns 20 (start of first band)
 * xScale.bandwidth(); // Returns 80 (width of each band)
 * xScale.step(); // Returns 100 (band + padding)
 * ```
 */
export function createBandScale(config: BandScaleConfig): BandScale {
  const {
    domain,
    range,
    padding = 0,
    paddingInner = padding,
    paddingOuter = padding,
    align = 0.5,
  } = config;

  return scaleBand<string>()
    .domain(domain)
    .range(range)
    .paddingInner(paddingInner)
    .paddingOuter(paddingOuter)
    .align(align);
}

/**
 * Create a point scale (band scale with bandwidth = 0)
 *
 * Useful for scatter plots with categorical X-axis
 */
export function createPointScale(
  config: Omit<BandScaleConfig, 'paddingInner'>
): BandScale {
  return createBandScale({ ...config, paddingInner: 1 });
}
