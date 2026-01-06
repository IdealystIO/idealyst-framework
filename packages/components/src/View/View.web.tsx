import React, { forwardRef, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { getWebProps } from 'react-native-unistyles/web';
import { ViewProps } from './types';
import { viewStyles } from './View.styles';
import useMergeRefs from '../hooks/useMergeRefs';

const View = forwardRef<HTMLDivElement, ViewProps>(({
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
  scrollable, // accepted but no-op on web - layout handles scrolling
  style,
  testID,
  id,
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

  // Create dynamic styles based on custom props (overrides variants)
  const dynamicStyles: any = {};

  if (backgroundColor) dynamicStyles.backgroundColor = backgroundColor;
  if (borderRadius !== undefined) dynamicStyles.borderRadius = borderRadius;
  if (borderWidth !== undefined) dynamicStyles.borderWidth = borderWidth;
  if (borderColor) dynamicStyles.borderColor = borderColor;

  // Flatten style array to object (HTML divs don't support style arrays)
  const flattenedStyle = useMemo(() => {
    if (!style) return undefined;
    if (Array.isArray(style)) {
      return StyleSheet.flatten(style);
    }
    return style;
  }, [style]);

  /** @ts-ignore */
  const webProps = getWebProps([(viewStyles.view as any)({}), dynamicStyles]);

  const mergedRef = useMergeRefs(ref, webProps.ref);

  return (
    <div
      style={flattenedStyle as any}
      {...webProps}
      ref={mergedRef}
      id={id}
      data-testid={testID}
    >
      {children}
    </div>
  );
});

View.displayName = 'View';

export default View;
