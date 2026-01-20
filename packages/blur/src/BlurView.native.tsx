import React from 'react';
import { BlurView as RNBlurView } from '@react-native-community/blur';
import type { BlurViewNativeProps, BlurType } from './types';

/**
 * Map our blur types to react-native-community/blur types
 */
const mapBlurType = (
  blurType: BlurType
): 'light' | 'dark' | 'xlight' | 'prominent' | 'regular' => {
  switch (blurType) {
    case 'light':
      return 'light';
    case 'dark':
      return 'dark';
    case 'default':
    default:
      return 'regular';
  }
};

/**
 * BlurView component for React Native using @react-native-community/blur
 *
 * Wraps the native blur implementation with a consistent API matching the web version.
 *
 * @example
 * ```tsx
 * <BlurView intensity={50} blurType="light">
 *   <Text>Content with blurred background</Text>
 * </BlurView>
 * ```
 */
export const BlurView: React.FC<BlurViewNativeProps> = ({
  intensity = 50,
  blurType = 'default',
  children,
  style,
  testID,
  reducedTransparencyFallbackColor,
}) => {
  const normalizedIntensity = Math.max(0, Math.min(100, intensity));

  return (
    <RNBlurView
      style={style}
      blurType={mapBlurType(blurType)}
      blurAmount={normalizedIntensity / 10}
      reducedTransparencyFallbackColor={reducedTransparencyFallbackColor}
      testID={testID}
    >
      {children}
    </RNBlurView>
  );
};

export default BlurView;
