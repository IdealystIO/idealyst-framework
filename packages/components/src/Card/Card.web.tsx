import React, { forwardRef, useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { CardProps } from './types';
import { cardStyles } from './Card.styles';
import useMergeRefs from '../hooks/useMergeRefs';
import { getWebInteractiveAriaProps } from '../utils/accessibility';

/**
 * Container component for grouping related content with elevation and styling options.
 * Supports elevated, outlined, and filled variants with optional click interaction.
 */
const Card = forwardRef<HTMLDivElement | HTMLButtonElement, CardProps>(({
  children,
  type = 'elevated',
  radius = 'md',
  intent,
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
  // Generate ARIA props
  const ariaProps = useMemo(() => {
    return getWebInteractiveAriaProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityDisabled: accessibilityDisabled ?? disabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? (clickable ? 'button' : 'region'),
      accessibilityPressed,
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityDisabled, disabled, accessibilityHidden, accessibilityRole, clickable, accessibilityPressed]);
  const handleClick = () => {
    if (!disabled && clickable && onPress) {
      onPress();
    }
  };

  // Apply variants
  cardStyles.useVariants({
    type,
    radius,
    clickable,
    disabled,
    gap,
    padding,
    paddingVertical,
    paddingHorizontal,
    margin,
    marginVertical,
    marginHorizontal,
  });

  // Get card style
  const cardStyle = (cardStyles.card as any)({});

  // Generate web props
  const webProps = getWebProps([cardStyle, style as any]);

  const mergedRef = useMergeRefs(ref, webProps.ref);

  // Use appropriate HTML element based on clickable state
  const Component: any = clickable ? 'button' : 'div';

  return (
    <Component
      {...webProps}
      {...ariaProps}
      ref={mergedRef as any}
      id={id}
      onClick={clickable ? handleClick : undefined}
      disabled={clickable && disabled}
      data-testid={testID}
    >
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

export default Card;
