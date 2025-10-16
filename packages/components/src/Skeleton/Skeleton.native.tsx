import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
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
  const { styles } = skeletonStyles.useVariants({
    shape,
    animation,
  });

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animation === 'pulse') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 750,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else if (animation === 'wave') {
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [animation, animatedValue]);

  const opacity = animation === 'pulse'
    ? animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.5],
      })
    : 1;

  const customStyles = {
    width: typeof width === 'number' ? width : width,
    height: typeof height === 'number' ? height : height,
    ...(shape === 'rounded' && borderRadius ? { borderRadius } : {}),
    ...(shape === 'circle' ? { aspectRatio: 1 } : {}),
  };

  return (
    <Animated.View
      style={[
        styles.skeleton,
        customStyles,
        style,
        { opacity },
      ]}
      testID={testID}
    >
      {animation === 'wave' && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            transform: [
              {
                translateX: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-200, 200],
                }),
              },
            ],
          }}
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
  const { styles } = skeletonStyles.useVariants({});

  return (
    <View
      style={[
        styles.group,
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
