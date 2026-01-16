/**
 * useGradientBorder - Native implementation
 *
 * Creates animated gradient border effects using react-native-svg
 * and Reanimated for performant animations.
 */

import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated from 'react-native-reanimated';
import { resolveDuration } from '@idealyst/theme/animation';
import type { UseGradientBorderOptions, UseGradientBorderResult, AnimatableStyle } from './types';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

/**
 * Hook that creates an animated gradient border effect.
 * Uses SVG with Reanimated for smooth animations on native.
 *
 * @param options - Configuration for the gradient border
 * @returns Container and content styles to apply
 *
 * @example
 * ```tsx
 * const { containerStyle, contentStyle, GradientBorder } = useGradientBorder({
 *   colors: ['#3b82f6', '#8b5cf6', '#ec4899'],
 *   borderWidth: 2,
 *   borderRadius: 8,
 *   animation: 'spin',
 *   duration: 2000,
 * });
 *
 * return (
 *   <View style={containerStyle}>
 *     <GradientBorder />
 *     <View style={contentStyle}>
 *       Content here
 *     </View>
 *   </View>
 * );
 * ```
 */
export function useGradientBorder(options: UseGradientBorderOptions): UseGradientBorderResult & {
  GradientBorder: React.FC<{ width: number; height: number }>;
} {
  const {
    colors,
    borderWidth = 2,
    borderRadius = 8,
    duration = 2000,
    animation = 'spin',
    active = true,
  } = options;

  const durationMs = resolveDuration(duration);

  // Animation value for rotation (0-360) or progress (0-1)
  const animationValue = useSharedValue(0);

  // Start animation
  useEffect(() => {
    if (!active) {
      animationValue.value = 0;
      return;
    }

    switch (animation) {
      case 'spin':
        animationValue.value = withRepeat(
          withTiming(360, {
            duration: durationMs,
            easing: Easing.linear,
          }),
          -1, // infinite
          false // don't reverse
        );
        break;
      case 'pulse':
        animationValue.value = withRepeat(
          withTiming(1, {
            duration: durationMs / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true // reverse
        );
        break;
      case 'wave':
        animationValue.value = withRepeat(
          withTiming(1, {
            duration: durationMs,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          false
        );
        break;
    }
  }, [active, animation, durationMs]);

  // Container style
  const containerStyle = useMemo<AnimatableStyle>(() => {
    return {
      position: 'relative',
      overflow: 'hidden',
    } as AnimatableStyle;
  }, []);

  // Content style
  const contentStyle = useMemo<AnimatableStyle>(() => {
    return {
      position: 'absolute',
      top: borderWidth,
      left: borderWidth,
      right: borderWidth,
      bottom: borderWidth,
      borderRadius,
      backgroundColor: 'white', // This should be set by the consumer
      overflow: 'hidden',
    } as AnimatableStyle;
  }, [borderWidth, borderRadius]);

  // Gradient border component
  const GradientBorder: React.FC<{ width: number; height: number }> = useMemo(() => {
    return ({ width, height }) => {
      // Animated props for the gradient
      const animatedGradientProps = useAnimatedProps(() => {
        if (animation === 'spin') {
          // Rotate the gradient
          const angle = animationValue.value;
          const radians = (angle * Math.PI) / 180;
          const x2 = 0.5 + 0.5 * Math.cos(radians);
          const y2 = 0.5 + 0.5 * Math.sin(radians);
          const x1 = 1 - x2;
          const y1 = 1 - y2;
          return {
            x1: String(x1),
            y1: String(y1),
            x2: String(x2),
            y2: String(y2),
          };
        } else if (animation === 'wave') {
          // Move gradient position
          const progress = animationValue.value;
          return {
            x1: String(-1 + progress * 2),
            y1: '0',
            x2: String(progress * 2),
            y2: '0',
          };
        }
        return {
          x1: '0',
          y1: '0',
          x2: '1',
          y2: '1',
        };
      });

      const animatedRectProps = useAnimatedProps(() => {
        if (animation === 'pulse') {
          const opacity = 0.5 + animationValue.value * 0.5;
          return { opacity };
        }
        return { opacity: 1 };
      });

      return (
        <Svg
          width={width}
          height={height}
          style={StyleSheet.absoluteFill}
        >
          <Defs>
            <AnimatedLinearGradient
              id="gradient"
              animatedProps={animatedGradientProps}
            >
              {colors.map((color, index) => (
                <Stop
                  key={index}
                  offset={`${(index / (colors.length - 1)) * 100}%`}
                  stopColor={color}
                />
              ))}
            </AnimatedLinearGradient>
          </Defs>
          <AnimatedRect
            x={0}
            y={0}
            width={width}
            height={height}
            rx={borderRadius + borderWidth}
            ry={borderRadius + borderWidth}
            fill="url(#gradient)"
            animatedProps={animatedRectProps}
          />
          {/* Inner cutout (white background) */}
          <Rect
            x={borderWidth}
            y={borderWidth}
            width={width - borderWidth * 2}
            height={height - borderWidth * 2}
            rx={borderRadius}
            ry={borderRadius}
            fill="white"
          />
        </Svg>
      );
    };
  }, [colors, borderWidth, borderRadius, animation, animationValue]);

  return {
    containerStyle,
    contentStyle,
    isReady: true,
    GradientBorder,
  };
}
