/**
 * Web-specific animation utilities
 *
 * These utilities generate CSS transition and animation strings
 * from animation tokens for use in web stylesheets.
 */

import { durations, easings, presets } from './tokens';
import type { DurationKey, EasingKey, PresetKey } from './tokens';
import type {
  Duration,
  Keyframes,
  KeyframeAnimationConfig,
  AnimationIterations,
  AnimationDirection,
  AnimationFillMode,
} from './types';

/**
 * Resolve a duration value to milliseconds
 */
export function resolveDuration(duration: Duration): number {
  if (typeof duration === 'number') {
    return duration;
  }
  return durations[duration];
}

/**
 * Resolve an easing key to CSS string
 */
export function resolveEasing(easing: EasingKey): string {
  const easingConfig = easings[easing];
  // Spring configs don't have CSS equivalent, fall back to ease-out
  if ('damping' in easingConfig) {
    return 'ease-out';
  }
  return easingConfig.css;
}

/**
 * Generate a CSS transition string from tokens
 *
 * @param properties - CSS property or array of properties to transition
 * @param duration - Duration token key or milliseconds
 * @param easing - Easing token key
 * @returns CSS transition string
 *
 * @example
 * import { cssTransition } from '@idealyst/theme/animation';
 *
 * // Single property
 * cssTransition('opacity', 'normal', 'easeOut')
 * // => "opacity 200ms ease-out"
 *
 * // Multiple properties
 * cssTransition(['opacity', 'transform'], 'fast', 'standard')
 * // => "opacity 100ms cubic-bezier(0.4, 0, 0.2, 1), transform 100ms cubic-bezier(0.4, 0, 0.2, 1)"
 *
 * // With numeric duration
 * cssTransition('background-color', 150, 'ease')
 * // => "background-color 150ms ease"
 */
export function cssTransition(
  properties: string | string[],
  duration: Duration = 'normal',
  easing: EasingKey = 'ease'
): string {
  const props = Array.isArray(properties) ? properties : [properties];
  const durationMs = resolveDuration(duration);
  const easingValue = resolveEasing(easing);

  return props.map((prop) => `${prop} ${durationMs}ms ${easingValue}`).join(', ');
}

/**
 * Generate a CSS transition string from a preset
 *
 * @param presetName - Preset key from presets
 * @param properties - Optional CSS properties (defaults to 'all')
 * @returns CSS transition string
 *
 * @example
 * import { cssPreset } from '@idealyst/theme/animation';
 *
 * cssPreset('hover')
 * // => "all 100ms ease"
 *
 * cssPreset('fadeIn', 'opacity')
 * // => "opacity 200ms cubic-bezier(0, 0, 0.2, 1)"
 */
export function cssPreset(presetName: PresetKey, properties: string | string[] = 'all'): string {
  const preset = presets[presetName];
  return cssTransition(properties, preset.duration, preset.easing);
}

/**
 * Generate CSS @keyframes string
 *
 * @param name - Unique name for the keyframes
 * @param frames - Keyframe definitions
 * @returns CSS @keyframes string
 *
 * @example
 * import { cssKeyframes } from '@idealyst/theme/animation';
 *
 * const fadeIn = cssKeyframes('fadeIn', {
 *   '0%': { opacity: 0 },
 *   '100%': { opacity: 1 },
 * });
 * // => "@keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }"
 */
export function cssKeyframes(name: string, frames: Keyframes): string {
  const frameStrings = Object.entries(frames)
    .map(([key, styles]) => {
      const styleString = Object.entries(styles || {})
        .map(([prop, value]) => {
          // Convert camelCase to kebab-case
          const kebabProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
          return `${kebabProp}: ${value}`;
        })
        .join('; ');
      return `${key} { ${styleString}; }`;
    })
    .join(' ');

  return `@keyframes ${name} { ${frameStrings} }`;
}

