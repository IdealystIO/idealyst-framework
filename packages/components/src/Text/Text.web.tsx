import { forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { TextProps } from './types';
import { textStyles } from './Text.styles';
import useMergeRefs from '../hooks/useMergeRefs';
import type { IdealystElement } from '../utils/refTypes';
import { flattenStyle } from '../utils/flattenStyle';

/**
 * Typography component for displaying text with predefined styles and semantic variants.
 * Supports multiple typography scales, colors, weights, and alignments.
 */
const Text = forwardRef<IdealystElement, TextProps>(({
  children,
  typography,
  weight,
  color = 'primary',
  align = 'left',
  numberOfLines,
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

  // Build numberOfLines truncation styles for web
  const truncationStyle: React.CSSProperties | undefined = numberOfLines != null
    ? numberOfLines === 1
      ? {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }
      : {
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical' as const,
          WebkitLineClamp: numberOfLines,
        }
    : undefined;

  // Create the style array - pass all style-affecting props to dynamic style function
  const textStyleArray = [
    (textStyles.text as any)({ color, typography, weight, align }),
    truncationStyle,
    flattenStyle(style),
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