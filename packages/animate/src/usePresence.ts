/**
 * usePresence - Web implementation
 *
 * Manages mount/unmount animations by keeping elements in the DOM
 * during exit animations.
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { resolveDuration, resolveEasing } from '@idealyst/theme/animation';
import type { UsePresenceOptions, UsePresenceResult, AnimatableStyle } from './types';

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
 * const { isPresent, style } = usePresence(isOpen, {
 *   enter: { opacity: 1, transform: [{ translateY: 0 }] },
 *   exit: { opacity: 0, transform: [{ translateY: -20 }] },
 *   duration: 'normal',
 * });
 *
 * return isPresent && <div style={style}>Modal content</div>;
 * ```
 */
export function usePresence(isVisible: boolean, options: UsePresenceOptions): UsePresenceResult {
  const { enter, exit, initial, duration = 'normal', easing = 'easeOut', delay = 0 } = options;

  // Track whether the element should be in the DOM
  const [isPresent, setIsPresent] = useState(isVisible);
  // Track whether we're animating in or out
  const [isEntering, setIsEntering] = useState(false);
  // Track initial mount
  const isInitialMount = useRef(true);
  // Timeout ref for cleanup
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const durationMs = resolveDuration(duration);

  // Handle visibility changes
  useEffect(() => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (isVisible) {
      // Entering: mount immediately, then animate in
      setIsPresent(true);
      // Use double RAF to ensure DOM is ready before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsEntering(true);
        });
      });
    } else if (!isInitialMount.current) {
      // Exiting: animate out, then unmount
      setIsEntering(false);
      timeoutRef.current = setTimeout(() => {
        setIsPresent(false);
      }, durationMs + delay);
    }

    isInitialMount.current = false;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, durationMs, delay]);

  // Manual exit trigger
  const triggerExit = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsEntering(false);
    timeoutRef.current = setTimeout(() => {
      setIsPresent(false);
    }, durationMs + delay);
  }, [durationMs, delay]);

  // Convert transform array to CSS transform string
  const transformToString = (transform: any[] | undefined): string | undefined => {
    if (!transform) return undefined;

    return transform
      .map((t) => {
        const [key, value] = Object.entries(t)[0];
        switch (key) {
          case 'translateX':
          case 'translateY':
            return `${key}(${typeof value === 'number' ? `${value}px` : value})`;
          default:
            return `${key}(${value})`;
        }
      })
      .join(' ');
  };

  // Build the style object
  const style = useMemo(() => {
    const currentStyle = isEntering ? enter : (initial ?? exit);
    const easingCss = resolveEasing(easing);

    const result: Record<string, any> = {};

    // Copy style properties
    Object.entries(currentStyle).forEach(([key, value]) => {
      if (key !== 'transform' && value !== undefined) {
        result[key] = value;
      }
    });

    // Handle transform
    const transformStr = transformToString(currentStyle.transform);
    if (transformStr) {
      result.transform = transformStr;
    }

    // Add transition (always, since we want to animate both enter and exit)
    const properties = Object.keys(currentStyle)
      .filter((k) => k !== 'transform')
      .map((k) => k.replace(/([A-Z])/g, '-$1').toLowerCase());
    if (currentStyle.transform) {
      properties.push('transform');
    }

    if (properties.length > 0) {
      const delayStr = delay > 0 ? ` ${delay}ms` : '';
      result.transition = properties
        .map((prop) => `${prop} ${durationMs}ms ${easingCss}${delayStr}`)
        .join(', ');
    }

    return result as AnimatableStyle;
  }, [isEntering, enter, exit, initial, durationMs, easing, delay]);

  return {
    isPresent,
    style,
    exit: triggerExit,
  };
}
