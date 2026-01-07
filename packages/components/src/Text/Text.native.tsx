import React, { forwardRef } from 'react';
import { Text as RNText } from 'react-native';
import { TextProps } from './types';
import { textStyles } from './Text.styles';

const Text = forwardRef<RNText, TextProps>(({
  children,
  typography = 'body1',
  weight,
  color,
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
  textStyles.useVariants({
    typography,
    weight,
    align,
    gap,
    padding,
    paddingVertical,
    paddingHorizontal,
  });

  // Pass all style-affecting props to dynamic style function
  const textStyle = (textStyles.text as any)({ color, typography, weight, align });

  return (
    <RNText
      ref={ref}
      nativeID={id}
      style={[textStyle, style]}
      testID={testID}
    >
      {children}
    </RNText>
  );
});

Text.displayName = 'Text';

export default Text; 