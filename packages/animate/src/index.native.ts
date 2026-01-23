/**
 * @idealyst/animate - Native exports
 *
 * Cross-platform animation hooks for React and React Native.
 * This module provides a unified API for creating smooth animations
 * that work on both web and native platforms.
 *
 * On native, animations use Reanimated for UI thread performance.
 * Use `withAnimated` to wrap components for use with animated styles.
 *
 * @example
 * ```tsx
 * import { View } from '@idealyst/components';
 * import { withAnimated, useAnimatedStyle, usePresence, useGradientBorder } from '@idealyst/animate';
 *
 * const AnimatedView = withAnimated(View);
 *
 * // State-driven animations
 * const style = useAnimatedStyle({
 *   opacity: isVisible ? 1 : 0,
 * }, { duration: 'normal', easing: 'easeOut' });
 *
 * return <AnimatedView style={style}>Content</AnimatedView>;
 *
 * // Mount/unmount animations
 * const { isPresent, style } = usePresence(isOpen, {
 *   enter: { opacity: 1 },
 *   exit: { opacity: 0 },
 * });
 *
 * // Gradient borders
 * const { containerStyle, contentStyle, GradientBorder } = useGradientBorder({
 *   colors: ['#3b82f6', '#8b5cf6'],
 *   animation: 'spin',
 * });
 * ```
 */

// Type exports
export type {
  AnimatableStyle,
  AnimatableProperties,
  TransformProperty,
  TransformObject,
  AnimationOptions,
  PlatformOverrides,
  UseAnimatedStyleOptions,
  AnimatedValue,
  InterpolationConfig,
  SequenceStep,
  UseSequenceResult,
  KeyframePercentage,
  KeyframeDefinition,
  UseKeyframesOptions,
  UseKeyframesResult,
  UsePresenceOptions,
  UsePresenceResult,
  GradientAnimation,
  UseGradientBorderOptions,
  UseGradientBorderResult,
} from './types';

// Hook exports (native implementations)
export { useAnimatedStyle } from './useAnimatedStyle.native';
export { useAnimatedValue } from './useAnimatedValue.native';
export { usePresence } from './usePresence.native';
export { useGradientBorder } from './useGradientBorder.native';

// HOC for wrapping components to work with Reanimated
export { withAnimated } from './withAnimated.native';

// Re-export animation tokens for convenience
export { durations, easings, presets } from '@idealyst/theme/animation';
