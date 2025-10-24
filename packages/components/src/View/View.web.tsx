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

  // Separate Unistyles objects from plain CSS objects
  const unistylesArray: any[] = [viewStyles.view];
  const plainStyles: any = {};

  if (style) {
    if (Array.isArray(style)) {
      style.forEach((s: any) => {
        if (s && typeof s === 'object') {
          // Only treat as plain CSS if it has ONLY grid-specific properties
          // Check if it's a grid-only object (has grid props and nothing else that looks like Unistyles)
          const keys = Object.keys(s);
          const hasGridProps = keys.some(k => k.startsWith('grid') || k === 'display' && s[k] === 'grid' || k === 'gap');
          const hasOnlyGridProps = hasGridProps && keys.every(k =>
            k === 'display' || k.startsWith('grid') || k === 'gap'
          );

          if (hasOnlyGridProps) {
            Object.assign(plainStyles, s);
          } else {
            unistylesArray.push(s);
          }
        }
      });
    } else if (typeof style === 'object') {
      const keys = Object.keys(style);
      const hasGridProps = keys.some(k => k.startsWith('grid') || k === 'display' && style[k] === 'grid' || k === 'gap');
      const hasOnlyGridProps = hasGridProps && keys.every(k =>
        k === 'display' || k.startsWith('grid') || k === 'gap'
      );

      if (hasOnlyGridProps) {
        Object.assign(plainStyles, style);
      } else {
        unistylesArray.push(style);
      }
    }
  }

  // Use getWebProps to generate className and ref for web (only for Unistyles objects)
  const webProps = getWebProps(unistylesArray);

  // Merge all plain styles together
  const mergedStyles = { ...dynamicStyles, ...plainStyles };

  const mergedRef = useMergeRefs(ref, webProps.ref);

  return (
    <div
      {...webProps}
      style={mergedStyles}
      ref={mergedRef}
      data-testid={testID}
    >
      {children}
    </div>
  );
});

View.displayName = 'View';

export default View; 