import React from 'react';
import type { BlurViewWebProps, BlurType } from './types';

/**
 * Get the background color based on blur type
 */
const getBackgroundColor = (blurType: BlurType): string => {
  switch (blurType) {
    case 'light':
      return 'rgba(255, 255, 255, 0.3)';
    case 'dark':
      return 'rgba(0, 0, 0, 0.3)';
    case 'default':
    default:
      return 'transparent';
  }
};

/**
 * BlurView component for web using CSS backdrop-filter
 *
 * Uses the native CSS backdrop-filter property for efficient blur effects.
 * Note: backdrop-filter may not be supported in all browsers.
 *
 * @example
 * ```tsx
 * <BlurView intensity={50} blurType="light">
 *   <Text>Content with blurred background</Text>
 * </BlurView>
 * ```
 */
export const BlurView: React.FC<BlurViewWebProps> = ({
  intensity = 50,
  blurType = 'default',
  children,
  style,
  className,
  testID,
}) => {
  const blurAmount = Math.max(0, Math.min(100, intensity)) / 5;

  const blurStyle: React.CSSProperties = {
    backdropFilter: `blur(${blurAmount}px)`,
    WebkitBackdropFilter: `blur(${blurAmount}px)`,
    backgroundColor: getBackgroundColor(blurType),
    ...(style as React.CSSProperties),
  };

  return (
    <div style={blurStyle} className={className} data-testid={testID}>
      {children}
    </div>
  );
};

export default BlurView;
