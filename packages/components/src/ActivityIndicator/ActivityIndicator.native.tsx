import React from 'react';
import { ActivityIndicator as RNActivityIndicator, View } from 'react-native';
import { ActivityIndicatorProps } from './types';
import { activityIndicatorStyles } from './ActivityIndicator.styles';

const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  animating = true,
  size = 'medium',
  intent = 'primary',
  color,
  style,
  testID,
  hidesWhenStopped = true,
}) => {
  // Handle numeric size
  const sizeVariant = typeof size === 'number' ? 'medium' : size;
  const customSize = typeof size === 'number' ? size : undefined;
  
  // Map our size variants to React Native's size prop
  const rnSize = sizeVariant === 'small' ? 'small' : 'large';
  
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
};

export default ActivityIndicator;