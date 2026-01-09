import React, { forwardRef, useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { useResponsiveStyle } from '@idealyst/theme';
import { ViewProps } from './types';
import { viewStyles } from './View.styles';
import useMergeRefs from '../hooks/useMergeRefs';

const View = forwardRef<HTMLDivElement, ViewProps>(({
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
  // Override props
  backgroundColor,
  borderRadius,
  borderWidth,
  borderColor,
  scrollable, // accepted but no-op on web - layout handles scrolling
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
  
  const mergedRef = useMergeRefs(ref, webProps.ref);

  return (
    <div
      style={style as any}
      {...webProps}
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
