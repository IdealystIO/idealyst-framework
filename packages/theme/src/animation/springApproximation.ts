/**
 * Spring-to-CSS Approximation Utilities
 *
 * These utilities convert spring physics parameters to CSS-compatible
 * bezier curves and durations, enabling performant CSS-only animations
 * on web that approximate native spring behavior.
 *
 * CSS cannot truly replicate spring physics (damping, stiffness, mass, velocity),
 * but we can create close approximations using cubic-bezier curves and the
 * CSS linear() function for more accurate representations.
 */

import type { SpringConfig, BezierEasing } from './types';
import { easings } from './tokens';

/**
 * Result of converting a spring config to CSS-compatible values
 */
export interface SpringApproximation {
  /** CSS easing string (cubic-bezier or linear()) */
  css: string;
  /** Bezier curve values (for fallback or simpler scenarios) */
  bezier: BezierEasing;
  /** Calculated duration in milliseconds */
  duration: number;
  /** Whether this spring has significant overshoot */
  hasOvershoot: boolean;
  /** Description of the approximation quality */
  quality: 'good' | 'approximate' | 'limited';
}

/**
 * Pre-computed approximations for built-in spring types
 *
 * These are hand-tuned to feel as close as possible to the
 * native spring implementations.
 */
export const springApproximations: Record<string, SpringApproximation> = {
  /**
   * spring: { damping: 15, stiffness: 200, mass: 1 }
   * Medium bounce, good for toggles and state changes
   * Has noticeable overshoot (~10-15%)
   */
  spring: {
    css: 'cubic-bezier(0.34, 1.4, 0.64, 1)',
    bezier: [0.34, 1.4, 0.64, 1] as BezierEasing,
    duration: 350,
    hasOvershoot: true,
    quality: 'approximate',
  },

  /**
   * springStiff: { damping: 40, stiffness: 200, mass: 1 }
   * Snappy with minimal overshoot, good for switches
   * Very little bounce, CSS can approximate well
   */
  springStiff: {
    css: 'cubic-bezier(0.22, 0.68, 0, 1)',
    bezier: [0.22, 0.68, 0, 1] as BezierEasing,
    duration: 200,
    hasOvershoot: false,
    quality: 'good',
  },

  /**
   * springBouncy: { damping: 10, stiffness: 180, mass: 1 }
   * Very bouncy, playful feel
   * Significant overshoot that CSS bezier can't fully replicate
   */
  springBouncy: {
    // Using linear() for better overshoot representation
    // This samples the spring curve at key points
    css: `linear(
      0, 0.178 9.09%, 0.638 18.18%, 0.935 27.27%,
      1.105 36.36%, 1.13 40.91%, 1.114 45.45%,
      1.059 54.55%, 1.012 63.64%, 0.992 72.73%,
      0.997 81.82%, 1.001 90.91%, 1
    )`,
    bezier: [0.34, 1.56, 0.64, 1] as BezierEasing,
    duration: 500,
    hasOvershoot: true,
    quality: 'approximate',
  },
};

/**
 * Approximate damping ratio from spring config
 *
 * ζ = damping / (2 * sqrt(stiffness * mass))
 * - ζ < 1: Underdamped (oscillates/overshoots)
 * - ζ = 1: Critically damped (fastest without overshoot)
 * - ζ > 1: Overdamped (slow, no overshoot)
 */
function calculateDampingRatio(config: SpringConfig): number {
  const { damping, stiffness, mass } = config;
  return damping / (2 * Math.sqrt(stiffness * mass));
}

/**
 * Calculate approximate duration for spring to settle
 *
 * Uses the formula: duration ≈ (4 * mass) / damping
 * With adjustments for stiffness and a minimum floor
 */
function calculateSpringDuration(config: SpringConfig): number {
  const { damping, stiffness, mass } = config;

  // Natural frequency
  const omega0 = Math.sqrt(stiffness / mass);

  // Settling time approximation (to 2% of final value)
  // For underdamped: t ≈ 4 / (damping_ratio * omega0)
  // For overdamped: longer settling time
  const dampingRatio = calculateDampingRatio(config);

  let duration: number;
  if (dampingRatio < 1) {
    // Underdamped - oscillates before settling
    duration = (4 / (dampingRatio * omega0)) * 1000;
  } else {
    // Critically damped or overdamped
    duration = ((4 * mass) / damping) * 1000;
  }

  // Clamp to reasonable range
  return Math.max(150, Math.min(800, Math.round(duration)));
}

/**
 * Generate bezier approximation for a spring config
 *
 * This creates a cubic-bezier that approximates the spring's
 * velocity profile. For underdamped springs, we simulate
 * overshoot by pushing control points beyond [0,1].
 */
function generateBezierApproximation(config: SpringConfig): BezierEasing {
  const dampingRatio = calculateDampingRatio(config);

  if (dampingRatio >= 1) {
    // Critically damped or overdamped - no overshoot
    // Use a deceleration curve
    const decelFactor = Math.min(1, dampingRatio - 0.5);
    return [0.22, 0.68 * decelFactor, 0, 1] as BezierEasing;
  }

  // Underdamped - has overshoot
  // Calculate overshoot amount (0-1 scale, where 0.3 = 30% overshoot)
  const overshoot = Math.exp((-dampingRatio * Math.PI) / Math.sqrt(1 - dampingRatio * dampingRatio));

  // Map overshoot to bezier control point
  // Y2 > 1 creates overshoot effect
  const y2 = 1 + Math.min(0.6, overshoot * 0.8);

  return [0.34, y2, 0.64, 1] as BezierEasing;
}

