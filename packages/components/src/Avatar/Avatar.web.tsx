import React, { useState, forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { AvatarProps } from './types';
import { avatarStyles } from './Avatar.styles';
import useMergeRefs from '../hooks/useMergeRefs';

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({
  src,
  alt,
  fallback,
  size = 'md',
  shape = 'circle',
  style,
  testID,
  id,
}, ref) => {
  const [hasError, setHasError] = useState(false);

  avatarStyles.useVariants({
    size,
    shape,
  });

  const avatarStyleArray = [avatarStyles.avatar, style];
  const avatarProps = getWebProps(avatarStyleArray);

  // Generate fallback text styles with proper theming and size
  const fallbackStyleArray = [avatarStyles.fallback];
  const fallbackProps = getWebProps(fallbackStyleArray);

  const handleImageError = () => {
    setHasError(true);
  };

  const mergedRef = useMergeRefs(ref, avatarProps.ref);

  return (
    <div {...avatarProps} ref={mergedRef} id={id} data-testid={testID}>
      {src && !hasError ? (
        <img
          src={src as any}
          alt={alt}
          onError={handleImageError}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span {...fallbackProps}>
          {fallback}
        </span>
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar; 