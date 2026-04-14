/**
 * Line Path Generator
 *
 * Generates SVG path strings for line and area charts.
 * Backed by d3-shape's line() and area() generators.
 */

import {
  line,
  area,
  curveBasis,
  curveCardinal,
  curveLinear,
  curveMonotoneX,
  curveStep,
  curveStepBefore,
  curveStepAfter,
  type CurveFactory,
} from 'd3-shape';
import type { CurveType } from '../../types';
import type { Point } from './commands';

/**
 * Configuration for line path generation
 */
export interface LinePathConfig {
  /** Curve interpolation type */
  curve?: CurveType;
  /** Tension for cardinal curves (0-1) */
  tension?: number;
}

/**
 * Map our curve type names to D3 curve factories.
 * Cast to CurveFactory so both line() and area() accept all curves.
 */
function getCurveFactory(
  curve: CurveType,
  tension: number
): CurveFactory {
  switch (curve) {
    case 'monotone':
      return curveMonotoneX as unknown as CurveFactory;
    case 'cardinal':
      return curveCardinal.tension(tension);
    case 'step':
      return curveStep;
    case 'stepBefore':
      return curveStepBefore;
    case 'stepAfter':
      return curveStepAfter;
    case 'basis':
      return curveBasis;
    case 'linear':
    default:
      return curveLinear;
  }
}

/**
 * Generate a line path from points
 *
 * @example
 * ```ts
 * const path = generateLinePath(
 *   [{ x: 0, y: 100 }, { x: 50, y: 50 }, { x: 100, y: 75 }],
 *   { curve: 'monotone' }
 * );
 * // Returns SVG path string with cubic Bezier curves
 * ```
 */
export function generateLinePath(points: Point[], config: LinePathConfig = {}): string {
  const { curve = 'linear', tension = 0.5 } = config;

  if (points.length === 0) return '';

  const lineGenerator = line<Point>()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(getCurveFactory(curve, tension));

  return lineGenerator(points) ?? '';
}

/**
 * Generate an area path (line path closed to baseline)
 *
 * @param points - Data points
 * @param baseline - Y coordinate of the baseline (typically 0 or bottom of chart)
 * @param config - Line path configuration
 */
export function generateAreaPath(
  points: Point[],
  baseline: number,
  config: LinePathConfig = {}
): string {
  if (points.length === 0) return '';

  const { curve = 'linear', tension = 0.5 } = config;

  const areaGenerator = area<Point>()
    .x((d) => d.x)
    .y0(baseline)
    .y1((d) => d.y)
    .curve(getCurveFactory(curve, tension));

  return areaGenerator(points) ?? '';
}

/**
 * Calculate the total length of a path (approximation for animation)
 */
export function approximatePathLength(points: Point[]): number {
  if (points.length < 2) return 0;

  let length = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    length += Math.sqrt(dx * dx + dy * dy);
  }

  // Add ~30% for curves
  return length * 1.3;
}