/**
 * Generate CSS animation shorthand string
 *
 * @param name - Animation name (must match @keyframes name)
 * @param config - Animation configuration
 * @returns CSS animation shorthand string
 *
 * @example
 * import { cssAnimation } from '@idealyst/theme/animation';
 *
 * cssAnimation('fadeIn', { duration: 'normal', easing: 'easeOut' })
 * // => "fadeIn 200ms ease-out"
 *
 * cssAnimation('spin', { duration: 'loop', easing: 'linear', iterations: 'infinite' })
 * // => "spin 1000ms linear infinite"
 */
export function cssAnimation(name: string, config: KeyframeAnimationConfig = {}): string {
  const {
    duration = 'normal',
    easing = 'ease',
    delay = 0,
    iterations = 1,
    direction = 'normal',
    fillMode = 'none',
  } = config;

  const durationMs = resolveDuration(duration);
  const easingValue = resolveEasing(easing);

  const parts = [
    name,
    `${durationMs}ms`,
    easingValue,
    delay > 0 ? `${delay}ms` : null,
    iterations !== 1 ? iterations : null,
    direction !== 'normal' ? direction : null,
    fillMode !== 'none' ? fillMode : null,
  ].filter(Boolean);

  return parts.join(' ');
}

/**
 * CSS @property registration for animatable custom properties
 *
 * This CSS should be injected once into the document head to enable
 * smooth gradient animations using CSS custom properties.
 *
 * @example
 * // Inject in your app's entry point
 * import { gradientPropertyCSS, injectGradientCSS } from '@idealyst/theme/animation';
 *
 * // Option 1: Manual injection
 * const style = document.createElement('style');
 * style.textContent = gradientPropertyCSS;
 * document.head.appendChild(style);
 *
 * // Option 2: Use helper
 * injectGradientCSS();
 */
export const gradientPropertyCSS = `
@property --gradient-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@property --gradient-position {
  syntax: '<percentage>';
  initial-value: 0%;
  inherits: false;
}

@keyframes spin-gradient {
  from { --gradient-angle: 0deg; }
  to { --gradient-angle: 360deg; }
}

@keyframes pulse-gradient {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes wave-gradient {
  from { --gradient-position: -100%; }
  to { --gradient-position: 200%; }
}
`;

let gradientCSSInjected = false;

/**
 * Inject gradient CSS into document head (idempotent)
 *
 * Call this once in your app to enable gradient border animations.
 * Safe to call multiple times - will only inject once.
 */
export function injectGradientCSS(): void {
  if (typeof document === 'undefined' || gradientCSSInjected) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'idealyst-gradient-animations';
  style.textContent = gradientPropertyCSS;
  document.head.appendChild(style);
  gradientCSSInjected = true;
}

/**
 * Generate conic gradient border spinner styles
 *
 * @param colors - Array of gradient colors
 * @param borderWidth - Border thickness in pixels
 * @param duration - Animation duration
 * @returns Style object for animated gradient border
 *
 * @example
 * import { conicSpinnerStyle } from '@idealyst/theme/animation';
 *
 * const spinnerStyle = conicSpinnerStyle(
 *   ['#3b82f6', '#8b5cf6', '#ec4899'],
 *   2,
 *   2000
 * );
 */
export function conicSpinnerStyle(
  colors: string[],
  borderWidth: number = 2,
  duration: Duration = 2000
): Record<string, string | number> {
  const durationMs = resolveDuration(duration);
  const colorString = colors.join(', ');

  return {
    background: `conic-gradient(from var(--gradient-angle), ${colorString})`,
    animation: `spin-gradient ${durationMs}ms linear infinite`,
    // Mask technique for border-only effect
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    padding: borderWidth,
  };
}

/**
 * Generate pulse gradient styles
 *
 * @param colors - Array of gradient colors
 * @param duration - Animation duration
 * @returns Style object for pulsing gradient
 */
export function pulseGradientStyle(
  colors: string[],
  duration: Duration = 'slowest'
): Record<string, string | number> {
  const durationMs = resolveDuration(duration);
  const colorString = colors.join(', ');

  return {
    background: `linear-gradient(135deg, ${colorString})`,
    animation: `pulse-gradient ${durationMs}ms ease-in-out infinite`,
  };
}
