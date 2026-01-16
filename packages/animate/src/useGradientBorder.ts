/**
 * useGradientBorder - Web implementation
 *
 * Creates animated gradient border effects using CSS @property
 * and conic gradients for performant animations.
 */

import { useMemo, useEffect, useRef } from 'react';
import { resolveDuration, injectGradientCSS } from '@idealyst/theme/animation';
import type { UseGradientBorderOptions, UseGradientBorderResult, AnimatableStyle } from './types';

/**
 * Hook that creates an animated gradient border effect.
 * Uses CSS @property for smooth, GPU-accelerated gradient animations.
 *
 * @param options - Configuration for the gradient border
 * @returns Container and content styles to apply
 *
 * @example
 * ```tsx
 * const { containerStyle, contentStyle, isReady } = useGradientBorder({
 *   colors: ['#3b82f6', '#8b5cf6', '#ec4899'],
 *   borderWidth: 2,
 *   borderRadius: 8,
 *   animation: 'spin',
 *   duration: 2000,
 * });
 *
 * return (
 *   <div style={containerStyle}>
 *     <div style={contentStyle}>
 *       Content here
 *     </div>
 *   </div>
 * );
 * ```
 */
export function useGradientBorder(options: UseGradientBorderOptions): UseGradientBorderResult {
  const {
    colors,
    borderWidth = 2,
    borderRadius = 8,
    duration = 2000,
    animation = 'spin',
    active = true,
  } = options;

  const isReady = useRef(false);
  const durationMs = resolveDuration(duration);

  // Inject gradient CSS on first use
  useEffect(() => {
    injectGradientCSS();
    isReady.current = true;
  }, []);

  // Generate the color string for conic gradient
  const colorString = useMemo(() => {
    // For spinning gradient, distribute colors evenly
    if (animation === 'spin') {
      return colors.join(', ');
    }
    // For pulse/wave, use linear gradient
    return colors.join(', ');
  }, [colors, animation]);

  // Container style (the gradient background)
  const containerStyle = useMemo<AnimatableStyle>(() => {
    const baseStyle: Record<string, any> = {
      position: 'relative',
      padding: borderWidth,
      borderRadius: borderRadius + borderWidth,
      overflow: 'hidden',
    };

    if (!active) {
      // When inactive, show a solid border color
      baseStyle.background = colors[0];
      return baseStyle as AnimatableStyle;
    }

    switch (animation) {
      case 'spin':
        return {
          ...baseStyle,
          background: `conic-gradient(from var(--gradient-angle, 0deg), ${colorString})`,
          animation: `spin-gradient ${durationMs}ms linear infinite`,
        } as AnimatableStyle;

      case 'pulse':
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${colorString})`,
          animation: `pulse-gradient ${durationMs}ms ease-in-out infinite`,
        } as AnimatableStyle;

      case 'wave':
        // Wave uses a moving gradient position
        return {
          ...baseStyle,
          background: `linear-gradient(
            90deg,
            ${colors[0]} var(--gradient-position, 0%),
            ${colors[colors.length - 1]} calc(var(--gradient-position, 0%) + 50%),
            ${colors[0]} calc(var(--gradient-position, 0%) + 100%)
          )`,
          backgroundSize: '200% 100%',
          animation: `wave-gradient ${durationMs}ms ease-in-out infinite`,
        } as AnimatableStyle;

      default:
        return baseStyle as AnimatableStyle;
    }
  }, [colors, colorString, borderWidth, borderRadius, durationMs, animation, active]);

  // Content style (the inner container with solid background)
  const contentStyle = useMemo<AnimatableStyle>(() => {
    return {
      borderRadius,
      backgroundColor: 'inherit',
      // Ensure content fills the container minus the border
      width: '100%',
      height: '100%',
    } as AnimatableStyle;
  }, [borderRadius]);

  return {
    containerStyle,
    contentStyle,
    isReady: isReady.current,
  };
}

/**
 * Utility to create inline gradient border styles without the hook.
 * Useful for static gradient borders or server-side rendering.
 *
 * Note: You must call injectGradientCSS() somewhere in your app for animations to work.
 */
export function createGradientBorderStyle(
  colors: string[],
  borderWidth: number = 2,
  borderRadius: number = 8,
  animation: 'spin' | 'pulse' | 'wave' = 'spin',
  durationMs: number = 2000
): { container: Record<string, any>; content: Record<string, any> } {
  const colorString = colors.join(', ');

  const container: Record<string, any> = {
    position: 'relative',
    padding: borderWidth,
    borderRadius: borderRadius + borderWidth,
    overflow: 'hidden',
  };

  switch (animation) {
    case 'spin':
      container.background = `conic-gradient(from var(--gradient-angle, 0deg), ${colorString})`;
      container.animation = `spin-gradient ${durationMs}ms linear infinite`;
      break;
    case 'pulse':
      container.background = `linear-gradient(135deg, ${colorString})`;
      container.animation = `pulse-gradient ${durationMs}ms ease-in-out infinite`;
      break;
    case 'wave':
      container.background = `linear-gradient(90deg, ${colors[0]}, ${colors[colors.length - 1]}, ${colors[0]})`;
      container.backgroundSize = '200% 100%';
      container.animation = `wave-gradient ${durationMs}ms ease-in-out infinite`;
      break;
  }

  const content = {
    borderRadius,
    backgroundColor: 'inherit',
    width: '100%',
    height: '100%',
  };

  return { container, content };
}
