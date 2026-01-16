/**
 * useAnimatedValue - Web implementation
 *
 * Creates an animated numeric value that can be interpolated.
 * Uses requestAnimationFrame for smooth animations on web.
 */

import { useState, useRef, useCallback, useMemo } from 'react';
import { resolveDuration, resolveEasing } from '@idealyst/theme/animation';
import type { AnimatedValue, AnimationOptions, InterpolationConfig } from './types';

// Bezier curve evaluation for custom easing
function bezierEval(t: number, p1: number, p2: number, p3: number, p4: number): number {
  const cx = 3 * p1;
  const bx = 3 * (p3 - p1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p2;
  const by = 3 * (p4 - p2) - cy;
  const ay = 1 - cy - by;

  function sampleCurveX(t: number) {
    return ((ax * t + bx) * t + cx) * t;
  }
  function sampleCurveY(t: number) {
    return ((ay * t + by) * t + cy) * t;
  }
  function sampleCurveDerivativeX(t: number) {
    return (3 * ax * t + 2 * bx) * t + cx;
  }

  // Newton-Raphson iteration to find t for x
  let t2 = t;
  for (let i = 0; i < 8; i++) {
    const x2 = sampleCurveX(t2) - t;
    if (Math.abs(x2) < 1e-6) break;
    const d2 = sampleCurveDerivativeX(t2);
    if (Math.abs(d2) < 1e-6) break;
    t2 = t2 - x2 / d2;
  }

  return sampleCurveY(t2);
}

// Parse CSS easing to bezier values
function getEasingBezier(easing: string): [number, number, number, number] {
  const match = easing.match(/cubic-bezier\(([^)]+)\)/);
  if (match) {
    const values = match[1].split(',').map((v) => parseFloat(v.trim()));
    return values as [number, number, number, number];
  }

  // Standard easings
  switch (easing) {
    case 'linear':
      return [0, 0, 1, 1];
    case 'ease':
      return [0.25, 0.1, 0.25, 1];
    case 'ease-in':
      return [0.42, 0, 1, 1];
    case 'ease-out':
      return [0, 0, 0.58, 1];
    case 'ease-in-out':
      return [0.42, 0, 0.58, 1];
    default:
      return [0.25, 0.1, 0.25, 1]; // default to ease
  }
}

/**
 * Hook that creates an animated numeric value.
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
 * // Interpolate to color
 * const color = progress.interpolate({
 *   inputRange: [0, 1],
 *   outputRange: ['#fff', '#000'],
 * });
 * ```
 */
export function useAnimatedValue(initialValue: number): AnimatedValue {
  const [value, setValue] = useState(initialValue);
  const animationRef = useRef<number | null>(null);
  const currentValueRef = useRef(initialValue);

  // Cancel any running animation
  const cancelAnimation = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Set value with animation
  const set = useCallback(
    (target: number, options: AnimationOptions = {}) => {
      const { duration = 'normal', easing = 'easeOut', delay = 0 } = options;
      const durationMs = resolveDuration(duration);
      const easingCss = resolveEasing(easing);
      const bezier = getEasingBezier(easingCss);

      cancelAnimation();

      const startValue = currentValueRef.current;
      const startTime = performance.now() + delay;

      const animate = (currentTime: number) => {
        if (currentTime < startTime) {
          animationRef.current = requestAnimationFrame(animate);
          return;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const easedProgress = bezierEval(progress, bezier[0], bezier[1], bezier[2], bezier[3]);
        const newValue = startValue + (target - startValue) * easedProgress;

        currentValueRef.current = newValue;
        setValue(newValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          animationRef.current = null;
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    },
    [cancelAnimation]
  );

  // Set value immediately without animation
  const setImmediate = useCallback(
    (target: number) => {
      cancelAnimation();
      currentValueRef.current = target;
      setValue(target);
    },
    [cancelAnimation]
  );

  // Interpolate value to another range
  const interpolate = useCallback(
    <T extends string | number>(config: InterpolationConfig<T>): T => {
      const { inputRange, outputRange, extrapolate = 'extend' } = config;
      const extrapolateLeft = config.extrapolateLeft ?? extrapolate;
      const extrapolateRight = config.extrapolateRight ?? extrapolate;

      // Find the segment
      let i = 0;
      for (; i < inputRange.length - 1; i++) {
        if (value < inputRange[i + 1]) break;
      }
      i = Math.min(i, inputRange.length - 2);

      const inputMin = inputRange[i];
      const inputMax = inputRange[i + 1];
      const outputMin = outputRange[i];
      const outputMax = outputRange[i + 1];

      let ratio = (value - inputMin) / (inputMax - inputMin);

      // Handle extrapolation
      if (value < inputRange[0]) {
        if (extrapolateLeft === 'clamp') {
          return outputRange[0];
        } else if (extrapolateLeft === 'identity') {
          return value as T;
        }
      } else if (value > inputRange[inputRange.length - 1]) {
        if (extrapolateRight === 'clamp') {
          return outputRange[outputRange.length - 1];
        } else if (extrapolateRight === 'identity') {
          return value as T;
        }
      }

      // Handle color interpolation
      if (typeof outputMin === 'string' && typeof outputMax === 'string') {
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
        // For other strings, just return based on threshold
        return ratio < 0.5 ? outputMin : outputMax;
      }

      // Numeric interpolation
      return ((outputMin as number) + ((outputMax as number) - (outputMin as number)) * ratio) as T;
    },
    [value]
  );

  return useMemo(
    () => ({
      get value() {
        return currentValueRef.current;
      },
      set,
      setImmediate,
      interpolate,
    }),
    [set, setImmediate, interpolate]
  );
}
