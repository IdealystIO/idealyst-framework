/**
 * Animation module for @idealyst/theme (Native)
 *
 * This module provides animation tokens and utilities for creating
 * consistent animations across web and native platforms.
 *
 * Native-specific exports include Reanimated-compatible utilities.
 *
 * @example
 * // Import tokens
 * import { durations, easings, presets } from '@idealyst/theme/animation';
 *
 * // Import native utilities
 * import { timingConfig, springConfig, animationConfig } from '@idealyst/theme/animation';
 *
 * // Use with Reanimated
 * import { withTiming, withSpring, Easing } from 'react-native-reanimated';
 *
 * const config = timingConfig('normal', 'easeOut');
 * value.value = withTiming(target, {
 *   duration: config.duration,
 *   easing: Easing.bezier(...config.easing),
 * });
 */

// Export tokens
export { durations, easings, presets } from './tokens';
export type { DurationKey, EasingKey, PresetKey } from './tokens';

// Export types
export type {
  Duration,
  Easing,
  BezierEasing,
  SpringConfig,
  CSSEasing,
  AnimationConfig,
  TransitionConfig,
  Keyframes,
  KeyframeAnimationConfig,
  AnimationIterations,
  AnimationDirection,
  AnimationFillMode,
  SpringType,
  TimingAnimationConfig,
  PlatformAnimationOptions,
  GradientAnimation,
  GradientBorderConfig,
} from './types';

// Export native utilities
export {
  resolveDuration,
  resolveEasingBezier,
  isSpringEasing,
  timingConfig,
  springConfig,
  animationConfig,
  presetConfig,
  delayMs,
  sequenceSteps,
} from './transitions.native';
