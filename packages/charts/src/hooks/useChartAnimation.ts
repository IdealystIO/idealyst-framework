/**
 * useChartAnimation - Chart Animation Hook
 *
 * Provides entrance and transition animations for chart elements.
 * Uses requestAnimationFrame for smooth web animations.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

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
  /** Current animation progress (0-1) */
  progress: number;
  /** Whether animation is currently running */
  isAnimating: boolean;
  /** Trigger a new animation */
  animate: (config?: Partial<ChartAnimationConfig>) => void;
  /** Reset animation to start */
  reset: () => void;
}

// Easing functions
const easingFunctions = {
  linear: (t: number) => t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeIn: (t: number) => Math.pow(t, 3),
  easeInOut: (t: number) =>
    t < 0.5 ? 4 * Math.pow(t, 3) : 1 - Math.pow(-2 * t + 2, 3) / 2,
  spring: (t: number) => {
    // Simple spring approximation
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

/**
 * Hook for animating chart entrance and data transitions.
 *
 * @example
 * ```tsx
 * const { progress, isAnimating } = useChartAnimation({
 *   enabled: animate,
 *   duration: 750,
 *   easing: 'easeOut',
 * });
 *
 * // Use progress for path draw animation
 * <Path
 *   strokeDasharray={[pathLength, pathLength]}
 *   strokeDashoffset={pathLength * (1 - progress)}
 * />
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

  const [progress, setProgress] = useState(enabled ? 0 : 1);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const hasAnimatedRef = useRef(false);

  // Calculate effective duration (shorter for updates)
  const effectiveDuration = isUpdate ? Math.min(duration, 300) : duration;

  // Cancel any running animation
  const cancelAnimation = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);
  }, []);

  // Run animation
  const runAnimation = useCallback(
    (targetDuration: number, targetEasing: keyof typeof easingFunctions) => {
      cancelAnimation();
      setIsAnimating(true);
      startTimeRef.current = 0;

      const easingFn = easingFunctions[targetEasing];

      const tick = (timestamp: number) => {
        if (startTimeRef.current === 0) {
          startTimeRef.current = timestamp + delay;
        }

        const elapsed = timestamp - startTimeRef.current;

        if (elapsed < 0) {
          // Still in delay period
          animationRef.current = requestAnimationFrame(tick);
          return;
        }

        const rawProgress = Math.min(elapsed / targetDuration, 1);
        const easedProgress = easingFn(rawProgress);

        setProgress(easedProgress);

        if (rawProgress < 1) {
          animationRef.current = requestAnimationFrame(tick);
        } else {
          animationRef.current = null;
          setIsAnimating(false);
        }
      };

      animationRef.current = requestAnimationFrame(tick);
    },
    [cancelAnimation, delay]
  );

  // Trigger animation manually
  const animate = useCallback(
    (overrides: Partial<ChartAnimationConfig> = {}) => {
      const targetDuration = overrides.duration ?? effectiveDuration;
      const targetEasing = overrides.easing ?? easing;
      setProgress(0);
      runAnimation(targetDuration, targetEasing);
    },
    [effectiveDuration, easing, runAnimation]
  );

  // Reset to start state
  const reset = useCallback(() => {
    cancelAnimation();
    setProgress(0);
    hasAnimatedRef.current = false;
  }, [cancelAnimation]);

  // Run entrance animation on mount
  useEffect(() => {
    if (enabled && !hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      runAnimation(effectiveDuration, easing);
    } else if (!enabled) {
      setProgress(1);
    }

    return () => {
      cancelAnimation();
    };
  }, [enabled, effectiveDuration, easing, runAnimation, cancelAnimation]);

  return {
    progress,
    isAnimating,
    animate,
    reset,
  };
}

/**
 * Hook for staggered animations (e.g., bar charts)
 *
 * @example
 * ```tsx
 * const { getItemProgress } = useStaggeredAnimation({
 *   enabled: animate,
 *   itemCount: bars.length,
 *   staggerDelay: 50,
 * });
 *
 * // Each bar animates with a stagger
 * bars.map((bar, index) => (
 *   <Rect
 *     height={bar.height * getItemProgress(index)}
 *   />
 * ))
 * ```
 */
export interface StaggeredAnimationConfig extends ChartAnimationConfig {
  /** Number of items to animate */
  itemCount: number;
  /** Delay between each item in ms */
  staggerDelay?: number;
  /** Maximum total stagger duration */
  maxStaggerDuration?: number;
}

export interface StaggeredAnimationState {
  /** Get progress for a specific item (0-1) */
  getItemProgress: (index: number) => number;
  /** Overall animation progress */
  progress: number;
  /** Whether any animation is running */
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

  // Calculate actual stagger delay to fit within max duration
  const effectiveStagger = Math.min(
    staggerDelay,
    itemCount > 1 ? maxStaggerDuration / (itemCount - 1) : 0
  );

  // Total animation time including all staggers
  const totalDuration = duration + effectiveStagger * Math.max(0, itemCount - 1);

  const [progress, setProgress] = useState(enabled ? 0 : 1);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const easingFn = easingFunctions[easing];

  // Get progress for a specific item
  const getItemProgress = useCallback(
    (index: number): number => {
      if (!enabled || progress >= 1) return 1;
      if (progress === 0) return 0;

      // Calculate when this item starts and ends
      const itemStartTime = effectiveStagger * index;
      const itemEndTime = itemStartTime + duration;

      // Convert overall progress to elapsed time
      const elapsed = progress * totalDuration;

      if (elapsed < itemStartTime) return 0;
      if (elapsed >= itemEndTime) return 1;

      const itemProgress = (elapsed - itemStartTime) / duration;
      return easingFn(Math.min(1, Math.max(0, itemProgress)));
    },
    [enabled, progress, effectiveStagger, duration, totalDuration, easingFn]
  );

  // Run animation on mount
  useEffect(() => {
    if (!enabled) {
      setProgress(1);
      return;
    }

    setIsAnimating(true);
    startTimeRef.current = 0;

    const tick = (timestamp: number) => {
      if (startTimeRef.current === 0) {
        startTimeRef.current = timestamp + delay;
      }

      const elapsed = timestamp - startTimeRef.current;

      if (elapsed < 0) {
        animationRef.current = requestAnimationFrame(tick);
        return;
      }

      const rawProgress = Math.min(elapsed / totalDuration, 1);
      setProgress(rawProgress);

      if (rawProgress < 1) {
        animationRef.current = requestAnimationFrame(tick);
      } else {
        animationRef.current = null;
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, totalDuration, delay]);

  return {
    getItemProgress,
    progress,
    isAnimating,
  };
}

export default useChartAnimation;
