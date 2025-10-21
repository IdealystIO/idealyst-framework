import React, { useState } from 'react';
import { Image as RNImage, View } from 'react-native';
import { imageStyles } from './Image.styles';
import type { ImageProps } from './types';
import ActivityIndicator from '../ActivityIndicator';

const Image: React.FC<ImageProps> = ({
  source,
  alt,
  width,
  height,
  aspectRatio,
  objectFit = 'cover',
  placeholder,
  fallback,
  onLoad,
  onError,
  borderRadius,
  style,
  testID,
  accessibilityLabel,
}) => {
  // Apply variants
  imageStyles.useVariants({});

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = (e: any) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(e);
  };

  // Map objectFit to React Native resizeMode
  const resizeMode = objectFit === 'contain' ? 'contain'
    : objectFit === 'cover' ? 'cover'
    : objectFit === 'fill' ? 'stretch'
    : objectFit === 'scale-down' ? 'contain'
    : 'cover';

  const imageSource = typeof source === 'string' ? { uri: source } : source;

  const containerStyle = [
    imageStyles.container,
    {
      width: width || '100%',
      height: height || undefined,
      aspectRatio: aspectRatio || undefined,
      borderRadius: borderRadius || undefined,
    },
    style,
  ];

  return (
    <View style={containerStyle} testID={testID}>
      <RNImage
        source={imageSource as any}
        style={[imageStyles.image, { borderRadius }]}
        resizeMode={resizeMode}
        onLoad={handleLoad}
        onError={handleError}
        accessibilityLabel={accessibilityLabel || alt}
      />

      {isLoading && !hasError && (
        <View style={imageStyles.placeholder}>
          {placeholder || <ActivityIndicator size="medium" />}
        </View>
      )}

      {hasError && (
        <View style={imageStyles.fallback}>
          {fallback}
        </View>
      )}
    </View>
  );
};

export default Image;
