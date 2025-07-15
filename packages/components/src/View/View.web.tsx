import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
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

  // Create dynamic styles based on custom props (overrides variants)
  const dynamicStyles: any = {};
  
  if (backgroundColor) dynamicStyles.backgroundColor = backgroundColor;
  if (padding !== undefined) dynamicStyles.padding = padding;
  if (margin !== undefined) dynamicStyles.margin = margin;
  if (borderRadius !== undefined) dynamicStyles.borderRadius = borderRadius;
  if (borderWidth !== undefined) dynamicStyles.borderWidth = borderWidth;
  if (borderColor) dynamicStyles.borderColor = borderColor;

  // Create the style array following the official documentation pattern
  const viewStyleArray = [
    viewStyles.view,
    dynamicStyles,
    style,
  ];

  // Use getWebProps to generate className and ref for web
  const webProps = getWebProps(viewStyleArray);

  return (
    <div
      {...webProps}
      data-testid={testID}
    >
      {children}
    </div>
  );
};

export default View; 