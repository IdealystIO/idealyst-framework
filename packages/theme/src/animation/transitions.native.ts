/**
 * Native-specific animation utilities
 *
 * These utilities generate Reanimated-compatible configurations
 * from animation tokens for use in React Native animations.
 */

import { durations, easings } from './tokens';
import type { DurationKey, EasingKey, PresetKey } from './tokens';
import type { Duration, SpringType, BezierEasing } from './types';

/**
 * Resolve a duration value to milliseconds
 */
export function resolveDuration(duration: Duration): number {
  if (typeof duration === 'number') {
    return duration;
  }
  return durations[duration];
}

/**
 * Resolve an easing key to bezier curve values
 * Returns bezier array for use with Easing.bezier()
 *
 * Note: Spring easings return a fallback bezier curve.
 * For actual spring behavior, use springConfig() instead.
 */
export function resolveEasingBezier(easing: EasingKey): BezierEasing {
  const easingConfig = easings[easing];
  // Spring configs don't have bezier equivalent, fall back to ease-out
  if ('damping' in easingConfig) {
    return easings.easeOut.bezier;
  }
  return easingConfig.bezier;
}

/**
 * Check if an easing is a spring configuration
 */
export function isSpringEasing(easing: EasingKey): easing is SpringType {
  return easing === 'spring' || easing === 'springStiff' || easing === 'springBouncy';
}

/**
 * Get Reanimated withTiming configuration from tokens
 *
 * Use with Reanimated's withTiming() function.
 * The returned config includes duration and a bezier easing function creator.
 *
 * @param duration - Duration token key or milliseconds
 * @param easing - Easing token key (spring easings fall back to easeOut)
 * @returns Configuration object with duration and easing bezier values
 *
 * @example
 * import { timingConfig } from '@idealyst/theme/animation';
 * import { withTiming, Easing } from 'react-native-reanimated';
 *
 * const config = timingConfig('normal', 'easeOut');
 * // => { duration: 200, easing: [0, 0, 0.58, 1] }
 *
 * // Use with Reanimated
 * animatedValue.value = withTiming(targetValue, {
 *   duration: config.duration,
 *   easing: Easing.bezier(...config.easing),
 * });
 */
export function timingConfig(
  duration: Duration = 'normal',
  easing: EasingKey = 'easeOut'
): { duration: number; easing: BezierEasing } {
  return {
    duration: resolveDuration(duration),
    easing: resolveEasingBezier(easing),
  };
}

/**
 * Get Reanimated withSpring configuration from tokens
 *
 * Use with Reanimated's withSpring() function.
 *
 * @param type - Spring type: 'spring', 'springStiff', or 'springBouncy'
 * @returns Spring configuration object
 *
 * @example
 * import { springConfig } from '@idealyst/theme/animation';
 * import { withSpring } from 'react-native-reanimated';
 *
 * const config = springConfig('springStiff');
 * // => { damping: 40, stiffness: 200, mass: 1 }
 *
 * // Use with Reanimated
 * animatedValue.value = withSpring(targetValue, config);
 */
export function springConfig(
  type: SpringType = 'spring'
): { damping: number; stiffness: number; mass: number } {
  const config = easings[type];
  return {
    damping: config.damping,
    stiffness: config.stiffness,
    mass: config.mass,
  };
}

/**
 * Get animation configuration based on easing type
 *
 * Automatically returns spring config for spring easings,
 * or timing config for bezier easings.
 *
 * @param duration - Duration token key or milliseconds
 * @param easing - Easing token key
 * @returns Either spring config or timing config
 *
 * @example
 * import { animationConfig } from '@idealyst/theme/animation';
 *
 * // Returns spring config
 * animationConfig('normal', 'spring')
 * // => { type: 'spring', config: { damping: 15, stiffness: 200, mass: 1 } }
 *
 * // Returns timing config
 * animationConfig('normal', 'easeOut')
 * // => { type: 'timing', config: { duration: 200, easing: [0, 0, 0.58, 1] } }
 */
export function animationConfig(
  duration: Duration = 'normal',
  easing: EasingKey = 'easeOut'
):
  | { type: 'spring'; config: ReturnType<typeof springConfig> }
  | { type: 'timing'; config: ReturnType<typeof timingConfig> } {
  if (isSpringEasing(easing)) {
    return {
      type: 'spring',
      config: springConfig(easing),
    };
  }
  return {
    type: 'timing',
    config: timingConfig(duration, easing),
  };
}

/**
 * Get preset animation configuration for native
 *
 * @param presetName - Preset key
 * @returns Animation configuration for the preset
 */
export function presetConfig(presetName: keyof typeof import('./tokens').presets) {
  const { presets } = require('./tokens');
  const preset = presets[presetName];
  return animationConfig(preset.duration, preset.easing);
}

/**
 * Helper to create a delay configuration
 *
 * Use with Reanimated's withDelay() function.
 *
 * @param delay - Delay in milliseconds or duration token
 * @returns Delay in milliseconds
 *
 * @example
 * import { delayMs } from '@idealyst/theme/animation';
 * import { withDelay, withTiming } from 'react-native-reanimated';
 *
 * // Using duration token
 * animatedValue.value = withDelay(
 *   delayMs('normal'),
 *   withTiming(targetValue, timingConfig('fast', 'easeOut'))
 * );
 */
export function delayMs(delay: Duration): number {
  return resolveDuration(delay);
}

/**
 * Create a sequence of timing animations
 *
 * Helper for creating withSequence() compatible values.
 *
 * @param steps - Array of { value, duration?, easing? } objects
 * @returns Array of animation configurations
 *
 * @example
 * import { sequenceSteps } from '@idealyst/theme/animation';
 *
 * const steps = sequenceSteps([
 *   { value: 0 },
 *   { value: 1, duration: 'normal', easing: 'easeOut' },
 *   { value: 0.5, duration: 'fast' },
 * ]);
 *
 * // Use with Reanimated
 * animatedValue.value = withSequence(
 *   ...steps.map(s => withTiming(s.value, {
 *     duration: s.config.duration,
 *     easing: Easing.bezier(...s.config.easing)
 *   }))
 * );
 */
export function sequenceSteps(
  steps: Array<{
    value: number;
    duration?: Duration;
    easing?: EasingKey;
  }>
): Array<{
  value: number;
  config: ReturnType<typeof timingConfig>;
}> {
  return steps.map((step) => ({
    value: step.value,
    config: timingConfig(step.duration ?? 'normal', step.easing ?? 'easeOut'),
  }));
}
