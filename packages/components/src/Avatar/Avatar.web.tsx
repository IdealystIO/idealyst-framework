import React, { useState } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { AvatarProps } from './types';
import { avatarStyles } from './Avatar.styles';

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  size = 'medium',
  shape = 'circle',
  style,
  testID,
}) => {
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

  return (
    <div {...avatarProps} data-testid={testID}>
      {src && !hasError ? (
        <img
          src={src}
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
};

export default Avatar; 