import React, { forwardRef, useMemo } from 'react';
import { ActivityIndicator as RNActivityIndicator, View } from 'react-native';
import { ActivityIndicatorProps } from './types';
import { activityIndicatorStyles } from './ActivityIndicator.styles';
import { getNativeLiveRegionAccessibilityProps } from '../utils/accessibility';

const ActivityIndicator = forwardRef<View, ActivityIndicatorProps>(({
  animating = true,
  size = 'md',
  intent = 'primary',
  color,
  style,
  testID,
  hidesWhenStopped = true,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityLiveRegion,
  accessibilityBusy,
}, ref) => {
  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    return getNativeLiveRegionAccessibilityProps({
      accessibilityLabel: accessibilityLabel ?? 'Loading',
      accessibilityLiveRegion: accessibilityLiveRegion ?? 'polite',
      accessibilityBusy: accessibilityBusy ?? animating,
    });
  }, [accessibilityLabel, accessibilityLiveRegion, accessibilityBusy, animating]);
  // Handle numeric size
  const sizeVariant = typeof size === 'number' ? 'md' : size;
  const customSize = typeof size === 'number' ? size : undefined;

  // Map our size variants to React Native's size prop
  const rnSize = sizeVariant === 'sm' ? 'small' : 'large';

  activityIndicatorStyles.useVariants({
    size: sizeVariant,
    animating,
  });

  // Call dynamic style with intent variant
  const spinnerStyle = activityIndicatorStyles.spinner({ intent });

  // Get the color from styles or use custom color
  const indicatorColor = color || spinnerStyle.color;

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
      nativeID={id}
      testID={testID}
      {...nativeA11yProps}
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