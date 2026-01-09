import React, { forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { ScreenProps } from './types';
import { screenStyles } from './Screen.styles';
import useMergeRefs from '../hooks/useMergeRefs';

/**
 * Full-screen container for page layouts with background color and safe area support.
 * Provides the outermost wrapper for screen-level content.
 */
const Screen = forwardRef<HTMLDivElement, ScreenProps>(({
  children,
  background = 'screen',
  safeArea = false,
  // Spacing variants from ContainerStyleProps
  gap,
  padding,
  paddingVertical,
  paddingHorizontal,
  margin,
  marginVertical,
  marginHorizontal,
  style,
  testID,
  id,
}, ref) => {
  screenStyles.useVariants({
    background,
    safeArea,
    gap,
    padding,
    paddingVertical,
    paddingHorizontal,
    margin,
    marginVertical,
    marginHorizontal,
  });

  // Call style as function to get theme-reactive styles
  const webProps = getWebProps([(screenStyles.screen as any)({}), style as any]);

  const mergedRef = useMergeRefs(ref, webProps.ref);

  return (
    <div
      {...webProps}
      ref={mergedRef}
      id={id}
      data-testid={testID}
    >
      {children}
    </div>
  );
});

Screen.displayName = 'Screen';

export default Screen;
