/**
 * Band Scale
 *
 * Maps discrete categorical values to continuous bands.
 * Used for bar charts and categorical X-axes.
 */

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
    range: [r0, r1],
    padding = 0,
    paddingInner = padding,
    paddingOuter = padding,
    align = 0.5,
  } = config;

  const n = domain.length;

  if (n === 0) {
    // Empty domain - return scale that always returns undefined
    const emptyScale = ((_value: string): number | undefined => undefined) as BandScale;
    emptyScale.domain = () => [];
    emptyScale.range = () => [r0, r1];
    emptyScale.bandwidth = () => 0;
    emptyScale.step = () => 0;
    emptyScale.copy = () => createBandScale(config);
    return emptyScale;
  }

  const rangeSpan = r1 - r0;

  // Calculate step and bandwidth
  // step = bandwidth + innerPadding
  // totalRange = n * step - innerPadding + 2 * outerPadding * step
  // Solving: step = rangeSpan / (n - paddingInner + 2 * paddingOuter)
  const denominator = n - paddingInner + 2 * paddingOuter;
  const step = denominator <= 0 ? 0 : rangeSpan / denominator;
  const bandwidth = step * (1 - paddingInner);
  const start = r0 + step * paddingOuter + (step - bandwidth) * align;

  // Create lookup map for O(1) access
  const indexMap = new Map<string, number>();
  domain.forEach((value, index) => {
    indexMap.set(value, index);
  });

  // The scale function
  const scale = ((value: string): number | undefined => {
    const index = indexMap.get(value);
    if (index === undefined) return undefined;
    return start + step * index;
  }) as BandScale;

  // Getters
  scale.domain = (): string[] => [...domain];
  scale.range = (): [number, number] => [r0, r1];
  scale.bandwidth = (): number => bandwidth;
  scale.step = (): number => step;

  // Copy
  scale.copy = (): BandScale => createBandScale(config);

  return scale;
}

/**
 * Create a point scale (band scale with bandwidth = 0)
 *
 * Useful for scatter plots with categorical X-axis
 */
export function createPointScale(config: Omit<BandScaleConfig, 'paddingInner'>): BandScale {
  return createBandScale({
    ...config,
    paddingInner: 1, // This makes bandwidth = 0
  });
}
