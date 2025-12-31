import React, { forwardRef } from 'react';
import { Text as RNText } from 'react-native';
import { TextProps } from './types';
import { textStyles } from './Text.styles';

const Text = forwardRef<RNText, TextProps>(({
  children,
  typography,
  size = 'md',
  weight = 'normal',
  color,
  align = 'left',
  style,
  testID,
}, ref) => {
  // When typography is set, it overrides size and weight (handled in styles)
  textStyles.useVariants({
    size: typography ? 'md' : size, // Use default when typography is set (will be overridden)
    weight: typography ? 'normal' : weight, // Use default when typography is set (will be overridden)
    align,
  });

  return (
    <RNText
      ref={ref}
      style={[
        textStyles.text({ color, typography }),
        style,
      ]}
      testID={testID}
    >
      {children}
    </RNText>
  );
});

Text.displayName = 'Text';

export default Text; 