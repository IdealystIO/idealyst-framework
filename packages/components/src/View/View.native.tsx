import React from 'react';
import { View as RNView } from 'react-native';
import { ViewProps } from './types';
import viewStyles from './View.styles';

const View: React.FC<ViewProps> = ({
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
}) => {
  viewStyles.useVariants({
    spacing,
    margin: marginVariant,
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

  const viewStyleArray = [
    viewStyles.view,
    getStyles(),
    style,
  ];

  return (
    <RNView style={viewStyleArray} testID={testID}>
      {children}
    </RNView>
  );
};

export default View; 