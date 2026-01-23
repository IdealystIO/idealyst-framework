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
import type {
  AnimatableProperties,
  UseAnimatedStyleOptions,
  AnimatableStyle,
  TransformProperty,
} from './types';
import { isTransformObject, normalizeTransform } from './normalizeTransform';

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
 * // New object syntax (recommended)
 * const style = useAnimatedStyle({
 *   opacity: isVisible ? 1 : 0,
 *   transform: { y: isVisible ? 0 : 20 },
 * }, {
 *   duration: 'normal',
 *   easing: 'easeOut',
 * });
 *
 * // Legacy array syntax (still supported)
 * const legacyStyle = useAnimatedStyle({
 *   opacity: isVisible ? 1 : 0,
 *   transform: [{ translateY: isVisible ? 0 : 20 }],
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

  // Normalize transform to array format if using object syntax
  const normalizedTransform = useMemo((): TransformProperty[] | undefined => {
    if (!style.transform) return undefined;
    if (isTransformObject(style.transform)) {
      return normalizeTransform(style.transform);
    }
    return style.transform;
  }, [style.transform]);

  // Create shared values for each animatable property
  const opacity = useSharedValue(style.opacity ?? 1);
  const backgroundColor = useSharedValue(style.backgroundColor ?? 'transparent');
  const borderColor = useSharedValue(style.borderColor ?? 'transparent');
  const borderWidth = useSharedValue(style.borderWidth ?? 0);
  const borderRadius = useSharedValue(style.borderRadius ?? 0);

  // Layout properties
  const top = useSharedValue(style.top ?? 0);
  const right = useSharedValue(style.right ?? 0);
  const bottom = useSharedValue(style.bottom ?? 0);
  const left = useSharedValue(style.left ?? 0);
  const width = useSharedValue(style.width ?? 'auto');
  const height = useSharedValue(style.height ?? 'auto');

  // Transform values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const rotate = useSharedValue('0deg');
  const rotateX = useSharedValue('0deg');
  const rotateY = useSharedValue('0deg');
  const rotateZ = useSharedValue('0deg');
  const skewX = useSharedValue('0deg');
  const skewY = useSharedValue('0deg');
  const perspective = useSharedValue(1000);

  // Extract transform values from normalized array
  const transforms = useMemo(() => {
    const result = {
      translateX: 0,
      translateY: 0,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      rotate: '0deg',
      rotateX: '0deg',
      rotateY: '0deg',
      rotateZ: '0deg',
      skewX: '0deg',
      skewY: '0deg',
      perspective: 1000,
    };

    if (normalizedTransform) {
      normalizedTransform.forEach((t) => {
        const [key, value] = Object.entries(t)[0];
        if (key in result) {
          (result as any)[key] = value;
        }
      });
    }

    return result;
  }, [normalizedTransform]);

  // Create animation wrapper - called from JS thread, returns animation modifier
  const animate = (targetValue: any, isString = false) => {
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
    // Visual properties
    if (style.opacity !== undefined) {
      opacity.value = animate(style.opacity);
    }
    if (style.backgroundColor !== undefined) {
      backgroundColor.value = animate(style.backgroundColor, true);
    }
    if (style.borderColor !== undefined) {
      borderColor.value = animate(style.borderColor, true);
    }
    if (style.borderWidth !== undefined) {
      borderWidth.value = animate(style.borderWidth);
    }
    if (style.borderRadius !== undefined) {
      borderRadius.value = animate(style.borderRadius);
    }

    // Layout properties
    if (style.top !== undefined) {
      top.value = animate(style.top);
    }
    if (style.right !== undefined) {
      right.value = animate(style.right);
    }
    if (style.bottom !== undefined) {
      bottom.value = animate(style.bottom);
    }
    if (style.left !== undefined) {
      left.value = animate(style.left);
    }
    if (style.width !== undefined) {
      width.value = animate(style.width);
    }
    if (style.height !== undefined) {
      height.value = animate(style.height);
    }

    // Update transform values
    translateX.value = animate(transforms.translateX);
    translateY.value = animate(transforms.translateY);
    scale.value = animate(transforms.scale);
    scaleX.value = animate(transforms.scaleX);
    scaleY.value = animate(transforms.scaleY);
    rotate.value = animate(transforms.rotate, true);
    rotateX.value = animate(transforms.rotateX, true);
    rotateY.value = animate(transforms.rotateY, true);
    rotateZ.value = animate(transforms.rotateZ, true);
    skewX.value = animate(transforms.skewX, true);
    skewY.value = animate(transforms.skewY, true);
    perspective.value = animate(transforms.perspective);
  }, [
    style.opacity,
    style.backgroundColor,
    style.borderColor,
    style.borderWidth,
    style.borderRadius,
    style.top,
    style.right,
    style.bottom,
    style.left,
    style.width,
    style.height,
    transforms,
  ]);

  // Create animated style - only include properties that were specified
  const animatedStyle = useReanimatedStyle(() => {
    'worklet';
    const result: Record<string, any> = {
      opacity: opacity.value,
      backgroundColor: backgroundColor.value,
      borderColor: borderColor.value,
      borderWidth: borderWidth.value,
      borderRadius: borderRadius.value,
      transform: [
        { perspective: perspective.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { scaleX: scaleX.value },
        { scaleY: scaleY.value },
        { rotate: rotate.value },
        { rotateX: rotateX.value },
        { rotateY: rotateY.value },
        { rotateZ: rotateZ.value },
        { skewX: skewX.value },
        { skewY: skewY.value },
      ],
    };

    // Only include layout properties if they were specified (avoid overriding with defaults)
    if (style.top !== undefined) result.top = top.value;
    if (style.right !== undefined) result.right = right.value;
    if (style.bottom !== undefined) result.bottom = bottom.value;
    if (style.left !== undefined) result.left = left.value;
    if (style.width !== undefined) result.width = width.value;
    if (style.height !== undefined) result.height = height.value;

    return result;
  });

  return animatedStyle as AnimatableStyle;
}