/**
 * Generate CSS linear() easing for springs with significant bounce
 *
 * linear() allows us to define arbitrary easing curves by sampling
 * points along the spring's motion. This gives better accuracy for
 * bouncy springs than cubic-bezier.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function#linear_easing_function
 */
function generateLinearEasing(config: SpringConfig, samples: number = 12): string {
  const { damping, stiffness, mass } = config;
  const omega0 = Math.sqrt(stiffness / mass);
  const dampingRatio = calculateDampingRatio(config);
  const duration = calculateSpringDuration(config);

  // Sample the spring curve
  const points: string[] = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const time = (t * duration) / 1000; // Convert to seconds

    let value: number;
    if (dampingRatio < 1) {
      // Underdamped spring equation
      const dampedFreq = omega0 * Math.sqrt(1 - dampingRatio * dampingRatio);
      const envelope = Math.exp(-dampingRatio * omega0 * time);
      value = 1 - envelope * Math.cos(dampedFreq * time);
    } else {
      // Critically damped or overdamped
      value = 1 - Math.exp(-omega0 * time) * (1 + omega0 * time);
    }

    // Format point (value with optional percentage)
    const percent = Math.round(t * 10000) / 100;
    if (i === 0) {
      points.push('0');
    } else if (i === samples) {
      points.push('1');
    } else {
      points.push(`${value.toFixed(3)} ${percent}%`);
    }
  }

  return `linear(${points.join(', ')})`;
}

/**
 * Convert a spring configuration to CSS-compatible values
 *
 * Analyzes the spring parameters and generates the best possible
 * CSS approximation, choosing between cubic-bezier and linear()
 * based on the spring's characteristics.
 *
 * @param config - Spring configuration (damping, stiffness, mass)
 * @returns CSS easing string, bezier fallback, and calculated duration
 *
 * @example
 * import { approximateSpring } from '@idealyst/theme/animation';
 *
 * const result = approximateSpring({ damping: 15, stiffness: 200, mass: 1 });
 * // => {
 * //   css: 'cubic-bezier(0.34, 1.4, 0.64, 1)',
 * //   bezier: [0.34, 1.4, 0.64, 1],
 * //   duration: 350,
 * //   hasOvershoot: true,
 * //   quality: 'approximate'
 * // }
 */
export function approximateSpring(config: SpringConfig): SpringApproximation {
  const dampingRatio = calculateDampingRatio(config);
  const duration = calculateSpringDuration(config);
  const bezier = generateBezierApproximation(config);
  const hasOvershoot = dampingRatio < 1;

  // Determine quality and best CSS representation
  let css: string;
  let quality: SpringApproximation['quality'];

  if (dampingRatio >= 0.9) {
    // Nearly critically damped - bezier is accurate
    css = `cubic-bezier(${bezier.join(', ')})`;
    quality = 'good';
  } else if (dampingRatio >= 0.5) {
    // Moderately underdamped - bezier approximates well
    css = `cubic-bezier(${bezier.join(', ')})`;
    quality = 'approximate';
  } else {
    // Heavily underdamped (very bouncy) - use linear() for accuracy
    css = generateLinearEasing(config);
    quality = 'limited';
  }

  return {
    css,
    bezier,
    duration,
    hasOvershoot,
    quality,
  };
}

/**
 * Get spring approximation by name or config
 *
 * For named springs (spring, springStiff, springBouncy), returns
 * pre-computed approximations. For custom configs, calculates
 * the approximation on demand.
 *
 * @param spring - Spring name or configuration object
 * @returns CSS-compatible spring approximation
 *
 * @example
 * // Named spring
 * const stiff = getSpringApproximation('springStiff');
 *
 * // Custom config
 * const custom = getSpringApproximation({ damping: 20, stiffness: 300, mass: 1 });
 */
export function getSpringApproximation(
  spring: keyof typeof springApproximations | SpringConfig
): SpringApproximation {
  if (typeof spring === 'string') {
    return springApproximations[spring] ?? springApproximations.spring;
  }
  return approximateSpring(spring);
}

/**
 * Check if a CSS easing uses the linear() function
 *
 * Useful for feature detection since linear() has limited browser support.
 * Falls back to bezier approximation if needed.
 */
export function usesLinearEasing(css: string): boolean {
  return css.startsWith('linear(');
}

/**
 * Get fallback CSS for browsers without linear() support
 *
 * @param approximation - Spring approximation result
 * @returns CSS cubic-bezier string
 */
export function getLinearFallback(approximation: SpringApproximation): string {
  return `cubic-bezier(${approximation.bezier.join(', ')})`;
}

/**
 * Check if linear() easing is supported in the current environment
 *
 * linear() was added in Chrome 113, Firefox 112, Safari 17.2
 */
export function isLinearEasingSupported(): boolean {
  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') {
    return false;
  }
  return CSS.supports('animation-timing-function', 'linear(0, 1)');
}
