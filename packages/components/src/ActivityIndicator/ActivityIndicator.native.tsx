import React, { forwardRef } from 'react';
import { ActivityIndicator as RNActivityIndicator, View } from 'react-native';
import { ActivityIndicatorProps } from './types';
import { activityIndicatorStyles } from './ActivityIndicator.styles';

const ActivityIndicator = forwardRef<View, ActivityIndicatorProps>(({
  animating = true,
  size = 'md',
  intent = 'primary',
  color,
  style,
  testID,
  hidesWhenStopped = true,
}, ref) => {
  // Handle numeric size
  const sizeVariant = typeof size === 'number' ? 'md' : size;
  const customSize = typeof size === 'number' ? size : undefined;

  // Map our size variants to React Native's size prop
  const rnSize = sizeVariant === 'sm' ? 'small' : 'large';

  activityIndicatorStyles.useVariants({
    size: sizeVariant,
    intent,
    animating,
  });

  // Get the color from styles or use custom color
  const indicatorColor = color || activityIndicatorStyles.spinner.color;

  return (
    <View
      style={[
        activityIndicatorStyles.container,
        customSize && {
          width: customSize,
          height: customSize,
        },
        style
      ]}
      ref={ref}
      testID={testID}
    >
      <RNActivityIndicator
        animating={animating}
        size={customSize || rnSize}
        color={indicatorColor}
        hidesWhenStopped={hidesWhenStopped}
      />
    </View>
  );
});

ActivityIndicator.displayName = 'ActivityIndicator';

export default ActivityIndicator;