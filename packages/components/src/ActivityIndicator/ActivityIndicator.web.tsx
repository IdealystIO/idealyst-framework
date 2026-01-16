import { forwardRef, useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { ActivityIndicatorProps } from './types';
import { activityIndicatorStyles } from './ActivityIndicator.styles';
import useMergeRefs from '../hooks/useMergeRefs';
import { getWebLiveRegionAriaProps } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';

/**
 * Spinning loading indicator for async operations and content loading.
 * Supports intent-based coloring and automatic hiding when stopped.
 */
const ActivityIndicator = forwardRef<IdealystElement, ActivityIndicatorProps>(({
  animating = true,
  size = 'md',
  intent = 'primary',
  color,
  style,
  testID,
  hidesWhenStopped = true,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityLive,
  accessibilityBusy,
  accessibilityAtomic,
  accessibilityRelevant,
}, ref) => {
  // Generate ARIA props for loading state
  const ariaProps = useMemo(() => {
    return getWebLiveRegionAriaProps({
      accessibilityLabel: accessibilityLabel ?? 'Loading',
      accessibilityLive: accessibilityLive ?? 'polite',
      accessibilityBusy: accessibilityBusy ?? animating,
      accessibilityAtomic,
      accessibilityRelevant,
    });
  }, [accessibilityLabel, accessibilityLive, accessibilityBusy, animating, accessibilityAtomic, accessibilityRelevant]);
  // Handle numeric size
  const sizeVariant = typeof size === 'number' ? 'md' : size;
  const customSize = typeof size === 'number' ? size : undefined;

  // Apply variants using the correct Unistyles 3.0 pattern
  activityIndicatorStyles.useVariants({
    size: sizeVariant,
    animating,
  });

  // Don't render if not animating and hidesWhenStopped is true
  if (!animating && hidesWhenStopped) {
    return null;
  }

  // Create the style array following the official documentation pattern
  const containerStyleArray = [
    (activityIndicatorStyles.container as any)({}),
    customSize && {
      width: customSize,
      height: customSize,
    },
    style,
  ];

  const spinnerStyleArray = [
    (activityIndicatorStyles.spinner as any)({
      intent,
    }),
    customSize ? {
      width: customSize,
      height: customSize,
      borderWidth: Math.max(2, customSize / 10),
    } : {},
    color ? { borderTopColor: color, borderRightColor: color } : {},
    // Add inline CSS animation
    {
      animation: animating ? 'spin 1s linear infinite' : undefined,
    },
  ];

  // Use getWebProps to generate className and ref for web
  const containerProps = getWebProps(containerStyleArray);
  const spinnerProps = getWebProps(spinnerStyleArray);

  const mergedRef = useMergeRefs(ref, containerProps.ref);

  return (
    <>
      {/* Inject keyframes animation into the document head */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div {...containerProps} {...ariaProps} ref={mergedRef} role="status" id={id} data-testid={testID}>
        <div {...spinnerProps} />
      </div>
    </>
  );
});

ActivityIndicator.displayName = 'ActivityIndicator';

export default ActivityIndicator;