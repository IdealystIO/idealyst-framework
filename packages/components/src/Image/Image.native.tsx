import React, { useState } from 'react';
import { Image as RNImage, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
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
  const { styles, theme } = useStyles(stylesheet);
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
    styles.container,
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
        style={[styles.image, { borderRadius }]}
        resizeMode={resizeMode}
        onLoad={handleLoad}
        onError={handleError}
        accessibilityLabel={accessibilityLabel || alt}
      />

      {isLoading && !hasError && (
        <View style={styles.placeholder}>
          {placeholder || <ActivityIndicator size="medium" />}
        </View>
      )}

      {hasError && (
        <View style={styles.fallback}>
          {fallback}
        </View>
      )}
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme.colors.surface.secondary,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface.secondary,
  },

  fallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface.tertiary,
  },
}));

export default Image;
