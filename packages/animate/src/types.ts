/**
 * Type definitions for @idealyst/animate
 */

import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import type { Duration, EasingKey, SpringType } from '@idealyst/theme/animation';

// Style types
export type AnimatableStyle = ViewStyle | TextStyle | ImageStyle;
export type StyleValue = string | number | undefined;

// Transform types (React Native array style - legacy)
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

/**
 * Simplified transform object syntax.
 * Cleaner alternative to the React Native array format.
 *
 * @example
 * // Instead of: transform: [{ translateX: 10 }, { translateY: 20 }, { scale: 1.2 }]
 * // Use: transform: { x: 10, y: 20, scale: 1.2 }
 */
export interface TransformObject {
  /** translateX - horizontal movement in pixels */
  x?: number;
  /** translateY - vertical movement in pixels */
  y?: number;
  /** Uniform scale (1 = normal, 2 = double, 0.5 = half) */
  scale?: number;
  /** Horizontal scale */
  scaleX?: number;
  /** Vertical scale */
  scaleY?: number;
  /** Rotation in degrees (number) or string ("45deg") */
  rotate?: number | string;
  /** X-axis rotation (string, e.g., "45deg") */
  rotateX?: string;
  /** Y-axis rotation (string, e.g., "45deg") */
  rotateY?: string;
  /** Z-axis rotation (string, e.g., "45deg") */
  rotateZ?: string;
  /** X-axis skew (string, e.g., "10deg") */
  skewX?: string;
  /** Y-axis skew (string, e.g., "10deg") */
  skewY?: string;
  /** Perspective for 3D transforms */
  perspective?: number;
}

/**
 * All animatable style properties.
 * Includes properties from ViewStyle, TextStyle, and ImageStyle that can be animated.
 */
export interface AnimatableProperties {
  // ============================================
  // OPACITY (GPU accelerated)
  // ============================================
  opacity?: number;

  // ============================================
  // TRANSFORM (GPU accelerated - preferred)
  // ============================================
  /**
   * Transform - preferred for performance (GPU accelerated).
   * Accepts either the new object syntax or legacy array format.
   *
   * @example
   * // New object syntax (recommended)
   * transform: { x: 10, y: 20, scale: 1.2, rotate: 45 }
   *
   * // Legacy array syntax (still supported)
   * transform: [{ translateX: 10 }, { translateY: 20 }, { scale: 1.2 }]
   */
  transform?: TransformObject | TransformProperty[];

  // ============================================
  // COLORS
  // ============================================
  backgroundColor?: string;
  borderColor?: string;
  borderTopColor?: string;
  borderRightColor?: string;
  borderBottomColor?: string;
  borderLeftColor?: string;
  borderStartColor?: string;
  borderEndColor?: string;
  color?: string;
  textDecorationColor?: string;
  textShadowColor?: string;
  shadowColor?: string;
  tintColor?: string;
  overlayColor?: string;

  // ============================================
  // BORDER WIDTH
  // ============================================
  borderWidth?: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderStartWidth?: number;
  borderEndWidth?: number;

  // ============================================
  // BORDER RADIUS
  // ============================================
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  borderTopStartRadius?: number;
  borderTopEndRadius?: number;
  borderBottomStartRadius?: number;
  borderBottomEndRadius?: number;

  // ============================================
  // DIMENSIONS
  // ============================================
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;

  // ============================================
  // POSITIONING
  // ============================================
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  start?: number | string;
  end?: number | string;

  // ============================================
  // MARGIN
  // ============================================
  margin?: number | string;
  marginTop?: number | string;
  marginRight?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  marginStart?: number | string;
  marginEnd?: number | string;
  marginHorizontal?: number | string;
  marginVertical?: number | string;

  // ============================================
  // PADDING
  // ============================================
  padding?: number | string;
  paddingTop?: number | string;
  paddingRight?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  paddingStart?: number | string;
  paddingEnd?: number | string;
  paddingHorizontal?: number | string;
  paddingVertical?: number | string;

  // ============================================
  // GAP (Flexbox)
  // ============================================
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;

  // ============================================
  // FLEX
  // ============================================
  flex?: number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number | string;

  // ============================================
  // SHADOW (iOS)
  // ============================================
  shadowOpacity?: number;
  shadowRadius?: number;

  // ============================================
  // TEXT
  // ============================================
  fontSize?: number;
  letterSpacing?: number;
  lineHeight?: number;
  textShadowRadius?: number;

  // ============================================
  // IMAGE
  // ============================================
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
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
