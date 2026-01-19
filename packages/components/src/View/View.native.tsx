import { forwardRef } from 'react';
import { View as RNView, ScrollView as RNScrollView, ViewStyle, StyleSheet } from 'react-native';
import { useResponsiveStyle, ResponsiveStyle } from '@idealyst/theme';
import { ViewProps } from './types';
import { viewStyles } from './View.styles';
import type { IdealystElement } from '../utils/refTypes';

/**
 * Check if a style object contains any responsive values
 */
function hasResponsiveValues(style: any): style is ResponsiveStyle {
  if (!style || typeof style !== 'object' || Array.isArray(style)) return false;
  for (const key in style) {
    const value = style[key];
    if (value && typeof value === 'object' && !Array.isArray(value) && !('$$typeof' in value)) {
      // Check if it looks like a breakpoint map (has breakpoint-like keys)
      const keys = Object.keys(value);
      if (keys.some(k => ['xs', 'sm', 'md', 'lg', 'xl'].includes(k))) {
        return true;
      }
    }
  }
  return false;
}

const View = forwardRef<IdealystElement, ViewProps>(({
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
  onLayout,
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

  // Flatten style array if needed and check for responsive values
  const flattenedStyle = Array.isArray(style) ? StyleSheet.flatten(style) : style;

  // Resolve responsive values if present (this hook is reactive to breakpoint changes)
  const resolvedStyle = useResponsiveStyle(
    hasResponsiveValues(flattenedStyle) ? flattenedStyle : {}
  );

  // Use resolved style if responsive, otherwise use original
  const finalStyle = hasResponsiveValues(flattenedStyle) ? resolvedStyle : style;

  if (scrollable) {
    return (
      <RNScrollView
        ref={ref as any}
        style={[viewStyle, { flex: 1 }, overrideStyles, finalStyle]}
        contentContainerStyle={[viewStyle, overrideStyles]}
        testID={testID}
        nativeID={id}
        onLayout={onLayout}
      >
        {children}
      </RNScrollView>
    );
  }

  return (
    <RNView ref={ref as any} style={[viewStyle, overrideStyles, finalStyle]} testID={testID} nativeID={id} onLayout={onLayout}>
      {children}
    </RNView>
  );
});

View.displayName = 'View';

export default View;
