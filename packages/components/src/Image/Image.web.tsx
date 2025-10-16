import React, { useState } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { imageStyles } from './Image.styles';
import type { ImageProps } from './types';
import ActivityIndicator from '../ActivityIndicator';

const Image: React.FC<ImageProps> = ({
  source,
  alt = '',
  width,
  height,
  aspectRatio,
  objectFit = 'cover',
  loading = 'lazy',
  placeholder,
  fallback,
  onLoad,
  onError,
  borderRadius,
  style,
  testID,
  accessibilityLabel,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const containerProps = getWebProps([imageStyles.container, style]);
  const imageProps = getWebProps([imageStyles.image]);
  const placeholderProps = getWebProps([imageStyles.placeholder]);
  const fallbackProps = getWebProps([imageStyles.fallback]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(e);
  };

  const imageSource = typeof source === 'string' ? source : (source as any)?.uri || '';

  const containerStyle: React.CSSProperties = {
    ...containerProps.style,
    width: width || '100%',
    height: height || 'auto',
    aspectRatio: aspectRatio ? String(aspectRatio) : undefined,
    borderRadius: borderRadius ? `${borderRadius}px` : undefined,
  };

  const imgStyle: React.CSSProperties = {
    ...imageProps.style,
    objectFit: objectFit,
    borderRadius: borderRadius ? `${borderRadius}px` : undefined,
  };

  return (
    <div
      className={containerProps.className}
      style={containerStyle}
      data-testid={testID}
    >
      <img
        src={imageSource}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        style={imgStyle}
        aria-label={accessibilityLabel || alt}
      />

      {isLoading && !hasError && (
        <div
          className={placeholderProps.className}
          style={placeholderProps.style}
        >
          {placeholder || <ActivityIndicator size="medium" />}
        </div>
      )}

      {hasError && (
        <div
          className={fallbackProps.className}
          style={fallbackProps.style}
        >
          {fallback || <span>Failed to load image</span>}
        </div>
      )}
    </div>
  );
};

export default Image;
