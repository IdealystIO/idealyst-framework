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
  id,
}, ref) => {
  // Set active variants for this render
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

  // Call style as function to get theme-reactive styles
  const viewStyle = (viewStyles.view as any)({});

  // Override styles for direct prop values
  const overrideStyles: ViewStyle = {};
  if (backgroundColor) overrideStyles.backgroundColor = backgroundColor;
  if (borderRadius !== undefined) overrideStyles.borderRadius = borderRadius;
  if (borderWidth !== undefined) overrideStyles.borderWidth = borderWidth;
  if (borderColor) overrideStyles.borderColor = borderColor;

  if (scrollable) {
    return (
      <RNScrollView
        ref={ref as any}
        style={[{ flex: 1 }, style]}
        contentContainerStyle={[viewStyle, overrideStyles]}
        testID={testID}
        nativeID={id}
      >
        {children}
      </RNScrollView>
    );
  }

  return (
    <RNView ref={ref as any} style={[viewStyle, overrideStyles, style]} testID={testID} nativeID={id}>
      {children}
    </RNView>
  );
});

View.displayName = 'View';

export default View;
