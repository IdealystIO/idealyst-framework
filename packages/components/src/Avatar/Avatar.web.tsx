import { useState, forwardRef, useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { AvatarProps } from './types';
import { avatarStyles } from './Avatar.styles';
import useMergeRefs from '../hooks/useMergeRefs';
import { getWebAriaProps } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';

/**
 * User or entity representation with image support and fallback initials.
 * Available in circle or square shapes with multiple sizes.
 */
const Avatar = forwardRef<IdealystElement, AvatarProps>(({
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
  // Generate ARIA props
  const ariaProps = useMemo(() => {
    return getWebAriaProps({
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

  const avatarStyleArray = [(avatarStyles.avatar as any)({}), style];
  const avatarProps = getWebProps(avatarStyleArray);

  // Generate fallback text styles with proper theming and size
  const fallbackStyleArray = [(avatarStyles.fallback as any)({})];
  const fallbackProps = getWebProps(fallbackStyleArray);

  const handleImageError = () => {
    setHasError(true);
  };

  const mergedRef = useMergeRefs(ref, avatarProps.ref);

  return (
    <div {...avatarProps} {...ariaProps} ref={mergedRef} id={id} data-testid={testID}>
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