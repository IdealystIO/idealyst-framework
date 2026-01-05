import React, { forwardRef, ComponentRef, useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { CardProps } from './types';
import { cardStyles } from './Card.styles';
import { getNativeInteractiveAccessibilityProps } from '../utils/accessibility';

const Card = forwardRef<ComponentRef<typeof View> | ComponentRef<typeof Pressable>, CardProps>(({
  children,
  type = 'elevated',
  radius = 'md',
  intent = 'neutral',
  clickable = false,
  onPress,
  disabled = false,
  // Spacing variants from ContainerStyleProps
  gap,
  padding,
  paddingVertical,
  paddingHorizontal,
  margin,
  marginVertical,
  marginHorizontal,
  style,
  testID,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityDisabled,
  accessibilityHidden,
  accessibilityRole,
  accessibilityPressed,
}, ref) => {
  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    return getNativeInteractiveAccessibilityProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityDisabled: accessibilityDisabled ?? disabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? (clickable ? 'button' : 'none'),
      accessibilityPressed,
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityDisabled, disabled, accessibilityHidden, accessibilityRole, clickable, accessibilityPressed]);
  // Apply variants (for radius, clickable, disabled, and spacing)
  cardStyles.useVariants({
    clickable,
    radius,
    disabled,
    gap,
    padding,
    paddingVertical,
    paddingHorizontal,
    margin,
    marginVertical,
    marginHorizontal,
  });

  // Get dynamic card style with type and intent props
  const cardStyle = (cardStyles.card as any)({ type, intent });

  // Use appropriate component based on clickable state
  const Component = clickable ? Pressable : View;

  const componentProps = {
    ref,
    nativeID: id,
    style: [cardStyle, style],
    testID,
    ...nativeA11yProps,
    ...(clickable && {
      onPress: disabled ? undefined : onPress,
      disabled,
      android_ripple: { color: 'rgba(0, 0, 0, 0.1)' },
    }),
  };

  return (
    <Component {...componentProps}>
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

export default Card;
