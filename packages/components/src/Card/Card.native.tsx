import React, { forwardRef, ComponentRef } from 'react';
import { View, Pressable } from 'react-native';
import { CardProps } from './types';
import { cardStyles } from './Card.styles';

const Card = forwardRef<ComponentRef<typeof View> | ComponentRef<typeof Pressable>, CardProps>(({
  children,
  type = 'default',
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
    clickable,
    disabled,
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