/**
 * useAnimatedStyle - Web implementation
 *
 * Creates an animated style that transitions when properties change.
 * Uses CSS transitions for smooth, performant animations.
 */

import { useMemo, useRef, useEffect } from 'react';
import { cssTransition, resolveDuration, resolveEasing } from '@idealyst/theme/animation';
import type { AnimatableProperties, UseAnimatedStyleOptions, AnimatableStyle } from './types';

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
 * const style = useAnimatedStyle({
 *   opacity: isVisible ? 1 : 0,
 *   transform: [{ translateY: isVisible ? 0 : 20 }],
 * }, {
 *   duration: 'normal',
 *   easing: 'easeOut',
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

  // Track if this is the initial render
  const isInitialRender = useRef(true);

  useEffect(() => {
    isInitialRender.current = false;
  }, []);

  // Convert transform array to CSS transform string
  const transformString = useMemo(() => {
    if (!style.transform || !Array.isArray(style.transform)) {
      return undefined;
    }

    return style.transform
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
  }, [style.transform]);

  // Build the transition string
  const transition = useMemo(() => {
    // Use custom transition if provided
    if (web?.transition) {
      return web.transition;
    }

    // Get all animatable property names from the style
    const properties = Object.keys(style).filter((key) => key !== 'transform');
    if (style.transform) {
      properties.push('transform');
    }

    if (properties.length === 0) {
      return undefined;
    }

    // Map RN property names to CSS property names
    const cssProperties = properties.map((prop) => {
      switch (prop) {
        case 'backgroundColor':
          return 'background-color';
        case 'borderColor':
          return 'border-color';
        case 'borderWidth':
          return 'border-width';
        case 'borderRadius':
          return 'border-radius';
        case 'borderTopLeftRadius':
          return 'border-top-left-radius';
        case 'borderTopRightRadius':
          return 'border-top-right-radius';
        case 'borderBottomLeftRadius':
          return 'border-bottom-left-radius';
        case 'borderBottomRightRadius':
          return 'border-bottom-right-radius';
        case 'maxHeight':
          return 'max-height';
        case 'maxWidth':
          return 'max-width';
        case 'minHeight':
          return 'min-height';
        case 'minWidth':
          return 'min-width';
        default:
          return prop;
      }
    });

    const durationMs = resolveDuration(finalDuration);
    const easingCss = resolveEasing(finalEasing);
    const delayStr = finalDelay > 0 ? ` ${finalDelay}ms` : '';

    return cssProperties.map((prop) => `${prop} ${durationMs}ms ${easingCss}${delayStr}`).join(', ');
  }, [style, finalDuration, finalEasing, finalDelay, web?.transition]);

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

    // Add transition (skip on initial render to avoid animation on mount)
    if (transition && !isInitialRender.current) {
      result.transition = transition;
    }

    return result as AnimatableStyle;
  }, [style, transformString, transition]);

  return animatedStyle;
}
