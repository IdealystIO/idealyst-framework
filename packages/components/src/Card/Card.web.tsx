import React, { forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { CardProps } from './types';
import { cardStyles } from './Card.styles';
import useMergeRefs from '../hooks/useMergeRefs';

const Card = forwardRef<HTMLDivElement | HTMLButtonElement, CardProps>(({
  children,
  type = 'elevated',
  padding = 'md',
  radius = 'md',
  intent,
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
    clickable,
    radius,
    type,
    padding,
    intent,
    disabled,
  });

  // Generate web props
  const webProps = getWebProps([cardStyles.card, style as any]);

  const mergedRef = useMergeRefs(ref, webProps.ref);

  // Use appropriate HTML element based on clickable state
  const Component: any = clickable ? 'button' : 'div';

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