import { forwardRef } from 'react';
import { Text as RNText } from 'react-native';
import { TextProps } from './types';
import { textStyles } from './Text.styles';
import { getTextDefaults } from './defaults';
import { getDefaultMaxFontSizeMultiplier } from '@idealyst/theme';
import type { IdealystElement } from '../utils/refTypes';

const Text = forwardRef<IdealystElement, TextProps>(({
  children,
  typography = 'body1',
  weight,
  color,
  align = 'left',
  numberOfLines,
  maxFontSizeMultiplier,
  // Spacing variants from TextSpacingStyleProps
  gap,
  padding,
  paddingVertical,
  paddingHorizontal,
  style,
  testID,
  id,
}, ref) => {
  textStyles.useVariants({
    typography,
    weight,
    align,
    gap,
    padding,
    paddingVertical,
    paddingHorizontal,
  });

  const resolvedMaxFontSizeMultiplier = maxFontSizeMultiplier ?? getTextDefaults().maxFontSizeMultiplier ?? getDefaultMaxFontSizeMultiplier();

  return (
    <RNText
      ref={ref as any}
      nativeID={id}
      numberOfLines={numberOfLines}
      maxFontSizeMultiplier={resolvedMaxFontSizeMultiplier}
      style={[textStyles.text({ color, typography, weight, align }), style]}
      testID={testID}
    >
      {children}
    </RNText>
  );
});

Text.displayName = 'Text';

export default Text; 