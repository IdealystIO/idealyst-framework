import React, { forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { ViewProps } from './types';
import { viewStyles } from './View.styles';
import useMergeRefs from '../hooks/useMergeRefs';
import type { IdealystElement } from '../utils/refTypes';

/**
 * Fundamental layout container with background, border, and spacing options.
 * The base building block for composing UI layouts.
 */
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
  // Override props (accepted but handled via style prop on web)
  backgroundColor: _backgroundColor,
  borderRadius: _borderRadius,
  borderWidth: _borderWidth,
  borderColor: _borderColor,
  scrollable,
  style,
  testID,
  id,
}, ref) => {
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
  /** @ts-ignore */
  const webProps = getWebProps((viewStyles.view as any)({}));
  /** @ts-ignore */
  const wrapperWebProps = getWebProps(viewStyles.scrollableWrapper);

  const mergedRef = useMergeRefs(ref, webProps.ref);

  // When scrollable, render a wrapper + content structure
  // Wrapper: sizing and margin (positioning in parent layout)
  // Content: absolutely positioned with overflow:auto, visual styles (padding, background, border)
  if (scrollable) {
    // Split user styles: layout/sizing to wrapper, visual styles to content
    const styleObj = (style as React.CSSProperties) || {};
    const {
      // Sizing - goes to wrapper
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      // Flex properties - goes to wrapper
      flex,
      flexGrow,
      flexShrink,
      flexBasis,
      alignSelf,
      // Flex content alignment - goes to content (for aligning children)
      alignItems,
      justifyContent,
      // Margin - goes to wrapper (positioning in parent)
      margin,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      marginBlock,
      marginInline,
      // Everything else (padding, background, border, etc.) - goes to content
      ...contentStyles
    } = styleObj;

    // Determine flex behavior:
    // - If explicit flex is provided, use it
    // - If explicit width/height are provided (without flex), disable flex
    // - Otherwise, let Unistyles' flex:1 apply
    const hasExplicitSize = width !== undefined || height !== undefined;
    const flexValue = flex !== undefined ? flex : (hasExplicitSize ? 'none' : undefined);

    // Only include defined values in wrapper styles
    const wrapperUserStyles: React.CSSProperties = {
      ...(width !== undefined && { width }),
      ...(height !== undefined && { height }),
      ...(minWidth !== undefined && { minWidth }),
      ...(minHeight !== undefined && { minHeight }),
      ...(maxWidth !== undefined && { maxWidth }),
      ...(maxHeight !== undefined && { maxHeight }),
      ...(flexValue !== undefined && { flex: flexValue }),
      ...(flexGrow !== undefined && { flexGrow }),
      ...(flexShrink !== undefined && { flexShrink }),
      ...(flexBasis !== undefined && { flexBasis }),
      ...(alignSelf !== undefined && { alignSelf }),
      ...(margin !== undefined && { margin }),
      ...(marginTop !== undefined && { marginTop }),
      ...(marginRight !== undefined && { marginRight }),
      ...(marginBottom !== undefined && { marginBottom }),
      ...(marginLeft !== undefined && { marginLeft }),
      ...(marginBlock !== undefined && { marginBlock }),
      ...(marginInline !== undefined && { marginInline }),
    };

    return (
      <div {...wrapperWebProps} style={wrapperUserStyles}>
        <div
          {...webProps}
          style={{
            // Critical: position/overflow must be enforced for scrolling
            position: 'absolute',
            inset: 0,
            overflow: 'auto',
            boxSizing: 'border-box',
            // Flex alignment for children
            ...(alignItems !== undefined && { alignItems }),
            ...(justifyContent !== undefined && { justifyContent }),
            // User's visual styles
            ...contentStyles,
          }}
          ref={mergedRef}
          id={id}
          data-testid={testID}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      {...webProps}
      style={style as any}
      ref={mergedRef}
      id={id}
      data-testid={testID}
    >
      {children}
    </div>
  );
});

View.displayName = 'View';

export default View;
