import React from 'react';
import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { SVGImageProps } from './types';
import { svgImageStyles } from './SVGImage.styles';

const SVGImage: React.FC<SVGImageProps> = ({
  source,
  width,
  height,
  size,
  color,
  intent,
  style,
  testID,
  ...props
}) => {
  // Apply variants using Unistyles 3.0 pattern
  if (intent) {
    svgImageStyles.useVariants({
      intent: intent as 'primary' | 'success' | 'error' | 'warning' | 'neutral',
    });
  }

  // Determine dimensions - size takes precedence over individual width/height
  const finalWidth = size || width || 24;
  const finalHeight = size || height || 24;

  // Mode 1: Handle React components (imported SVG components)
  if (typeof source === 'function') {
    const SvgComponent = source;
    return (
      <View style={[svgImageStyles.container, style]} testID={testID} {...props}>
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
    <View style={[svgImageStyles.container, style]} testID={testID} {...props}>
      <SvgUri
        uri={sourceUri}
        width={finalWidth}
        height={finalHeight}
        fill={color}
        color={color}
      />
    </View>
  );
};

export default SVGImage;