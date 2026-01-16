/**
 * useAnimatedValue - Native implementation
 *
 * Creates an animated numeric value using Reanimated shared values.
 */

import { useCallback, useMemo } from 'react';
import {
  useSharedValue,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  interpolate as reanimatedInterpolate,
  Extrapolation,
  useDerivedValue,
} from 'react-native-reanimated';
import { timingConfig, springConfig, isSpringEasing, resolveDuration } from '@idealyst/theme/animation';
import type { AnimatedValue, AnimationOptions, InterpolationConfig } from './types';

/**
 * Hook that creates an animated numeric value using Reanimated.
 *
 * @param initialValue - Starting value
 * @returns AnimatedValue object with set, setImmediate, and interpolate methods
 *
 * @example
 * ```tsx
 * const progress = useAnimatedValue(0);
 *
 * // Animate to new value
 * progress.set(1, { duration: 'slow', easing: 'easeOut' });
 *
 * // Use in animated style
 * const animatedStyle = useAnimatedStyle(() => ({
 *   opacity: progress.value,
 * }));
 * ```
 */
export function useAnimatedValue(initialValue: number): AnimatedValue {
  const sharedValue = useSharedValue(initialValue);

  // Set value with animation
  const set = useCallback(
    (target: number, options: AnimationOptions = {}) => {
      const { duration = 'normal', easing = 'easeOut', delay = 0 } = options;

      const useSpring = isSpringEasing(easing);

      if (useSpring) {
        const config = springConfig(easing as any);
        sharedValue.value =
          delay > 0 ? withDelay(delay, withSpring(target, config)) : withSpring(target, config);
      } else {
        const config = timingConfig(duration, easing);
        const timingOptions = {
          duration: config.duration,
          easing: Easing.bezier(config.easing[0], config.easing[1], config.easing[2], config.easing[3]),
        };
        sharedValue.value =
          delay > 0 ? withDelay(delay, withTiming(target, timingOptions)) : withTiming(target, timingOptions);
      }
    },
    [sharedValue]
  );

  // Set value immediately without animation
  const setImmediate = useCallback(
    (target: number) => {
      sharedValue.value = target;
    },
    [sharedValue]
  );

  // Interpolate value to another range
  // Note: For native, this returns a function that should be called within useAnimatedStyle
  const interpolate = useCallback(
    <T extends string | number>(config: InterpolationConfig<T>): T => {
      const { inputRange, outputRange, extrapolate = 'extend' } = config;
      const extrapolateLeft = config.extrapolateLeft ?? extrapolate;
      const extrapolateRight = config.extrapolateRight ?? extrapolate;

      // Map extrapolation to Reanimated's Extrapolation enum
      const getExtrapolation = (type: string) => {
        switch (type) {
          case 'clamp':
            return Extrapolation.CLAMP;
          case 'identity':
            return Extrapolation.IDENTITY;
          default:
            return Extrapolation.EXTEND;
        }
      };

      // For numbers, use Reanimated's interpolate
      if (typeof outputRange[0] === 'number') {
        return reanimatedInterpolate(
          sharedValue.value,
          inputRange,
          outputRange as number[],
          {
            extrapolateLeft: getExtrapolation(extrapolateLeft),
            extrapolateRight: getExtrapolation(extrapolateRight),
          }
        ) as T;
      }

      // For colors (strings), do manual interpolation
      // Note: In real usage, you'd want to use interpolateColor from Reanimated
      const value = sharedValue.value;

      // Find the segment
      let i = 0;
      for (; i < inputRange.length - 1; i++) {
        if (value < inputRange[i + 1]) break;
      }
      i = Math.min(i, inputRange.length - 2);

      const inputMin = inputRange[i];
      const inputMax = inputRange[i + 1];
      const outputMin = outputRange[i] as string;
      const outputMax = outputRange[i + 1] as string;

      let ratio = (value - inputMin) / (inputMax - inputMin);

      // Handle extrapolation for colors
      if (value < inputRange[0] && extrapolateLeft === 'clamp') {
        return outputRange[0];
      } else if (value > inputRange[inputRange.length - 1] && extrapolateRight === 'clamp') {
        return outputRange[outputRange.length - 1];
      }

      ratio = Math.max(0, Math.min(1, ratio));

      // Simple hex color interpolation
      if (outputMin.startsWith('#') && outputMax.startsWith('#')) {
        const parseHex = (hex: string) => {
          const h = hex.replace('#', '');
          return {
            r: parseInt(h.substring(0, 2), 16),
            g: parseInt(h.substring(2, 4), 16),
            b: parseInt(h.substring(4, 6), 16),
          };
        };
        const min = parseHex(outputMin);
        const max = parseHex(outputMax);
        const r = Math.round(min.r + (max.r - min.r) * ratio);
        const g = Math.round(min.g + (max.g - min.g) * ratio);
        const b = Math.round(min.b + (max.b - min.b) * ratio);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}` as T;
      }

      return (ratio < 0.5 ? outputMin : outputMax) as T;
    },
    [sharedValue]
  );

  return useMemo(
    () => ({
      get value() {
        return sharedValue.value;
      },
      set,
      setImmediate,
      interpolate,
    }),
    [sharedValue, set, setImmediate, interpolate]
  );
}
