import React, { forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { ScreenProps } from './types';
import { screenStyles } from './Screen.styles';
import useMergeRefs from '../hooks/useMergeRefs';

const Screen = forwardRef<HTMLDivElement, ScreenProps>(({
  children,
  background = 'primary',
  padding = 'md',
  safeArea = false,
  style,
  testID,
}, ref) => {
  screenStyles.useVariants({
    background,
    padding,
    safeArea,
  });

  // Use getWebProps to generate className and ref for web
  const webProps = getWebProps([screenStyles.screen, style]);

  const mergedRef = useMergeRefs(ref, webProps.ref);

  return (
    <div
      {...webProps}
      ref={mergedRef}
      data-testid={testID}
    >
      {children}
    </div>
  );
});

Screen.displayName = 'Screen';

export default Screen; 