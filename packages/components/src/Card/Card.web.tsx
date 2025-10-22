import React, { forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { CardProps } from './types';
import { cardStyles, cardHoverStyles } from './Card.styles';
import useMergeRefs from '../hooks/useMergeRefs';

const Card = forwardRef<HTMLDivElement | HTMLButtonElement, CardProps>(({
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

  const mergedRef = useMergeRefs(ref, webProps.ref);

  // Use appropriate HTML element based on clickable state
  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      {...webProps}
      ref={mergedRef as any}
      onClick={clickable ? handleClick : undefined}
      disabled={clickable && disabled}
      data-testid={testID}
      aria-label={accessibilityLabel}
      role={clickable ? 'button' : undefined}
    >
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

export default Card; 