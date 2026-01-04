import React, { useState, forwardRef } from 'react';
import { Image as RNImage, View } from 'react-native';
import { imageStyles } from './Image.styles';
import type { ImageProps } from './types';
import ActivityIndicator from '../ActivityIndicator';

const Image = forwardRef<View, ImageProps>(({
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
  id,
}, ref) => {

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
    <View ref={ref} nativeID={id} style={containerStyle as any} testID={testID}>
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
          {placeholder || <ActivityIndicator size="md" />}
        </View>
      )}

      {hasError && (
        <View style={imageStyles.fallback}>
          {fallback}
        </View>
      )}
    </View>
  );
});

Image.displayName = 'Image';

export default Image;
