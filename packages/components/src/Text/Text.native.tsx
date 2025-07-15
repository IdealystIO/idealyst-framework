import React from 'react';
import { StyleSheet } from 'react-native-unistyles';
import { Text as RNText } from 'react-native';
import { TextProps } from './types';
import textStyles from './Text.styles';

const Text: React.FC<TextProps> = ({
  children,
  size = 'medium',
  weight = 'normal',
  color,
  align = 'left',
  style,
  testID,
}) => {
  textStyles.useVariants({
    size,
    weight,
    align,
    color: color
  });

  return (
    <RNText 
      style={[
        textStyles.text,
        style,
      ]} 
      testID={testID}
    >
      {children}
    </RNText>
  );
};

export default Text; 