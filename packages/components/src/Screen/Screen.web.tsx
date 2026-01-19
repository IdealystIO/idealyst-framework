import { forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { ScreenProps } from './types';
import { screenStyles } from './Screen.styles';
import useMergeRefs from '../hooks/useMergeRefs';
import { useWebLayout } from '../hooks/useWebLayout';
import type { IdealystElement } from '../utils/refTypes';

/**
 * Full-screen container for page layouts with background color and safe area support.
 * Provides the outermost wrapper for screen-level content.
 */
const Screen = forwardRef<IdealystElement, ScreenProps>(({
  children,
  background = 'screen',
  safeArea = false,
  onLayout,
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
  const layoutRef = useWebLayout<HTMLDivElement>(onLayout);

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

  const mergedRef = useMergeRefs(ref, webProps.ref, layoutRef);

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
