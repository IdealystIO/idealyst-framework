import React from 'react';
import { View, Pressable } from 'react-native';
import { CardProps } from './types';
import { cardStyles } from './Card.styles';

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  radius = 'medium',
  intent = 'neutral',
  clickable = false,
  onPress,
  disabled = false,
  style,
  testID,
  accessibilityLabel,
}) => {
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
};

export default Card; 