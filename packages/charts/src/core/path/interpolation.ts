/**
 * Path Interpolation Utilities
 *
 * Functions for interpolating between paths for animations.
 */

import type { Point } from './commands';

/**
 * Interpolate between two numbers
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Interpolate between two points
 */
export function lerpPoint(a: Point, b: Point, t: number): Point {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
  };
}

/**
 * Interpolate between two arrays of points
 *
 * If arrays have different lengths, the shorter one is extended
 * by linearly interpolating additional points along its path.
 */
export function interpolatePoints(from: Point[], to: Point[], t: number): Point[] {
  // Normalize arrays to same length
  const [normalizedFrom, normalizedTo] = normalizePointArrays(from, to);

  // Interpolate each point
  return normalizedFrom.map((fromPoint, i) => lerpPoint(fromPoint, normalizedTo[i], t));
}

/**
 * Normalize two point arrays to have the same length
 *
 * Uses linear interpolation to add points to the shorter array
 */
export function normalizePointArrays(a: Point[], b: Point[]): [Point[], Point[]] {
  if (a.length === b.length) return [a, b];

  const targetLength = Math.max(a.length, b.length);

  return [resamplePoints(a, targetLength), resamplePoints(b, targetLength)];
}

/**
 * Resample a point array to a target length
 *
 * Uses linear interpolation to add or remove points
 */
export function resamplePoints(points: Point[], targetLength: number): Point[] {
  if (points.length === 0) return [];
  if (points.length === 1) return Array(targetLength).fill(points[0]);
  if (points.length === targetLength) return points;

  const result: Point[] = [];
  const sourceLength = points.length;

  for (let i = 0; i < targetLength; i++) {
    // Map target index to source position
    const sourcePos = (i / (targetLength - 1)) * (sourceLength - 1);
    const sourceIndex = Math.floor(sourcePos);
    const fraction = sourcePos - sourceIndex;

    if (sourceIndex >= sourceLength - 1) {
      result.push(points[sourceLength - 1]);
    } else {
      result.push(lerpPoint(points[sourceIndex], points[sourceIndex + 1], fraction));
    }
  }

  return result;
}

/**
 * Parse an SVG path string into points (simplified - handles M, L, C commands)
 *
 * Note: This is a simplified parser that extracts endpoint coordinates.
 * For more complex paths, consider using a full SVG path parser library.
 */
export function parsePathToPoints(pathString: string): Point[] {
  const points: Point[] = [];
  const commands = pathString.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];

  let currentX = 0;
  let currentY = 0;

  for (const cmd of commands) {
    const type = cmd[0].toUpperCase();
    const args = cmd
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(parseFloat)
      .filter((n) => !isNaN(n));

    switch (type) {
      case 'M':
      case 'L':
        if (args.length >= 2) {
          currentX = args[0];
          currentY = args[1];
          points.push({ x: currentX, y: currentY });
        }
        break;
      case 'H':
        if (args.length >= 1) {
          currentX = args[0];
          points.push({ x: currentX, y: currentY });
        }
        break;
      case 'V':
        if (args.length >= 1) {
          currentY = args[0];
          points.push({ x: currentX, y: currentY });
        }
        break;
      case 'C':
        // Cubic bezier - take the end point
        if (args.length >= 6) {
          currentX = args[4];
          currentY = args[5];
          points.push({ x: currentX, y: currentY });
        }
        break;
      case 'S':
        // Smooth cubic - take the end point
        if (args.length >= 4) {
          currentX = args[2];
          currentY = args[3];
          points.push({ x: currentX, y: currentY });
        }
        break;
      case 'Q':
        // Quadratic bezier - take the end point
        if (args.length >= 4) {
          currentX = args[2];
          currentY = args[3];
          points.push({ x: currentX, y: currentY });
        }
        break;
      case 'A':
        // Arc - take the end point
        if (args.length >= 7) {
          currentX = args[5];
          currentY = args[6];
          points.push({ x: currentX, y: currentY });
        }
        break;
      // Z doesn't add points
    }
  }

  return points;
}

/**
 * Convert points back to a simple linear path string
 */
export function pointsToPath(points: Point[]): string {
  if (points.length === 0) return '';

  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(3)} ${p.y.toFixed(3)}`).join(' ');
}

/**
 * Interpolate between two SVG path strings
 *
 * @param fromPath - Starting path string
 * @param toPath - Ending path string
 * @param t - Interpolation factor (0 to 1)
 * @returns Interpolated path string
 */
export function interpolatePath(fromPath: string, toPath: string, t: number): string {
  const fromPoints = parsePathToPoints(fromPath);
  const toPoints = parsePathToPoints(toPath);

  const interpolated = interpolatePoints(fromPoints, toPoints, t);

  return pointsToPath(interpolated);
}

/**
 * Easing functions for animation
 */
export const easings = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
} as const;

/**
 * Apply easing to interpolation
 */
export function easedInterpolate(
  fromPath: string,
  toPath: string,
  t: number,
  easing: keyof typeof easings = 'easeInOut'
): string {
  const easedT = easings[easing](t);
  return interpolatePath(fromPath, toPath, easedT);
}
