/**
 * Animation type definitions for @idealyst/theme
 */

import type { durations, easings } from './tokens';

// Duration types
export type DurationKey = keyof typeof durations;
export type Duration = DurationKey | number;

// Easing types
export type EasingKey = keyof typeof easings;
export type BezierEasing = readonly [number, number, number, number];
export type SpringConfig = {
  readonly damping: number;
  readonly stiffness: number;
  readonly mass: number;
};

export type CSSEasing = {
  readonly css: string;
  readonly bezier: BezierEasing;
};

export type Easing = CSSEasing | SpringConfig;

// Animation configuration
export interface AnimationConfig {
  duration?: Duration;
  easing?: EasingKey;
  delay?: number;
}

// Transition configuration for CSS
export interface TransitionConfig extends AnimationConfig {
  properties?: string | string[];
}

// Keyframe types
export type KeyframeStyles = Record<string, React.CSSProperties>;
export type KeyframePercentage = `${number}%` | 'from' | 'to';
export type Keyframes = Partial<Record<KeyframePercentage, React.CSSProperties>>;

// Animation iteration
export type AnimationIterations = number | 'infinite';
export type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
export type AnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';

// Full animation configuration
export interface KeyframeAnimationConfig extends AnimationConfig {
  iterations?: AnimationIterations;
  direction?: AnimationDirection;
  fillMode?: AnimationFillMode;
}

// Spring types for native
export type SpringType = 'spring' | 'springStiff' | 'springBouncy';

// Timing config for Reanimated
export interface TimingAnimationConfig {
  duration: number;
  easing: BezierEasing;
}

// Platform-specific options
export interface PlatformAnimationOptions {
  web?: Partial<TransitionConfig> & { transition?: string };
  native?: Partial<AnimationConfig> & Partial<SpringConfig>;
}

// Gradient animation types
export type GradientAnimation = 'spin' | 'pulse' | 'wave';

export interface GradientBorderConfig {
  colors: string[];
  borderWidth?: number;
  borderRadius?: number;
  duration?: Duration;
  animation?: GradientAnimation;
}
