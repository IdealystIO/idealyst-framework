import { useState, forwardRef, useMemo } from 'react';
import { View, Text, Image } from 'react-native';
import { AvatarProps } from './types';
import { avatarStyles } from './Avatar.styles';
import { getNativeAccessibilityProps } from '../utils/accessibility';

const Avatar = forwardRef<View, AvatarProps>(({
  src,
  alt,
  fallback,
  size = 'md',
  shape = 'circle',
  style,
  testID,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityDisabled,
  accessibilityHidden,
  accessibilityRole,
}, ref) => {
  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    return getNativeAccessibilityProps({
      accessibilityLabel: accessibilityLabel ?? alt,
      accessibilityHint,
      accessibilityDisabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'img',
    });
  }, [accessibilityLabel, alt, accessibilityHint, accessibilityDisabled, accessibilityHidden, accessibilityRole]);
  const [hasError, setHasError] = useState(false);

  avatarStyles.useVariants({
    size,
    shape,
  });

  const handleImageError = () => {
    setHasError(true);
  };

  const avatarStyle = (avatarStyles.avatar as any)({});
  const fallbackStyle = (avatarStyles.fallback as any)({});

  return (
    <View ref={ref} nativeID={id} style={[avatarStyle, style]} testID={testID} {...nativeA11yProps}>
      {src && !hasError ? (
        <Image
          source={typeof src === 'string' ? { uri: src } : src}
          style={avatarStyles.image}
          onError={handleImageError}
          accessibilityLabel={alt}
        />
      ) : (
        <Text style={fallbackStyle}>
          {fallback}
        </Text>
      )}
    </View>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar; 