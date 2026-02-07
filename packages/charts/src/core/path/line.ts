/**
 * Line Path Generator
 *
 * Generates SVG path strings for line and area charts.
 * Supports multiple curve interpolation methods.
 */

import type { CurveType } from '../../types';
import {
  type Point,
  type PathCommand,
  commandsToPath,
  moveTo,
  lineTo,
  curveTo,
  closePath,
  round,
} from './commands';

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
 * Generate a linear (straight line) path
 */
function linearPath(points: Point[]): PathCommand[] {
  if (points.length === 0) return [];

  const commands: PathCommand[] = [moveTo(round(points[0].x), round(points[0].y))];

  for (let i = 1; i < points.length; i++) {
    commands.push(lineTo(round(points[i].x), round(points[i].y)));
  }

  return commands;
}

/**
 * Compute tangents for monotone interpolation (Fritsch-Carlson method)
 */
function computeMonotoneTangents(points: Point[]): number[] {
  const n = points.length;
  const tangents = new Array(n).fill(0);

  if (n < 2) return tangents;

  // Calculate slopes between consecutive points
  const slopes: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    slopes.push(dx === 0 ? 0 : dy / dx);
  }

  // Calculate initial tangents (average of adjacent slopes)
  tangents[0] = slopes[0];
  tangents[n - 1] = slopes[n - 2];

  for (let i = 1; i < n - 1; i++) {
    if (slopes[i - 1] * slopes[i] <= 0) {
      // Sign change or zero slope - set tangent to 0
      tangents[i] = 0;
    } else {
      // Harmonic mean of adjacent slopes
      tangents[i] = (slopes[i - 1] + slopes[i]) / 2;
    }
  }

  // Adjust tangents to ensure monotonicity
  for (let i = 0; i < n - 1; i++) {
    if (slopes[i] === 0) {
      tangents[i] = 0;
      tangents[i + 1] = 0;
    } else {
      const alpha = tangents[i] / slopes[i];
      const beta = tangents[i + 1] / slopes[i];

      // Constrain to ensure monotonicity
      const s = alpha * alpha + beta * beta;
      if (s > 9) {
        const t = 3 / Math.sqrt(s);
        tangents[i] = t * alpha * slopes[i];
        tangents[i + 1] = t * beta * slopes[i];
      }
    }
  }

  return tangents;
}

/**
 * Generate a monotone cubic interpolation path
 * Preserves monotonicity in the data
 */
function monotonePath(points: Point[]): PathCommand[] {
  if (points.length === 0) return [];
  if (points.length === 1) return [moveTo(round(points[0].x), round(points[0].y))];
  if (points.length === 2) return linearPath(points);

  const tangents = computeMonotoneTangents(points);
  const commands: PathCommand[] = [moveTo(round(points[0].x), round(points[0].y))];

  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const dx = (p1.x - p0.x) / 3;

    commands.push(
      curveTo(
        round(p0.x + dx),
        round(p0.y + tangents[i - 1] * dx),
        round(p1.x - dx),
        round(p1.y - tangents[i] * dx),
        round(p1.x),
        round(p1.y)
      )
    );
  }

  return commands;
}

/**
 * Generate a cardinal spline path
 */
function cardinalPath(points: Point[], tension: number = 0.5): PathCommand[] {
  if (points.length === 0) return [];
  if (points.length < 3) return linearPath(points);

  const commands: PathCommand[] = [moveTo(round(points[0].x), round(points[0].y))];
  const t = 1 - tension;

  for (let i = 1; i < points.length; i++) {
    const p0 = points[Math.max(0, i - 2)];
    const p1 = points[i - 1];
    const p2 = points[i];
    const p3 = points[Math.min(points.length - 1, i + 1)];

    // Control points
    const cp1x = p1.x + ((p2.x - p0.x) / 6) * t;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * t;
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * t;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * t;

    commands.push(curveTo(round(cp1x), round(cp1y), round(cp2x), round(cp2y), round(p2.x), round(p2.y)));
  }

  return commands;
}

