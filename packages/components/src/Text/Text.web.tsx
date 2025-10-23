import React, { forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { TextProps } from './types';
import { textStyles } from './Text.styles';
import useMergeRefs from '../hooks/useMergeRefs';

const Text = forwardRef<HTMLSpanElement, TextProps>(({
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
    color: color
  });

  // Create the style array following the official documentation pattern
  const textStyleArray = [
    textStyles.text,
    style,
  ];

  // Use getWebProps to generate className and ref for web
  const webProps = getWebProps(textStyleArray);

  const mergedRef = useMergeRefs(ref, webProps.ref);

  return (
    <span
      {...webProps}
      ref={mergedRef}
      data-testid={testID}
    >
      {children}
    </span>
  );
});

Text.displayName = 'Text';

export default Text; 