import React, { forwardRef } from 'react';
import { View as RNView, ViewStyle } from 'react-native';
import { ViewProps } from './types';
import { viewStyles } from './View.styles';

const View = forwardRef<RNView, ViewProps>(({
  children,
  spacing = 'none',
  marginVariant = 'none',
  background = 'transparent',
  radius = 'none',
  border = 'none',
  backgroundColor,
  padding,
  margin,
  borderRadius,
  borderWidth,
  borderColor,
  style,
  testID,
}, ref) => {
  viewStyles.useVariants({
    spacing,
    background,
    radius,
    border,
  });

  const getStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {};
    
    if (backgroundColor) baseStyles.backgroundColor = backgroundColor;
    if (padding !== undefined) baseStyles.padding = padding;
    if (margin !== undefined) baseStyles.margin = margin;
    if (borderRadius !== undefined) baseStyles.borderRadius = borderRadius;
    if (borderWidth !== undefined) baseStyles.borderWidth = borderWidth;
    if (borderColor) baseStyles.borderColor = borderColor;
    
    return baseStyles;
  };

  return (
    <RNView ref={ref} style={[viewStyles.view, getStyles(), style]} testID={testID}>
      {children}
    </RNView>
  );
});

View.displayName = 'View';

export default View; 