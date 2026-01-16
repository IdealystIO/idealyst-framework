import { forwardRef } from 'react';
import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { SVGImageProps } from './types';
import { svgImageStyles } from './SVGImage.styles';
import type { IdealystElement } from '../utils/refTypes';

const SVGImage = forwardRef<IdealystElement, SVGImageProps>(({
  source,
  width,
  height,
  size,
  color,
  intent,
  style,
  testID,
  id,
  ...props
}, ref) => {
  // Apply variants using Unistyles 3.0 pattern
  if (intent) {
    svgImageStyles.useVariants({
      intent: intent as 'primary' | 'success' | 'danger' | 'warning' | 'neutral',
    });
  }

  // Determine dimensions - size takes precedence over individual width/height
  const finalWidth = size || width || 24;
  const finalHeight = size || height || 24;

  // Mode 1: Handle React components (imported SVG components)
  if (typeof source === 'function') {
    const SvgComponent = source;
    return (
      <View ref={ref as any} nativeID={id} style={[svgImageStyles.container, style]} testID={testID} {...props}>
        <SvgComponent
          width={finalWidth}
          height={finalHeight}
          fill={color}
          color={color}
        />
      </View>
    );
  }

  // Mode 2: Handle URI-based SVG loading
  const sourceUri = typeof source === 'string' ? source : source.uri;

  return (
    <View ref={ref as any} nativeID={id} style={[svgImageStyles.container, style]} testID={testID} {...props}>
      <SvgUri
        uri={sourceUri}
        width={finalWidth}
        height={finalHeight}
        fill={color}
        color={color}
      />
    </View>
  );
});

SVGImage.displayName = 'SVGImage';

export default SVGImage;