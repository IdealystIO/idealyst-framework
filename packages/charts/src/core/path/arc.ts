/**
 * Arc Path Generator
 *
 * Generates SVG path strings for pie charts, donut charts, and radial elements.
 */

import { type Point, round } from './commands';

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

/**
 * Convert polar coordinates to cartesian
 */
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number
): Point {
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}

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

  // Apply padding
  const actualStartAngle = startAngle + padAngle / 2;
  const actualEndAngle = endAngle - padAngle / 2;

  // Handle full circle case
  const angleDiff = actualEndAngle - actualStartAngle;
  const isFullCircle = Math.abs(angleDiff) >= 2 * Math.PI - 0.001;

  if (isFullCircle) {
    // For a full circle, we need to draw two arcs
    if (innerRadius > 0) {
      // Donut (full ring)
      const outerStart = polarToCartesian(centerX, centerY, outerRadius, actualStartAngle);
      const outerMid = polarToCartesian(centerX, centerY, outerRadius, actualStartAngle + Math.PI);
      const innerStart = polarToCartesian(centerX, centerY, innerRadius, actualStartAngle);
      const innerMid = polarToCartesian(centerX, centerY, innerRadius, actualStartAngle + Math.PI);

      return [
        `M ${round(outerStart.x)} ${round(outerStart.y)}`,
        `A ${round(outerRadius)} ${round(outerRadius)} 0 0 1 ${round(outerMid.x)} ${round(outerMid.y)}`,
        `A ${round(outerRadius)} ${round(outerRadius)} 0 0 1 ${round(outerStart.x)} ${round(outerStart.y)}`,
        `M ${round(innerStart.x)} ${round(innerStart.y)}`,
        `A ${round(innerRadius)} ${round(innerRadius)} 0 0 0 ${round(innerMid.x)} ${round(innerMid.y)}`,
        `A ${round(innerRadius)} ${round(innerRadius)} 0 0 0 ${round(innerStart.x)} ${round(innerStart.y)}`,
        'Z',
      ].join(' ');
    } else {
      // Full pie (circle)
      const top = polarToCartesian(centerX, centerY, outerRadius, -Math.PI / 2);
      const bottom = polarToCartesian(centerX, centerY, outerRadius, Math.PI / 2);

      return [
        `M ${round(top.x)} ${round(top.y)}`,
        `A ${round(outerRadius)} ${round(outerRadius)} 0 0 1 ${round(bottom.x)} ${round(bottom.y)}`,
        `A ${round(outerRadius)} ${round(outerRadius)} 0 0 1 ${round(top.x)} ${round(top.y)}`,
        'Z',
      ].join(' ');
    }
  }

  // Calculate points
  const outerStart = polarToCartesian(centerX, centerY, outerRadius, actualStartAngle);
  const outerEnd = polarToCartesian(centerX, centerY, outerRadius, actualEndAngle);

  // Determine if we need the large arc flag
  const largeArcFlag = angleDiff > Math.PI ? 1 : 0;
  const sweepFlag = 1; // Always clockwise

  let path: string;

  if (innerRadius > 0) {
    // Donut segment
    const innerStart = polarToCartesian(centerX, centerY, innerRadius, actualStartAngle);
    const innerEnd = polarToCartesian(centerX, centerY, innerRadius, actualEndAngle);

    path = [
      // Move to outer start
      `M ${round(outerStart.x)} ${round(outerStart.y)}`,
      // Outer arc to outer end
      `A ${round(outerRadius)} ${round(outerRadius)} 0 ${largeArcFlag} ${sweepFlag} ${round(outerEnd.x)} ${round(outerEnd.y)}`,
      // Line to inner end
      `L ${round(innerEnd.x)} ${round(innerEnd.y)}`,
      // Inner arc back to inner start (counter-clockwise)
      `A ${round(innerRadius)} ${round(innerRadius)} 0 ${largeArcFlag} ${1 - sweepFlag} ${round(innerStart.x)} ${round(innerStart.y)}`,
      // Close path
      'Z',
    ].join(' ');
  } else {
    // Pie slice (no inner radius)
    path = [
      // Move to center
      `M ${round(centerX)} ${round(centerY)}`,
      // Line to outer start
      `L ${round(outerStart.x)} ${round(outerStart.y)}`,
      // Outer arc to outer end
      `A ${round(outerRadius)} ${round(outerRadius)} 0 ${largeArcFlag} ${sweepFlag} ${round(outerEnd.x)} ${round(outerEnd.y)}`,
      // Close path (back to center)
      'Z',
    ].join(' ');
  }

  return path;
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

  // Middle angle
  const midAngle = (startAngle + endAngle) / 2;

  // Middle radius
  const midRadius = (innerRadius + outerRadius) / 2;

  // Calculate position
  const point = polarToCartesian(centerX, centerY, midRadius, midAngle);

  return {
    x: point.x,
    y: point.y,
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

  if (total === 0) {
    // All zeros - distribute equally
    const anglePerSlice = (2 * Math.PI) / values.length;
    return values.map((value, i) => ({
      startAngle: startAngle + i * anglePerSlice,
      endAngle: startAngle + (i + 1) * anglePerSlice,
      value,
      percentage: 100 / values.length,
    }));
  }

  let currentAngle = startAngle;
  return values.map((value) => {
    const percentage = (Math.abs(value) / total) * 100;
    const angleSpan = (Math.abs(value) / total) * 2 * Math.PI;
    const segmentStartAngle = currentAngle;
    currentAngle += angleSpan;

    return {
      startAngle: segmentStartAngle,
      endAngle: currentAngle,
      value,
      percentage,
    };
  });
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
  const start = polarToCartesian(centerX, centerY, innerRadius, angle);
  const end = polarToCartesian(centerX, centerY, outerRadius, angle);

  return `M ${round(start.x)} ${round(start.y)} L ${round(end.x)} ${round(end.y)}`;
}
