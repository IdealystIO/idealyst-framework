/**
 * Animation tokens for @idealyst/theme
 *
 * These tokens provide consistent animation timing across the framework.
 * Use these instead of hardcoded values for consistency and maintainability.
 */

/**
 * Duration tokens in milliseconds
 *
 * @example
 * import { durations } from '@idealyst/theme/animation';
 *
 * // Use in CSS transition
 * transition: `opacity ${durations.normal}ms ease`
 *
 * // Use with Reanimated
 * withTiming(value, { duration: durations.fast })
 */
export const durations = {
  /** 0ms - No animation, instant change */
  instant: 0,
  /** 100ms - Micro-interactions: hover, focus, press feedback */
  fast: 100,
  /** 200ms - Standard state transitions: toggle, selection changes */
  normal: 200,
  /** 300ms - Complex transitions: expand/collapse, progress bars */
  slow: 300,
  /** 500ms - Entrance animations: modals, toasts appearing */
  slower: 500,
  /** 750ms - Extended animations: skeleton pulse, loading states */
  slowest: 750,
  /** 1000ms - Loop animations: spinners, continuous indicators */
  loop: 1000,
} as const;

/**
 * Easing tokens with both CSS string and bezier values
 *
 * CSS easings include both a CSS string for web transitions
 * and bezier curve values for Reanimated's Easing.bezier()
 *
 * Spring easings are native-only and include damping/stiffness/mass
 *
 * @example
 * import { easings } from '@idealyst/theme/animation';
 *
 * // Web: use CSS string
 * transition: `opacity 200ms ${easings.easeOut.css}`
 *
 * // Native: use bezier values
 * Easing.bezier(...easings.easeOut.bezier)
 *
 * // Native spring
 * withSpring(value, easings.spring)
 */
export const easings = {
  // Standard CSS easings
  /** Linear - constant speed, no acceleration */
  linear: { css: 'linear', bezier: [0, 0, 1, 1] as const },
  /** Ease - slight acceleration at start, deceleration at end */
  ease: { css: 'ease', bezier: [0.25, 0.1, 0.25, 1] as const },
  /** Ease-in - starts slow, accelerates */
  easeIn: { css: 'ease-in', bezier: [0.42, 0, 1, 1] as const },
  /** Ease-out - starts fast, decelerates (most common for UI) */
  easeOut: { css: 'ease-out', bezier: [0, 0, 0.58, 1] as const },
  /** Ease-in-out - symmetric acceleration and deceleration */
  easeInOut: { css: 'ease-in-out', bezier: [0.42, 0, 0.58, 1] as const },

  // Material Design easings
  /** Standard - Material Design standard easing, balanced feel */
  standard: { css: 'cubic-bezier(0.4, 0, 0.2, 1)', bezier: [0.4, 0, 0.2, 1] as const },
  /** Decelerate - Material Design deceleration, for entering elements */
  decelerate: { css: 'cubic-bezier(0, 0, 0.2, 1)', bezier: [0, 0, 0.2, 1] as const },
  /** Accelerate - Material Design acceleration, for exiting elements */
  accelerate: { css: 'cubic-bezier(0.4, 0, 1, 1)', bezier: [0.4, 0, 1, 1] as const },

  // Spring configurations (native only - used with withSpring)
  /** Spring - balanced spring, good for toggles and state changes */
  spring: { damping: 15, stiffness: 200, mass: 1 } as const,
  /** Spring stiff - less bounce, snappier feel, good for switches */
  springStiff: { damping: 40, stiffness: 200, mass: 1 } as const,
  /** Spring bouncy - more bounce, playful feel, good for buttons */
  springBouncy: { damping: 10, stiffness: 180, mass: 1 } as const,
} as const;

/**
 * Animation presets for common use cases
 *
 * These combine duration and easing for specific interaction patterns.
 *
 * @example
 * import { presets } from '@idealyst/theme/animation';
 *
 * // Use for hover effects
 * _web: { transition: cssPreset(presets.hover) }
 */
export const presets = {
  // Micro-interactions
  /** Hover effect - fast, subtle */
  hover: { duration: 'fast' as const, easing: 'ease' as const },
  /** Press/active feedback - fast, ease-out */
  press: { duration: 'fast' as const, easing: 'easeOut' as const },
  /** Focus ring - normal speed */
  focus: { duration: 'normal' as const, easing: 'ease' as const },

  // State changes
  /** Toggle/switch - normal with spring on native */
  toggle: { duration: 'normal' as const, easing: 'spring' as const },
  /** Selection change - normal, standard easing */
  select: { duration: 'normal' as const, easing: 'standard' as const },

  // Expand/collapse
  /** Expand content - slow, standard easing */
  expand: { duration: 'slow' as const, easing: 'standard' as const },
  /** Collapse content - slightly faster than expand */
  collapse: { duration: 'normal' as const, easing: 'accelerate' as const },

  // Entrance/exit
  /** Fade in - normal, decelerate */
  fadeIn: { duration: 'normal' as const, easing: 'decelerate' as const },
  /** Fade out - fast, accelerate */
  fadeOut: { duration: 'fast' as const, easing: 'accelerate' as const },
  /** Scale in (modal, dialog) - slower, decelerate */
  scaleIn: { duration: 'slower' as const, easing: 'decelerate' as const },
  /** Scale out - normal, accelerate */
  scaleOut: { duration: 'normal' as const, easing: 'accelerate' as const },
  /** Slide in - slow, standard */
  slideIn: { duration: 'slow' as const, easing: 'standard' as const },
  /** Slide out - normal, accelerate */
  slideOut: { duration: 'normal' as const, easing: 'accelerate' as const },

  // Loading/continuous
  /** Spinner rotation - 1s linear loop */
  spin: { duration: 'loop' as const, easing: 'linear' as const, iterations: 'infinite' as const },
  /** Pulse effect - slowest, ease-in-out loop */
  pulse: { duration: 'slowest' as const, easing: 'easeInOut' as const, iterations: 'infinite' as const },
  /** Skeleton wave - slower than pulse */
  wave: { duration: 1500 as const, easing: 'easeInOut' as const, iterations: 'infinite' as const },
} as const;

// Type exports for convenience
export type DurationKey = keyof typeof durations;
export type EasingKey = keyof typeof easings;
export type PresetKey = keyof typeof presets;
