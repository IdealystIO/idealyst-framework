/**
 * Bar Path Generator
 *
 * Generates SVG paths/rects for bar charts.
 */

import { round } from './commands';

/**
 * Configuration for a single bar
 */
export interface BarConfig {
  /** X coordinate (left edge for vertical, bottom for horizontal) */
  x: number;
  /** Y coordinate (top edge for vertical, left for horizontal) */
  y: number;
  /** Width of the bar */
  width: number;
  /** Height of the bar */
  height: number;
  /** Corner radius (all corners) */
  radius?: number;
  /** Individual corner radii [topLeft, topRight, bottomRight, bottomLeft] */
  cornerRadii?: [number, number, number, number];
}

/**
 * Result of bar rect calculation
 */
export interface BarRect {
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
  ry?: number;
}

/**
 * Configuration for bar layout
 */
export interface BarLayoutConfig {
  /** Baseline value (typically 0) */
  baseline: number;
  /** Whether bars are horizontal (default: vertical) */
  horizontal?: boolean;
  /** Minimum bar size in pixels (for very small values) */
  minBarSize?: number;
}

/**
 * Generate a simple bar rect (no custom corner radii)
 */
export function generateBarRect(config: BarConfig): BarRect {
  const { x, y, width, height, radius = 0 } = config;

  return {
    x: round(x),
    y: round(y),
    width: round(Math.max(0, width)),
    height: round(Math.max(0, height)),
    rx: radius > 0 ? round(Math.min(radius, width / 2, height / 2)) : undefined,
    ry: radius > 0 ? round(Math.min(radius, width / 2, height / 2)) : undefined,
  };
}

/**
 * Generate a bar path with custom corner radii
 *
 * @example
 * ```ts
 * // Bar with rounded top corners only
 * const path = generateBarPath({
 *   x: 10, y: 50, width: 30, height: 100,
 *   cornerRadii: [8, 8, 0, 0],  // [topLeft, topRight, bottomRight, bottomLeft]
 * });
 * ```
 */
export function generateBarPath(config: BarConfig): string {
  const { x, y, width, height, radius = 0, cornerRadii } = config;

  // Ensure non-negative dimensions
  const w = Math.max(0, width);
  const h = Math.max(0, height);

  if (w === 0 || h === 0) return '';

  // Get corner radii
  let [tl, tr, br, bl] = cornerRadii || [radius, radius, radius, radius];

  // Clamp radii to half the smallest dimension
  const maxRadius = Math.min(w / 2, h / 2);
  tl = Math.min(tl, maxRadius);
  tr = Math.min(tr, maxRadius);
  br = Math.min(br, maxRadius);
  bl = Math.min(bl, maxRadius);

  // If all radii are 0, use simple rect path
  if (tl === 0 && tr === 0 && br === 0 && bl === 0) {
    return [
      `M ${round(x)} ${round(y)}`,
      `h ${round(w)}`,
      `v ${round(h)}`,
      `h ${round(-w)}`,
      'Z',
    ].join(' ');
  }

  // Build path with rounded corners
  return [
    // Start at top-left corner (after the arc)
    `M ${round(x + tl)} ${round(y)}`,
    // Top edge
    `h ${round(w - tl - tr)}`,
    // Top-right corner
    tr > 0 ? `a ${round(tr)} ${round(tr)} 0 0 1 ${round(tr)} ${round(tr)}` : '',
    // Right edge
    `v ${round(h - tr - br)}`,
    // Bottom-right corner
    br > 0 ? `a ${round(br)} ${round(br)} 0 0 1 ${round(-br)} ${round(br)}` : '',
    // Bottom edge
    `h ${round(-(w - br - bl))}`,
    // Bottom-left corner
    bl > 0 ? `a ${round(bl)} ${round(bl)} 0 0 1 ${round(-bl)} ${round(-bl)}` : '',
    // Left edge
    `v ${round(-(h - bl - tl))}`,
    // Top-left corner
    tl > 0 ? `a ${round(tl)} ${round(tl)} 0 0 1 ${round(tl)} ${round(-tl)}` : '',
    'Z',
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Calculate bar dimensions from a data value
 *
 * @param value - Data value
 * @param scale - Y scale (or X scale for horizontal bars)
 * @param bandStart - Start position of the band
 * @param bandwidth - Width/height of the band
 * @param config - Layout configuration
 */
export function calculateBarDimensions(
  value: number,
  scale: (v: number) => number,
  bandStart: number,
  bandwidth: number,
  config: BarLayoutConfig
): BarConfig {
  const { baseline, horizontal = false, minBarSize = 1 } = config;

  const scaledValue = scale(value);
  const scaledBaseline = scale(baseline);

  if (horizontal) {
    // Horizontal bar
    const left = Math.min(scaledValue, scaledBaseline);
    const right = Math.max(scaledValue, scaledBaseline);
    const barWidth = Math.max(right - left, minBarSize);

    return {
      x: left,
      y: bandStart,
      width: barWidth,
      height: bandwidth,
    };
  } else {
    // Vertical bar
    const top = Math.min(scaledValue, scaledBaseline);
    const bottom = Math.max(scaledValue, scaledBaseline);
    const barHeight = Math.max(bottom - top, minBarSize);

    return {
      x: bandStart,
      y: top,
      width: bandwidth,
      height: barHeight,
    };
  }
}

/**
 * Calculate positions for grouped bars
 *
 * @param groupIndex - Index of the bar within the group
 * @param groupCount - Total number of bars in the group
 * @param bandStart - Start position of the band
 * @param bandwidth - Total width of the band
 * @param groupPadding - Padding between bars in the group (0-1)
 */
export function calculateGroupedBarPosition(
  groupIndex: number,
  groupCount: number,
  bandStart: number,
  bandwidth: number,
  groupPadding: number = 0.1
): { start: number; width: number } {
  const totalPadding = bandwidth * groupPadding * (groupCount - 1);
  const barWidth = (bandwidth - totalPadding) / groupCount;
  const step = barWidth + bandwidth * groupPadding;

  return {
    start: bandStart + groupIndex * step,
    width: barWidth,
  };
}

/**
 * Calculate positions for stacked bars
 *
 * @param values - Array of values to stack
 * @param scale - Y scale (or X scale for horizontal)
 * @param baseline - Baseline value
 * @returns Array of { start, end } for each segment
 */
export function calculateStackedBarPositions(
  values: number[],
  scale: (v: number) => number,
  baseline: number = 0
): Array<{ start: number; end: number; value: number }> {
  let positiveStack = baseline;
  let negativeStack = baseline;

  return values.map((value) => {
    if (value >= 0) {
      const start = positiveStack;
      positiveStack += value;
      return {
        start: scale(start),
        end: scale(positiveStack),
        value,
      };
    } else {
      const end = negativeStack;
      negativeStack += value;
      return {
        start: scale(negativeStack),
        end: scale(end),
        value,
      };
    }
  });
}
