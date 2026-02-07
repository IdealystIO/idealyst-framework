/**
 * SVG Path Commands
 *
 * Low-level path command types and utilities.
 */

/**
 * Point in 2D space
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Path command types
 */
export type PathCommandType = 'M' | 'L' | 'H' | 'V' | 'C' | 'S' | 'Q' | 'T' | 'A' | 'Z';

/**
 * Individual path command
 */
export interface PathCommand {
  type: PathCommandType;
  args: number[];
}

/**
 * Convert an array of path commands to an SVG path string
 */
export function commandsToPath(commands: PathCommand[]): string {
  return commands
    .map((cmd) => {
      if (cmd.type === 'Z') return 'Z';
      return `${cmd.type} ${cmd.args.join(' ')}`;
    })
    .join(' ');
}

/**
 * Create a moveTo command
 */
export function moveTo(x: number, y: number): PathCommand {
  return { type: 'M', args: [x, y] };
}

/**
 * Create a lineTo command
 */
export function lineTo(x: number, y: number): PathCommand {
  return { type: 'L', args: [x, y] };
}

/**
 * Create a horizontal line command
 */
export function horizontalTo(x: number): PathCommand {
  return { type: 'H', args: [x] };
}

/**
 * Create a vertical line command
 */
export function verticalTo(y: number): PathCommand {
  return { type: 'V', args: [y] };
}

/**
 * Create a cubic bezier curve command
 */
export function curveTo(
  cx1: number,
  cy1: number,
  cx2: number,
  cy2: number,
  x: number,
  y: number
): PathCommand {
  return { type: 'C', args: [cx1, cy1, cx2, cy2, x, y] };
}

/**
 * Create a smooth cubic bezier curve command
 */
export function smoothCurveTo(cx2: number, cy2: number, x: number, y: number): PathCommand {
  return { type: 'S', args: [cx2, cy2, x, y] };
}

/**
 * Create a quadratic bezier curve command
 */
export function quadraticTo(cx: number, cy: number, x: number, y: number): PathCommand {
  return { type: 'Q', args: [cx, cy, x, y] };
}

/**
 * Create an arc command
 *
 * @param rx - X radius
 * @param ry - Y radius
 * @param rotation - X-axis rotation in degrees
 * @param largeArc - Use the larger arc (0 or 1)
 * @param sweep - Sweep direction (0 = counter-clockwise, 1 = clockwise)
 * @param x - End X coordinate
 * @param y - End Y coordinate
 */
export function arcTo(
  rx: number,
  ry: number,
  rotation: number,
  largeArc: 0 | 1,
  sweep: 0 | 1,
  x: number,
  y: number
): PathCommand {
  return { type: 'A', args: [rx, ry, rotation, largeArc, sweep, x, y] };
}

/**
 * Create a close path command
 */
export function closePath(): PathCommand {
  return { type: 'Z', args: [] };
}

/**
 * Round a number to a specified precision
 */
export function round(value: number, precision: number = 3): number {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Round all numbers in a point
 */
export function roundPoint(point: Point, precision: number = 3): Point {
  return {
    x: round(point.x, precision),
    y: round(point.y, precision),
  };
}
