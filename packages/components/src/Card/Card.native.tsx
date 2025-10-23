import React, { forwardRef } from 'react';
import { View, Pressable } from 'react-native';
import { CardProps } from './types';
import { cardStyles } from './Card.styles';

const Card = forwardRef<View | Pressable, CardProps>(({
  children,
  variant = 'default',
  padding = 'md',
  radius = 'md',
  intent = 'neutral',
  clickable = false,
  onPress,
  disabled = false,
  style,
  testID,
  accessibilityLabel,
}, ref) => {
  // Apply variants
  cardStyles.useVariants({
    variant: variant as any,
    padding,
    radius,
    intent,
    clickable,
    disabled,
  });

  // Use appropriate component based on clickable state
  const Component = clickable ? Pressable : View;

  const componentProps = {
    ref: ref as any,
    style: [cardStyles.card({ intent }), style],
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