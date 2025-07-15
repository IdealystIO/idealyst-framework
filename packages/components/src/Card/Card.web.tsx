import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { CardProps } from './types';
import { cardStyles, cardHoverStyles } from './Card.styles';

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
  const handleClick = () => {
    if (!disabled && clickable && onPress) {
      onPress();
    }
  };

  // Apply variants
  cardStyles.useVariants({
    variant: variant as any,
    padding,
    radius,
    intent,
    clickable,
    disabled,
  });

  // Create style arrays
  const cardStyleArray = [
    cardStyles.card,
    clickable && !disabled && cardHoverStyles.clickableHover,
    style,
  ].filter(Boolean);

  // Generate web props
  const webProps = getWebProps(cardStyleArray);

  // Use appropriate HTML element based on clickable state
  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      {...webProps}
      onClick={clickable ? handleClick : undefined}
      disabled={clickable && disabled}
      data-testid={testID}
      aria-label={accessibilityLabel}
      role={clickable ? 'button' : undefined}
    >
      {children}
    </Component>
  );
};

export default Card; 