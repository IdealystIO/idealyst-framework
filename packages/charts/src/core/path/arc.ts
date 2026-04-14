/**
 * Arc Path Generator
 *
 * Generates SVG path strings for pie charts, donut charts, and radial elements.
 * Backed by d3-shape's arc() and pie() generators.
 */

import { arc as d3Arc, pie as d3Pie } from 'd3-shape';
import type { Point } from './commands';
import { round } from './commands';

/**
 * Configuration for arc generation
 */
export interface ArcConfig {
  /** Start angle in radians (0 = 3 o'clock, PI/2 = 6 o'clock) */
  startAngle: number;
  /** End angle in radians */
  endAngle: number;
  /** Inner radius (0 for pie, >0 for donut) */
  innerRadius: number;
  /** Outer radius */
  outerRadius: number;
  /** Corner radius for rounded corners */
  cornerRadius?: number;
  /** Padding angle between segments (radians) */
  padAngle?: number;
}

/**
 * Result of arc centroid calculation
 */
export interface ArcCentroid {
  /** X coordinate of centroid */
  x: number;
  /** Y coordinate of centroid */
  y: number;
  /** Angle of centroid (radians) */
  angle: number;
  /** Radius at centroid */
  radius: number;
}

// D3 uses 0 = 12 o'clock (top), our API uses 0 = 3 o'clock (right / standard math).
// Offset: D3 angle = our angle + PI/2
const ANGLE_OFFSET = Math.PI / 2;

/**
 * Generate an arc path for pie/donut segments
 *
 * @param centerX - X coordinate of center
 * @param centerY - Y coordinate of center
 * @param config - Arc configuration
 *
 * @example
 * ```ts
 * // Full pie slice (0 to 90 degrees)
 * const path = generateArcPath(100, 100, {
 *   startAngle: -Math.PI / 2,  // Start at top
 *   endAngle: 0,               // End at right
 *   innerRadius: 0,            // Solid pie (not donut)
 *   outerRadius: 80,
 * });
 *
 * // Donut segment
 * const donutPath = generateArcPath(100, 100, {
 *   startAngle: 0,
 *   endAngle: Math.PI,
 *   innerRadius: 40,
 *   outerRadius: 80,
 * });
 * ```
 */
export function generateArcPath(
  centerX: number,
  centerY: number,
  config: ArcConfig
): string {
  const {
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
    cornerRadius = 0,
    padAngle = 0,
  } = config;

  const arcGenerator = d3Arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(cornerRadius);

  const path = arcGenerator({
    startAngle: startAngle + ANGLE_OFFSET,
    endAngle: endAngle + ANGLE_OFFSET,
    padAngle,
    innerRadius,
    outerRadius,
  });

  if (!path) return '';

  // D3 generates arcs centered at (0,0). Translate to (centerX, centerY).
  return translateSvgPath(path, centerX, centerY);
}

/**
 * Calculate the centroid of an arc segment
 * Useful for positioning labels
 */
export function getArcCentroid(
  centerX: number,
  centerY: number,
  config: ArcConfig
): ArcCentroid {
  const { startAngle, endAngle, innerRadius, outerRadius } = config;

  const arcGenerator = d3Arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  const [cx, cy] = arcGenerator.centroid({
    startAngle: startAngle + ANGLE_OFFSET,
    endAngle: endAngle + ANGLE_OFFSET,
    padAngle: 0,
    innerRadius,
    outerRadius,
  });

  const midAngle = (startAngle + endAngle) / 2;
  const midRadius = (innerRadius + outerRadius) / 2;

  return {
    x: cx + centerX,
    y: cy + centerY,
    angle: midAngle,
    radius: midRadius,
  };
}

/**
 * Calculate arc angles from data values
 *
 * @param values - Array of numeric values
 * @param startAngle - Starting angle (default: -PI/2, top of circle)
 * @returns Array of { startAngle, endAngle, value, percentage } for each segment
 */
export function calculateArcAngles(
  values: number[],
  startAngle: number = -Math.PI / 2
): Array<{ startAngle: number; endAngle: number; value: number; percentage: number }> {
  const total = values.reduce((sum, v) => sum + Math.abs(v), 0);

  const pieGenerator = d3Pie<number>()
    .value((d) => Math.abs(d))
    .startAngle(startAngle + ANGLE_OFFSET)
    .endAngle(startAngle + ANGLE_OFFSET + 2 * Math.PI)
    .sort(null);

  const arcs = pieGenerator(values);

  return arcs.map((a) => ({
    startAngle: a.startAngle - ANGLE_OFFSET,
    endAngle: a.endAngle - ANGLE_OFFSET,
    value: a.data,
    percentage: total > 0
      ? (Math.abs(a.data) / total) * 100
      : 100 / values.length,
  }));
}

/**
 * Generate a radial line path (spoke from center to edge)
 */
export function generateRadialLine(
  centerX: number,
  centerY: number,
  angle: number,
  innerRadius: number,
  outerRadius: number
): string {
  const startX = centerX + innerRadius * Math.cos(angle);
  const startY = centerY + innerRadius * Math.sin(angle);
  const endX = centerX + outerRadius * Math.cos(angle);
  const endY = centerY + outerRadius * Math.sin(angle);

  return `M ${round(startX)} ${round(startY)} L ${round(endX)} ${round(endY)}`;
}

/**
 * Translate all coordinates in an SVG path string by (dx, dy).
 *
 * Tokenizes the path into numbers and non-number segments, then offsets
 * the coordinate pairs for each command based on how many coordinate
 * pairs that command type consumes.
 */
function translateSvgPath(path: string, dx: number, dy: number): string {
  if (dx === 0 && dy === 0) return path;

  // Split the path into tokens: commands and numbers
  const tokens = path.match(/[a-zA-Z]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g);
  if (!tokens) return path;

  const result: string[] = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];
    if (/^[a-zA-Z]$/.test(token)) {
      result.push(token);
      i++;

      const cmd = token.toUpperCase();

      if (cmd === 'Z') {
        continue;
      }

      // Number of coordinate pairs per command
      // M/L: 1 pair (x,y), C: 3 pairs, S/Q: 2 pairs, A: special
      if (cmd === 'A') {
        // A rx ry rotation large-arc-flag sweep-flag x y
        // Only x,y (positions 5,6) get translated
        for (let j = 0; j < 7 && i < tokens.length; j++) {
          const num = parseFloat(tokens[i]);
          if (j === 5) {
            result.push(String(round(num + dx)));
          } else if (j === 6) {
            result.push(String(round(num + dy)));
          } else {
            result.push(tokens[i]);
          }
          i++;
        }
      } else {
        // For M, L, C, S, Q, T — all numbers are x,y pairs
        const pairCounts: Record<string, number> = { M: 1, L: 1, H: 0, V: 0, C: 3, S: 2, Q: 2, T: 1 };
        const pairs = pairCounts[cmd] ?? 0;

        if (cmd === 'H') {
          // H x — translate x only
          if (i < tokens.length) {
            result.push(String(round(parseFloat(tokens[i]) + dx)));
            i++;
          }
        } else if (cmd === 'V') {
          // V y — translate y only
          if (i < tokens.length) {
            result.push(String(round(parseFloat(tokens[i]) + dy)));
            i++;
          }
        } else {
          for (let p = 0; p < pairs; p++) {
            if (i + 1 < tokens.length) {
              result.push(String(round(parseFloat(tokens[i]) + dx)));
              result.push(String(round(parseFloat(tokens[i + 1]) + dy)));
              i += 2;
            }
          }
        }
      }
    } else {
      result.push(token);
      i++;
    }
  }

  return result.join(' ');
}
