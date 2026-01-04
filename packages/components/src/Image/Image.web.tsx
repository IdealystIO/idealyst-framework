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
  id,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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

  const containerProps = getWebProps([
    imageStyles.container,
    style,
    {
      width: width || '100%',
      height: height || 'auto',
      aspectRatio: aspectRatio ? String(aspectRatio) : undefined,
      borderRadius: borderRadius ? `${borderRadius}px` : undefined,
    } as any,
  ]);

  const imageProps = getWebProps([
    imageStyles.image,
    {
      objectFit: objectFit,
      borderRadius: borderRadius ? `${borderRadius}px` : undefined,
    }
  ]);

  const placeholderProps = getWebProps([imageStyles.placeholder]);
  const fallbackProps = getWebProps([imageStyles.fallback]);

  return (
    <div
      {...containerProps}
      id={id}
      data-testid={testID}
    >
      <img
        {...imageProps}
        src={imageSource}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        aria-label={accessibilityLabel || alt}
      />

      {isLoading && !hasError && (
        <div {...placeholderProps}>
          {placeholder || <ActivityIndicator size="md" />}
        </div>
      )}

      {hasError && (
        <div {...fallbackProps}>
          {fallback || <span>Failed to load image</span>}
        </div>
      )}
    </div>
  );
};

export default Image;
