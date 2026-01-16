/**
 * Type definitions for @idealyst/animate
 */

import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import type { Duration, EasingKey, SpringType } from '@idealyst/theme/animation';

// Style types
export type AnimatableStyle = ViewStyle | TextStyle | ImageStyle;
export type StyleValue = string | number | undefined;

// Transform types (React Native style)
export type TransformProperty =
  | { perspective: number }
  | { rotate: string }
  | { rotateX: string }
  | { rotateY: string }
  | { rotateZ: string }
  | { scale: number }
  | { scaleX: number }
  | { scaleY: number }
  | { translateX: number }
  | { translateY: number }
  | { skewX: string }
  | { skewY: string };

// Animatable properties (subset that can be animated smoothly)
export interface AnimatableProperties {
  // Opacity
  opacity?: number;

  // Background
  backgroundColor?: string;

  // Border
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;

  // Dimensions (use sparingly - triggers layout)
  width?: number | string;
  height?: number | string;
  maxHeight?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  minWidth?: number | string;

  // Positioning (use sparingly - triggers layout)
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;

  // Transform (preferred for performance)
  transform?: TransformProperty[];
}

// Animation configuration
export interface AnimationOptions {
  /** Duration in ms or token key */
  duration?: Duration;
  /** Easing function key */
  easing?: EasingKey;
  /** Delay before animation starts (ms) */
  delay?: number;
}

// Platform-specific overrides
export interface PlatformOverrides {
  /** Web-specific options */
  web?: AnimationOptions & {
    /** Custom CSS transition string */
    transition?: string;
  };
  /** Native-specific options */
  native?: AnimationOptions & {
    /** Use spring animation instead of timing */
    useSpring?: boolean;
    /** Spring type if useSpring is true */
    springType?: SpringType;
  };
}

// useAnimatedStyle options
export interface UseAnimatedStyleOptions extends AnimationOptions, PlatformOverrides {}

// useAnimatedValue return type
export interface AnimatedValue {
  /** Current value (for reading) */
  readonly value: number;
  /** Set value with animation */
  set: (target: number, options?: AnimationOptions) => void;
  /** Set value immediately without animation */
  setImmediate: (target: number) => void;
  /** Interpolate value to another range */
  interpolate: <T extends string | number>(config: InterpolationConfig<T>) => T;
}

export interface InterpolationConfig<T> {
  inputRange: number[];
  outputRange: T[];
  extrapolate?: 'extend' | 'clamp' | 'identity';
  extrapolateLeft?: 'extend' | 'clamp' | 'identity';
  extrapolateRight?: 'extend' | 'clamp' | 'identity';
}

// useSequence types
export interface SequenceStep {
  /** Style properties for this step */
  style?: AnimatableProperties;
  /** Duration for this step */
  duration?: Duration;
  /** Easing for this step */
  easing?: EasingKey;
  /** Delay before this step */
  delay?: number;
}

export interface UseSequenceResult {
  /** Current animated style */
  style: AnimatableStyle;
  /** Start/restart the sequence */
  play: () => void;
  /** Reset to initial state */
  reset: () => void;
  /** Pause animation (web only) */
  pause: () => void;
  /** Whether animation is currently playing */
  isPlaying: boolean;
}

// useKeyframes types
export type KeyframePercentage = `${number}%` | 'from' | 'to';
export type KeyframeDefinition = Partial<Record<KeyframePercentage, AnimatableProperties>>;

export interface UseKeyframesOptions extends AnimationOptions {
  /** Number of iterations (default: 1) */
  iterations?: number | 'infinite';
  /** Animation direction */
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  /** Fill mode */
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  /** Auto-play on mount */
  autoPlay?: boolean;
}

export interface UseKeyframesResult {
  /** Animated style to apply */
  style: AnimatableStyle;
  /** Start animation */
  play: () => void;
  /** Pause animation */
  pause: () => void;
  /** Reset to initial state */
  reset: () => void;
  /** Whether animation is playing */
  isPlaying: boolean;
}

// usePresence types
export interface UsePresenceOptions extends AnimationOptions {
  /** Style when entering/visible */
  enter: AnimatableProperties;
  /** Style when exiting/hidden */
  exit: AnimatableProperties;
  /** Initial style (defaults to exit) */
  initial?: AnimatableProperties;
}

export interface UsePresenceResult {
  /** Whether element should be rendered */
  isPresent: boolean;
  /** Animated style to apply */
  style: AnimatableStyle;
  /** Trigger exit animation manually */
  exit: () => void;
}

// useGradientBorder types
export type GradientAnimation = 'spin' | 'pulse' | 'wave';

export interface UseGradientBorderOptions {
  /** Gradient colors */
  colors: string[];
  /** Border width in pixels */
  borderWidth?: number;
  /** Border radius in pixels */
  borderRadius?: number;
  /** Animation duration in ms or token */
  duration?: Duration;
  /** Animation type */
  animation?: GradientAnimation;
  /** Whether animation is active */
  active?: boolean;
}

export interface UseGradientBorderResult {
  /** Style for the outer container */
  containerStyle: AnimatableStyle;
  /** Style for the inner content wrapper */
  contentStyle: AnimatableStyle;
  /** Whether gradient CSS has been injected (web only) */
  isReady: boolean;
}
