import React, { forwardRef, ComponentRef } from 'react';
import { View, Pressable } from 'react-native';
import { CardProps } from './types';
import { cardStyles } from './Card.styles';

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
  accessibilityLabel,
}, ref) => {
  // Apply variants
  cardStyles.useVariants({
    clickable,
    radius,
    type,
    intent,
    disabled,
    gap,
    padding,
    paddingVertical,
    paddingHorizontal,
    margin,
    marginVertical,
    marginHorizontal,
  });

  // Use appropriate component based on clickable state
  const Component = clickable ? Pressable : View;

  const componentProps = {
    ref,
    style: [cardStyles.card, style],
    testID,
    accessibilityLabel,
    // Only use button role for clickable cards in React Native
    ...(clickable && { accessibilityRole: 'button' as const }),
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
