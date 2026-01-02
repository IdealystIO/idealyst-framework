import React, { forwardRef } from 'react';
import { View as RNView, ScrollView as RNScrollView, ViewStyle } from 'react-native';
import { ViewProps } from './types';
import { viewStyles } from './View.styles';

const View = forwardRef<RNView | RNScrollView, ViewProps>(({
  children,
  background = 'transparent',
  radius = 'none',
  border = 'none',
  // Spacing variants from ContainerStyleProps
  gap,
  padding,
  paddingVertical,
  paddingHorizontal,
  margin,
  marginVertical,
  marginHorizontal,
  // Override props
  backgroundColor,
  borderRadius,
  borderWidth,
  borderColor,
  scrollable = false,
  style,
  testID,
}, ref) => {
  viewStyles.useVariants({
    background,
    radius,
    border,
    gap,
    padding,
    paddingVertical,
    paddingHorizontal,
    margin,
    marginVertical,
    marginHorizontal,
  });

  const getStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {};

    if (backgroundColor) baseStyles.backgroundColor = backgroundColor;
    if (borderRadius !== undefined) baseStyles.borderRadius = borderRadius;
    if (borderWidth !== undefined) baseStyles.borderWidth = borderWidth;
    if (borderColor) baseStyles.borderColor = borderColor;

    return baseStyles;
  };

  if (scrollable) {
    return (
      <RNScrollView
        ref={ref as any}
        style={[{ flex: 1 }, style]}
        contentContainerStyle={[viewStyles.view, getStyles()]}
        testID={testID}
      >
        {children}
      </RNScrollView>
    );
  }

  return (
    <RNView ref={ref as any} style={[viewStyles.view, getStyles(), style]} testID={testID}>
      {children}
    </RNView>
  );
});

View.displayName = 'View';

export default View;
