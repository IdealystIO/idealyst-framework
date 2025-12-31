import React, { forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { TextProps } from './types';
import { textStyles } from './Text.styles';
import useMergeRefs from '../hooks/useMergeRefs';

const Text = forwardRef<HTMLSpanElement, TextProps>(({
  children,
  typography,
  size = 'md',
  weight = 'normal',
  color = 'primary',
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

  // Create the style array - pass typography to dynamic style function
  const textStyleArray = [
    textStyles.text({ color, typography }),
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