/**
 * useChartAnimation - Native Animation Hook
 *
 * Uses Reanimated for smooth 60fps animations on native platforms.
 */

import { useEffect, useCallback } from 'react';
import {
  useSharedValue,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  runOnJS,
  cancelAnimation,
} from 'react-native-reanimated';

export interface ChartAnimationConfig {
  /** Whether animation is enabled */
  enabled?: boolean;
  /** Animation duration in ms */
  duration?: number;
  /** Animation delay in ms */
  delay?: number;
  /** Easing function */
  easing?: 'linear' | 'easeOut' | 'easeIn' | 'easeInOut' | 'spring';
  /** Whether this is a data update (shorter duration) */
  isUpdate?: boolean;
}

export interface ChartAnimationState {
  /** Current animation progress (0-1) - shared value for Reanimated */
  progress: number;
  /** Whether animation is currently running */
  isAnimating: boolean;
  /** Trigger a new animation */
  animate: (config?: Partial<ChartAnimationConfig>) => void;
  /** Reset animation to start */
  reset: () => void;
}

// Map easing names to Reanimated easings
const getReanimatedEasing = (easing: ChartAnimationConfig['easing']) => {
  switch (easing) {
    case 'linear':
      return Easing.linear;
    case 'easeIn':
      return Easing.in(Easing.cubic);
    case 'easeOut':
      return Easing.out(Easing.cubic);
    case 'easeInOut':
      return Easing.inOut(Easing.cubic);
    default:
      return Easing.out(Easing.cubic);
  }
};

/**
 * Native implementation using Reanimated shared values.
 *
 * @example
 * ```tsx
 * const { progress } = useChartAnimation({
 *   enabled: animate,
 *   duration: 750,
 * });
 *
 * // Use in animatedProps
 * const animatedProps = useAnimatedProps(() => ({
 *   strokeDashoffset: pathLength * (1 - progress.value),
 * }));
 * ```
 */
export function useChartAnimation(
  config: ChartAnimationConfig = {}
): ChartAnimationState {
  const {
    enabled = true,
    duration = 750,
    delay = 0,
    easing = 'easeOut',
    isUpdate = false,
  } = config;

  // Shared value for Reanimated
  const progressValue = useSharedValue(enabled ? 0 : 1);
  const isAnimatingValue = useSharedValue(false);

  // Calculate effective duration
  const effectiveDuration = isUpdate ? Math.min(duration, 300) : duration;

  // Run animation
  const runAnimation = useCallback(
    (targetDuration: number, targetEasing: ChartAnimationConfig['easing']) => {
      'worklet';

      progressValue.value = 0;
      isAnimatingValue.value = true;

      if (targetEasing === 'spring') {
        progressValue.value = withDelay(
          delay,
          withSpring(1, {
            damping: 15,
            stiffness: 100,
          }, (finished) => {
            if (finished) {
              isAnimatingValue.value = false;
            }
          })
        );
      } else {
        progressValue.value = withDelay(
          delay,
          withTiming(1, {
            duration: targetDuration,
            easing: getReanimatedEasing(targetEasing),
          }, (finished) => {
            if (finished) {
              isAnimatingValue.value = false;
            }
          })
        );
      }
    },
    [delay, progressValue, isAnimatingValue]
  );

  // Trigger animation manually
  const animate = useCallback(
    (overrides: Partial<ChartAnimationConfig> = {}) => {
      const targetDuration = overrides.duration ?? effectiveDuration;
      const targetEasing = overrides.easing ?? easing;
      runAnimation(targetDuration, targetEasing);
    },
    [effectiveDuration, easing, runAnimation]
  );

  // Reset to start state
  const reset = useCallback(() => {
    cancelAnimation(progressValue);
    progressValue.value = 0;
    isAnimatingValue.value = false;
  }, [progressValue, isAnimatingValue]);

  // Run entrance animation on mount
  useEffect(() => {
    if (enabled) {
      runAnimation(effectiveDuration, easing);
    } else {
      progressValue.value = 1;
    }

    return () => {
      cancelAnimation(progressValue);
    };
  }, [enabled, effectiveDuration, easing, runAnimation, progressValue]);

  // Return a compatible interface
  // Note: For Reanimated, consumers should use progressValue directly in worklets
  return {
    get progress() {
      return progressValue.value;
    },
    get isAnimating() {
      return isAnimatingValue.value;
    },
    animate,
    reset,
  };
}

/**
 * Staggered animation for native
 */
export interface StaggeredAnimationConfig extends ChartAnimationConfig {
  itemCount: number;
  staggerDelay?: number;
  maxStaggerDuration?: number;
}

export interface StaggeredAnimationState {
  getItemProgress: (index: number) => number;
  progress: number;
  isAnimating: boolean;
}

export function useStaggeredAnimation(
  config: StaggeredAnimationConfig
): StaggeredAnimationState {
  const {
    enabled = true,
    duration = 300,
    delay = 0,
    easing = 'easeOut',
    itemCount,
    staggerDelay = 50,
    maxStaggerDuration = 500,
  } = config;

  // Calculate actual stagger delay
  const effectiveStagger = Math.min(
    staggerDelay,
    itemCount > 1 ? maxStaggerDuration / (itemCount - 1) : 0
  );

  const totalDuration = duration + effectiveStagger * Math.max(0, itemCount - 1);

  const progressValue = useSharedValue(enabled ? 0 : 1);
  const isAnimatingValue = useSharedValue(false);

  // Get progress for a specific item
  const getItemProgress = useCallback(
    (index: number): number => {
      'worklet';

      const progress = progressValue.value;
      if (!enabled || progress >= 1) return 1;
      if (progress === 0) return 0;

      const itemStartTime = effectiveStagger * index;
      const itemEndTime = itemStartTime + duration;
      const elapsed = progress * totalDuration;

      if (elapsed < itemStartTime) return 0;
      if (elapsed >= itemEndTime) return 1;

      const itemProgress = (elapsed - itemStartTime) / duration;
      // Apply easing
      return Math.pow(itemProgress, 0.5); // Simple ease-out approximation
    },
    [enabled, effectiveStagger, duration, totalDuration, progressValue]
  );

  // Run animation on mount
  useEffect(() => {
    if (!enabled) {
      progressValue.value = 1;
      return;
    }

    isAnimatingValue.value = true;
    progressValue.value = withDelay(
      delay,
      withTiming(1, {
        duration: totalDuration,
        easing: Easing.linear,
      }, (finished) => {
        if (finished) {
          isAnimatingValue.value = false;
        }
      })
    );

    return () => {
      cancelAnimation(progressValue);
    };
  }, [enabled, totalDuration, delay, progressValue, isAnimatingValue]);

  return {
    getItemProgress,
    get progress() {
      return progressValue.value;
    },
    get isAnimating() {
      return isAnimatingValue.value;
    },
  };
}

export default useChartAnimation;
