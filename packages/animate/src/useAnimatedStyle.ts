/**
 * useAnimatedStyle - Web implementation
 *
 * Creates an animated style that transitions when properties change.
 * Uses CSS transitions for smooth, performant animations.
 *
 * For spring easings, automatically converts to CSS approximations
 * with calculated durations that match the spring's settling time.
 */

import { useMemo } from 'react';
import {
  resolveDuration,
  resolveEasingWithDuration,
} from '@idealyst/theme/animation';
import type {
  AnimatableProperties,
  UseAnimatedStyleOptions,
  AnimatableStyle,
  TransformProperty,
} from './types';
import { isTransformObject, normalizeTransform } from './normalizeTransform';

/**
 * Hook that returns an animated style object.
 * When the style properties change, they animate smoothly using CSS transitions.
 *
 * @param style - The target style properties
 * @param options - Animation configuration
 * @returns Animated style object to spread onto a component
 *
 * @example
 * ```tsx
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
 * return <div style={style}>Content</div>;
 * ```
 */
export function useAnimatedStyle(
  style: AnimatableProperties,
  options: UseAnimatedStyleOptions = {}
): AnimatableStyle {
  const { duration = 'normal', easing = 'easeOut', delay = 0, web } = options;

  // Use web-specific options if provided
  const finalDuration = web?.duration ?? duration;
  const finalEasing = web?.easing ?? easing;
  const finalDelay = web?.delay ?? delay;

  // Normalize transform to array format if using object syntax
  const normalizedTransform = useMemo((): TransformProperty[] | undefined => {
    if (!style.transform) return undefined;
    if (isTransformObject(style.transform)) {
      return normalizeTransform(style.transform);
    }
    return style.transform;
  }, [style.transform]);

  // Convert transform array to CSS transform string
  const transformString = useMemo(() => {
    if (!normalizedTransform) {
      return undefined;
    }

    return normalizedTransform
      .map((t) => {
        const [key, value] = Object.entries(t)[0];
        // Handle different transform types
        switch (key) {
          case 'translateX':
          case 'translateY':
            return `${key}(${typeof value === 'number' ? `${value}px` : value})`;
          case 'rotate':
          case 'rotateX':
          case 'rotateY':
          case 'rotateZ':
          case 'skewX':
          case 'skewY':
            return `${key}(${value})`;
          case 'scale':
          case 'scaleX':
          case 'scaleY':
          case 'perspective':
            return `${key}(${value})`;
          default:
            return `${key}(${value})`;
        }
      })
      .join(' ');
  }, [normalizedTransform]);

  // Build the transition string - use 'all' for simplicity and to catch any property
  const transition = useMemo(() => {
    // Use custom transition if provided
    if (web?.transition) {
      return web.transition;
    }

    const baseDuration = resolveDuration(finalDuration);

    // For spring easings, resolveEasingWithDuration calculates the optimal
    // duration based on the spring's settling time, giving better approximation
    const { css: easingCss, duration: durationMs } = resolveEasingWithDuration(
      finalEasing,
      baseDuration
    );

    const delayStr = finalDelay > 0 ? ` ${finalDelay}ms` : '';

    // Use 'all' to animate any property that changes
    // This is simpler and catches properties we might not explicitly list
    return `all ${durationMs}ms ${easingCss}${delayStr}`;
  }, [finalDuration, finalEasing, finalDelay, web?.transition]);

  // Build the final style object
  const animatedStyle = useMemo(() => {
    const result: Record<string, any> = {};

    // Copy all style properties except transform
    Object.entries(style).forEach(([key, value]) => {
      if (key !== 'transform' && value !== undefined) {
        result[key] = value;
      }
    });

    // Add transform string
    if (transformString) {
      result.transform = transformString;
    }

    // Always include transition - CSS handles the timing correctly
    // The transition property must be present BEFORE values change for animation to work
    if (transition) {
      result.transition = transition;
    }

    return result as AnimatableStyle;
  }, [style, transformString, transition]);

  return animatedStyle;
}