/**
 * Generate a step path (step at midpoint)
 */
function stepPath(points: Point[], position: number = 0.5): PathCommand[] {
  if (points.length === 0) return [];

  const commands: PathCommand[] = [moveTo(round(points[0].x), round(points[0].y))];

  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const midX = p0.x + (p1.x - p0.x) * position;

    if (position === 0) {
      // Step before (vertical then horizontal)
      commands.push(lineTo(round(p0.x), round(p1.y)));
      commands.push(lineTo(round(p1.x), round(p1.y)));
    } else if (position === 1) {
      // Step after (horizontal then vertical)
      commands.push(lineTo(round(p1.x), round(p0.y)));
      commands.push(lineTo(round(p1.x), round(p1.y)));
    } else {
      // Step at position
      commands.push(lineTo(round(midX), round(p0.y)));
      commands.push(lineTo(round(midX), round(p1.y)));
      commands.push(lineTo(round(p1.x), round(p1.y)));
    }
  }

  return commands;
}

/**
 * Generate a basis spline path (B-spline)
 */
function basisPath(points: Point[]): PathCommand[] {
  if (points.length === 0) return [];
  if (points.length < 3) return linearPath(points);

  const commands: PathCommand[] = [];

  // Start point (weighted average)
  const startX = (points[0].x * 2 + points[1].x) / 3;
  const startY = (points[0].y * 2 + points[1].y) / 3;
  commands.push(moveTo(round(startX), round(startY)));

  for (let i = 1; i < points.length - 1; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];

    const cp1x = (p0.x + p1.x * 2) / 3;
    const cp1y = (p0.y + p1.y * 2) / 3;
    const cp2x = (p2.x + p1.x * 2) / 3;
    const cp2y = (p2.y + p1.y * 2) / 3;
    const endX = (p1.x + p2.x) / 2;
    const endY = (p1.y + p2.y) / 2;

    commands.push(curveTo(round(cp1x), round(cp1y), round(cp2x), round(cp2y), round(endX), round(endY)));
  }

  // End curve
  const n = points.length;
  const cp1x = (points[n - 2].x + points[n - 1].x * 2) / 3;
  const cp1y = (points[n - 2].y + points[n - 1].y * 2) / 3;
  const endX = (points[n - 1].x * 2 + points[n - 2].x) / 3;
  const endY = (points[n - 1].y * 2 + points[n - 2].y) / 3;

  commands.push(curveTo(round(cp1x), round(cp1y), round(endX), round(endY), round(endX), round(endY)));

  return commands;
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
 * // Returns "M 0 100 C 16.667 83.333 33.333 50 50 50 C 66.667 50 83.333 62.5 100 75"
 * ```
 */
export function generateLinePath(points: Point[], config: LinePathConfig = {}): string {
  const { curve = 'linear', tension = 0.5 } = config;

  let commands: PathCommand[];

  switch (curve) {
    case 'linear':
      commands = linearPath(points);
      break;
    case 'monotone':
      commands = monotonePath(points);
      break;
    case 'cardinal':
      commands = cardinalPath(points, tension);
      break;
    case 'step':
      commands = stepPath(points, 0.5);
      break;
    case 'stepBefore':
      commands = stepPath(points, 0);
      break;
    case 'stepAfter':
      commands = stepPath(points, 1);
      break;
    case 'basis':
      commands = basisPath(points);
      break;
    default:
      commands = linearPath(points);
  }

  return commandsToPath(commands);
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

  // Generate the top line
  const linePath = generateLinePath(points, config);

  // Add the bottom line (reversed, straight)
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];

  const closingPath = ` L ${round(lastPoint.x)} ${round(baseline)} L ${round(firstPoint.x)} ${round(baseline)} Z`;

  return linePath + closingPath;
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
