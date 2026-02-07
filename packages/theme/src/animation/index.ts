/**
 * Animation module for @idealyst/theme
 *
 * This module provides animation tokens and utilities for creating
 * consistent animations across web and native platforms.
 *
 * @example
 * // Import tokens
 * import { durations, easings, presets } from '@idealyst/theme/animation';
 *
 * // Import web utilities
 * import { cssTransition, cssPreset, cssKeyframes } from '@idealyst/theme/animation';
 *
 * // Import native utilities (in .native.ts files)
 * import { timingConfig, springConfig } from '@idealyst/theme/animation';
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

// Export web utilities
export {
  resolveDuration,
  resolveEasing,
  resolveEasingWithDuration,
  getSpringInfo,
  cssTransition,
  cssPreset,
  cssKeyframes,
  cssAnimation,
  gradientPropertyCSS,
  injectGradientCSS,
  conicSpinnerStyle,
  pulseGradientStyle,
} from './transitions';

// Export spring approximation utilities
export {
  approximateSpring,
  getSpringApproximation,
  springApproximations,
  isLinearEasingSupported,
  getLinearFallback,
  usesLinearEasing,
  type SpringApproximation,
} from './springApproximation';

// Export native utilities (these are also exported from index.native.ts)
// Including here allows type-checking in monorepo without platform resolution
export {
  resolveEasingBezier,
  isSpringEasing,
  timingConfig,
  springConfig,
  animationConfig,
  presetConfig,
  delayMs,
  sequenceSteps,
} from './transitions.native';
