import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { skeletonStyles } from './Skeleton.styles';
import type { SkeletonProps, SkeletonGroupProps } from './types';

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  shape = 'rectangle',
  borderRadius,
  animation = 'pulse',
  style,
  testID,
}) => {
  skeletonStyles.useVariants({
    shape,
    animation,
  });

  const animatedValue = useSharedValue(0);

  useEffect(() => {
    if (animation === 'pulse') {
      // Pulse animation: opacity from 1 -> 0.5 -> 1
      animatedValue.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 750, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 750, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // infinite
        false
      );
    } else if (animation === 'wave') {
      // Wave animation: translateX from -100% -> 100%
      animatedValue.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1, // infinite
        false
      );
    }
  }, [animation]);

  const pulseAnimatedStyle = useAnimatedStyle(() => {
    if (animation === 'pulse') {
      return {
        opacity: animatedValue.value === 0 ? 1 : 1 - animatedValue.value * 0.5,
      };
    }
    return {};
  });

  const waveAnimatedStyle = useAnimatedStyle(() => {
    if (animation === 'wave') {
      return {
        transform: [
          {
            translateX: (animatedValue.value - 0.5) * 400, // -200 to 200
          },
        ],
      };
    }
    return {};
  });

  const customStyles = {
    width: typeof width === 'number' ? width : width,
    height: typeof height === 'number' ? height : height,
    ...(shape === 'rounded' && borderRadius ? { borderRadius } : {}),
    ...(shape === 'circle' ? { aspectRatio: 1 } : {}),
  };

  return (
    <Animated.View
      style={[
        skeletonStyles.skeleton,
        customStyles,
        style,
        pulseAnimatedStyle,
      ]}
      testID={testID}
    >
      {animation === 'wave' && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            },
            waveAnimatedStyle,
          ]}
        />
      )}
    </Animated.View>
  );
};

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  count = 3,
  spacing = 12,
  skeletonProps,
  style,
  testID,
}) => {
  skeletonStyles.useVariants({});

  return (
    <View
      style={[
        skeletonStyles.group,
        { gap: spacing },
        style,
      ]}
      testID={testID}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          {...skeletonProps}
          testID={testID ? `${testID}-item-${index}` : undefined}
        />
      ))}
    </View>
  );
};

export default Skeleton;
