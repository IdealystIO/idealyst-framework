/**
 * usePresence - Native implementation
 *
 * Manages mount/unmount animations using Reanimated.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { timingConfig, springConfig, isSpringEasing, resolveDuration } from '@idealyst/theme/animation';
import type {
  UsePresenceOptions,
  UsePresenceResult,
  AnimatableStyle,
  AnimatableProperties,
  TransformProperty,
} from './types';
import { isTransformObject, normalizeTransform } from './normalizeTransform';

/**
 * Hook that manages presence animations for mount/unmount.
 * The element stays rendered during exit animation.
 *
 * @param isVisible - Whether the element should be visible
 * @param options - Animation configuration with enter/exit styles
 * @returns Object with isPresent, style, and exit function
 *
 * @example
 * ```tsx
 * import Animated from 'react-native-reanimated';
 *
 * const { isPresent, style } = usePresence(isOpen, {
 *   enter: { opacity: 1, transform: [{ translateY: 0 }] },
 *   exit: { opacity: 0, transform: [{ translateY: -20 }] },
 *   duration: 'normal',
 * });
 *
 * return isPresent && <Animated.View style={style}>Content</Animated.View>;
 * ```
 */
export function usePresence(isVisible: boolean, options: UsePresenceOptions): UsePresenceResult {
  const { enter, exit, initial, duration = 'normal', easing = 'easeOut', delay = 0 } = options;

  // Track whether the element should be in the DOM
  const [isPresent, setIsPresent] = useState(isVisible);
  // Track initial mount
  const isInitialMount = useRef(true);

  const durationMs = resolveDuration(duration);
  const useSpring = isSpringEasing(easing);

  // Shared value for animation progress (0 = exit, 1 = enter)
  const progress = useSharedValue(isVisible ? 1 : 0);

  // Extract values from enter/exit styles
  const enterOpacity = enter.opacity ?? 1;
  const exitOpacity = exit.opacity ?? 0;
  const initialOpacity = initial?.opacity ?? exitOpacity;

  // Normalize transforms to array format
  const normalizedEnterTransform = useMemo((): TransformProperty[] => {
    if (!enter.transform) return [];
    return isTransformObject(enter.transform)
      ? normalizeTransform(enter.transform)
      : enter.transform;
  }, [enter.transform]);

  const normalizedExitTransform = useMemo((): TransformProperty[] => {
    if (!exit.transform) return [];
    return isTransformObject(exit.transform)
      ? normalizeTransform(exit.transform)
      : exit.transform;
  }, [exit.transform]);

  // Extract transform values from normalized arrays
  const getTransformValue = (
    transforms: TransformProperty[],
    key: string,
    defaultValue: number | string
  ) => {
    const transform = transforms.find((t) => key in t);
    return transform ? (transform as any)[key] : defaultValue;
  };

  const enterTranslateY = getTransformValue(normalizedEnterTransform, 'translateY', 0) as number;
  const exitTranslateY = getTransformValue(normalizedExitTransform, 'translateY', 0) as number;
  const enterTranslateX = getTransformValue(normalizedEnterTransform, 'translateX', 0) as number;
  const exitTranslateX = getTransformValue(normalizedExitTransform, 'translateX', 0) as number;
  const enterScale = getTransformValue(normalizedEnterTransform, 'scale', 1) as number;
  const exitScale = getTransformValue(normalizedExitTransform, 'scale', 1) as number;

  // Animation helper
  const animateTo = useCallback(
    (target: number, onComplete?: () => void) => {
      'worklet';
      const withCallback = (animation: any) => {
        if (onComplete) {
          return {
            ...animation,
            callback: (finished: boolean) => {
              if (finished) {
                runOnJS(onComplete)();
              }
            },
          };
        }
        return animation;
      };

      if (useSpring) {
        const config = springConfig(easing as any);
        return delay > 0
          ? withDelay(delay, withSpring(target, config, onComplete ? (finished) => finished && runOnJS(onComplete)() : undefined))
          : withSpring(target, config, onComplete ? (finished) => finished && runOnJS(onComplete)() : undefined);
      } else {
        const config = timingConfig(duration, easing);
        const timingOptions = {
          duration: config.duration,
          easing: Easing.bezier(config.easing[0], config.easing[1], config.easing[2], config.easing[3]),
        };
        return delay > 0
          ? withDelay(delay, withTiming(target, timingOptions, onComplete ? (finished) => finished && runOnJS(onComplete)() : undefined))
          : withTiming(target, timingOptions, onComplete ? (finished) => finished && runOnJS(onComplete)() : undefined);
      }
    },
    [useSpring, easing, duration, delay]
  );

  // Handle visibility changes
  useEffect(() => {
    if (isVisible) {
      // Entering: mount first, then animate
      setIsPresent(true);
      progress.value = animateTo(1);
    } else if (!isInitialMount.current) {
      // Exiting: animate, then unmount
      progress.value = animateTo(0, () => {
        setIsPresent(false);
      });
    }

    isInitialMount.current = false;
  }, [isVisible]);

  // Manual exit trigger
  const triggerExit = useCallback(() => {
    progress.value = animateTo(0, () => {
      setIsPresent(false);
    });
  }, [animateTo]);

  // Animated style
  const style = useAnimatedStyle(() => {
    const p = progress.value;

    return {
      opacity: exitOpacity + (enterOpacity - exitOpacity) * p,
      transform: [
        { translateX: exitTranslateX + (enterTranslateX - exitTranslateX) * p },
        { translateY: exitTranslateY + (enterTranslateY - exitTranslateY) * p },
        { scale: exitScale + (enterScale - exitScale) * p },
      ],
    };
  });

  return {
    isPresent,
    style: style as AnimatableStyle,
    exit: triggerExit,
  };
}
