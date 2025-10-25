import React, { forwardRef } from 'react';
import { Text as RNText } from 'react-native';
import { TextProps } from './types';
import { textStyles } from './Text.styles';

const Text = forwardRef<RNText, TextProps>(({
  children,
  size = 'md',
  weight = 'normal',
  color,
  align = 'left',
  style,
  testID,
}, ref) => {
  textStyles.useVariants({
    size,
    weight,
    align,
  });

  return (
    <RNText
      ref={ref}
      style={[
        textStyles.text({ color }),
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