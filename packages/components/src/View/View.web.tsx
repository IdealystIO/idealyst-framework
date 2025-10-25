import React, { forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { ViewProps } from './types';
import { viewStyles } from './View.styles';
import useMergeRefs from '../hooks/useMergeRefs';

const View = forwardRef<HTMLDivElement, ViewProps>(({
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

  // Separate Unistyles objects from plain CSS objects
  const unistylesArray: any[] = [viewStyles.view];

  // Use getWebProps to generate className and ref for web (only for Unistyles objects)
  const webProps = getWebProps(unistylesArray);

  const mergedRef = useMergeRefs(ref, webProps.ref);

  return (
    <div
      {...webProps}
      style={style as any}
      ref={mergedRef}
      data-testid={testID}
    >
      {children}
    </div>
  );
});

View.displayName = 'View';

export default View; 