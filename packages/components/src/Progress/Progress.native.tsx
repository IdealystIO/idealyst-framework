import React, { useEffect, forwardRef } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import Text from '../Text';
import { progressStyles } from './Progress.styles';
import type { ProgressProps } from './types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Progress = forwardRef<View, ProgressProps>(({
  value = 0,
  max = 100,
  variant = 'linear',
  intent = 'primary',
  size = 'md',
  indeterminate = false,
  showLabel = false,
  label,
  rounded = true,
  style,
  testID,
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Apply variants
  progressStyles.useVariants({
    size,
    intent,
    rounded,
  });

  // Animation values
  const animatedValue = useSharedValue(0);
  const slideAnimation = useSharedValue(0);
  const rotateAnimation = useSharedValue(0);

  useEffect(() => {
    if (indeterminate) {
      // Indeterminate animation
      slideAnimation.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        false
      );
      rotateAnimation.value = withRepeat(
        withTiming(1, { duration: 1400, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      // Determinate animation
      animatedValue.value = withTiming(percentage, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [percentage, indeterminate]);

  const getCircularSize = () => {
    if (size === 'sm') return 32;
    if (size === 'lg') return 64;
    return 48;
  };

  if (variant === 'circular') {
    const circularSize = getCircularSize();
    const strokeWidth = size === 'sm' ? 3 : size === 'lg' ? 5 : 4;
    const radius = (circularSize - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    // Get colors from stylesheet after applying variants
    const trackColor = progressStyles.circularTrack.stroke;
    const barColor = progressStyles.circularBar.stroke;

    const circularAnimatedProps = useAnimatedProps(() => {
      const offset = indeterminate
        ? circumference * 0.25
        : circumference - (animatedValue.value / 100) * circumference;

      return {
        strokeDashoffset: offset,
      };
    });

    const rotationStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            rotate: `${rotateAnimation.value * 360}deg`,
          },
        ],
      };
    });

    return (
      <View style={[progressStyles.circularContainer, style]} testID={testID}>
        <Animated.View style={indeterminate ? rotationStyle : {}}>
          <Svg width={circularSize} height={circularSize} style={{ transform: [{ rotate: '-90deg' }] }}>
            {/* Track circle (background) */}
            <Circle
              cx={circularSize / 2}
              cy={circularSize / 2}
              r={radius}
              strokeWidth={strokeWidth}
              fill="none"
              stroke={trackColor}
            />
            {/* Progress circle (foreground) */}
            <AnimatedCircle
              cx={circularSize / 2}
              cy={circularSize / 2}
              r={radius}
              strokeWidth={strokeWidth}
              fill="none"
              stroke={barColor}
              strokeDasharray={`${circumference} ${circumference}`}
              animatedProps={circularAnimatedProps}
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>
        {showLabel && (
          <Text style={progressStyles.circularLabel}>
            {label || `${Math.round(percentage)}%`}
          </Text>
        )}
      </View>
    );
  }

  // Linear progress
  const barAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedValue.value}%`,
    };
  });

  const indeterminateAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: slideAnimation.value * 600 - 200,
        },
      ],
    };
  });

  return (
    <View ref={ref} style={[progressStyles.container, style]} testID={testID} accessibilityRole="progressbar">
      <View style={progressStyles.linearTrack}>
        {indeterminate ? (
          <Animated.View style={[progressStyles.indeterminateBar, indeterminateAnimatedStyle]} />
        ) : (
          <Animated.View style={[progressStyles.linearBar, barAnimatedStyle]} />
        )}
      </View>
      {showLabel && (
        <Text style={progressStyles.label}>
          {label || `${Math.round(percentage)}%`}
        </Text>
      )}
    </View>
  );
});

Progress.displayName = 'Progress';

export default Progress;
