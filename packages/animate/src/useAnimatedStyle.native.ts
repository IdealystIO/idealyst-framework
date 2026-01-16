/**
 * useAnimatedStyle - Native implementation
 *
 * Creates an animated style using Reanimated.
 * Uses either timing or spring animations based on configuration.
 */

import { useEffect, useMemo } from 'react';
import {
  useSharedValue,
  useAnimatedStyle as useReanimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { timingConfig, springConfig, isSpringEasing } from '@idealyst/theme/animation';
import type { AnimatableProperties, UseAnimatedStyleOptions, AnimatableStyle } from './types';

/**
 * Hook that returns an animated style object.
 * When the style properties change, they animate smoothly using Reanimated.
 *
 * @param style - The target style properties
 * @param options - Animation configuration
 * @returns Animated style object to spread onto an Animated component
 *
 * @example
 * ```tsx
 * import Animated from 'react-native-reanimated';
 *
 * const style = useAnimatedStyle({
 *   opacity: isVisible ? 1 : 0,
 *   transform: [{ translateY: isVisible ? 0 : 20 }],
 * }, {
 *   duration: 'normal',
 *   easing: 'easeOut',
 * });
 *
 * return <Animated.View style={style}>Content</Animated.View>;
 * ```
 */
export function useAnimatedStyle(
  style: AnimatableProperties,
  options: UseAnimatedStyleOptions = {}
): AnimatableStyle {
  const { duration = 'normal', easing = 'easeOut', delay = 0, native } = options;

  // Use native-specific options if provided
  const finalDuration = native?.duration ?? duration;
  const finalEasing = native?.easing ?? easing;
  const finalDelay = native?.delay ?? delay;
  const useSpring = native?.useSpring ?? isSpringEasing(finalEasing);
  const springType = native?.springType ?? (isSpringEasing(finalEasing) ? finalEasing : 'spring');

  // Create shared values for each animatable property
  const opacity = useSharedValue(style.opacity ?? 1);
  const backgroundColor = useSharedValue(style.backgroundColor ?? 'transparent');
  const borderColor = useSharedValue(style.borderColor ?? 'transparent');
  const borderWidth = useSharedValue(style.borderWidth ?? 0);
  const borderRadius = useSharedValue(style.borderRadius ?? 0);

  // Transform values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const rotate = useSharedValue('0deg');

  // Extract transform values from style
  const transforms = useMemo(() => {
    const result = {
      translateX: 0,
      translateY: 0,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      rotate: '0deg',
    };

    if (style.transform) {
      style.transform.forEach((t) => {
        const [key, value] = Object.entries(t)[0];
        if (key in result) {
          (result as any)[key] = value;
        }
      });
    }

    return result;
  }, [style.transform]);

  // Animate function
  const animate = (sharedValue: any, targetValue: any, isString = false) => {
    'worklet';
    if (useSpring && !isString) {
      const config = springConfig(springType as any);
      return finalDelay > 0
        ? withDelay(finalDelay, withSpring(targetValue, config))
        : withSpring(targetValue, config);
    } else {
      const config = timingConfig(finalDuration, finalEasing);
      const timingOptions = {
        duration: config.duration,
        easing: Easing.bezier(config.easing[0], config.easing[1], config.easing[2], config.easing[3]),
      };
      return finalDelay > 0
        ? withDelay(finalDelay, withTiming(targetValue, timingOptions))
        : withTiming(targetValue, timingOptions);
    }
  };

  // Update shared values when style changes
  useEffect(() => {
    if (style.opacity !== undefined) {
      opacity.value = animate(opacity, style.opacity);
    }
    if (style.backgroundColor !== undefined) {
      backgroundColor.value = animate(backgroundColor, style.backgroundColor, true);
    }
    if (style.borderColor !== undefined) {
      borderColor.value = animate(borderColor, style.borderColor, true);
    }
    if (style.borderWidth !== undefined) {
      borderWidth.value = animate(borderWidth, style.borderWidth);
    }
    if (style.borderRadius !== undefined) {
      borderRadius.value = animate(borderRadius, style.borderRadius);
    }

    // Update transform values
    translateX.value = animate(translateX, transforms.translateX);
    translateY.value = animate(translateY, transforms.translateY);
    scale.value = animate(scale, transforms.scale);
    scaleX.value = animate(scaleX, transforms.scaleX);
    scaleY.value = animate(scaleY, transforms.scaleY);
    rotate.value = animate(rotate, transforms.rotate, true);
  }, [
    style.opacity,
    style.backgroundColor,
    style.borderColor,
    style.borderWidth,
    style.borderRadius,
    transforms,
  ]);

  // Create animated style
  const animatedStyle = useReanimatedStyle(() => {
    return {
      opacity: opacity.value,
      backgroundColor: backgroundColor.value,
      borderColor: borderColor.value,
      borderWidth: borderWidth.value,
      borderRadius: borderRadius.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { scaleX: scaleX.value },
        { scaleY: scaleY.value },
        { rotate: rotate.value },
      ],
    };
  });

  return animatedStyle as AnimatableStyle;
}
