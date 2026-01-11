import React, { forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import type { Typography, Size } from '@idealyst/theme';
import { TextProps, TextSizeVariant } from './types';
import { textStyles } from './Text.styles';
import useMergeRefs from '../hooks/useMergeRefs';

// Map Size values to Typography values
const SIZE_TO_TYPOGRAPHY: Record<Size, Typography> = {
  'xs': 'caption',
  'sm': 'body2',
  'md': 'body1',
  'lg': 'subtitle1',
  'xl': 'h5',
  '2xl': 'h4',
  '3xl': 'h3',
};

// Convert TextSizeVariant to Typography (handles both Size and Typography values)
function resolveTypography(value: TextSizeVariant | undefined): Typography {
  if (!value) return 'body1';
  // If it's a Size value, map it to Typography
  if (value in SIZE_TO_TYPOGRAPHY) {
    return SIZE_TO_TYPOGRAPHY[value as Size];
  }
  // Otherwise it's already a Typography value
  return value as Typography;
}

/**
 * Typography component for displaying text with predefined styles and semantic variants.
 * Supports multiple typography scales, colors, weights, and alignments.
 */
const Text = forwardRef<HTMLSpanElement, TextProps>(({
  children,
  typography: typographyProp,
  size,
  weight,
  color = 'primary',
  align = 'left',
  // Spacing variants from TextSpacingStyleProps
  gap,
  padding,
  paddingVertical,
  paddingHorizontal,
  style,
  testID,
  id,
}, ref) => {
  // size is an alias for typography - size takes precedence if both are set
  const typography = resolveTypography(size ?? typographyProp);

  textStyles.useVariants({
    typography,
    weight,
    align,
    gap,
    padding,
    paddingVertical,
    paddingHorizontal,
  });

  // Create the style array - pass all style-affecting props to dynamic style function
  const textStyleArray = [
    (textStyles.text as any)({ color, typography, weight, align }),
    style,
  ];

  // Use getWebProps to generate className and ref for web
  const webProps = getWebProps(textStyleArray);

  const mergedRef = useMergeRefs(ref, webProps.ref);

  return (
    <span
      {...webProps}
      ref={mergedRef}
      id={id}
      data-testid={testID}
    >
      {children}
    </span>
  );
});

Text.displayName = 'Text';

export default Text; 