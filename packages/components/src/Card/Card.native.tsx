import { forwardRef, useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { CardProps } from './types';
import { cardStyles } from './Card.styles';
import { getNativeInteractiveAccessibilityProps } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';

const Card = forwardRef<IdealystElement, CardProps>(({
  children,
  type = 'elevated',
  radius = 'md',
  intent: _intent = 'neutral',
  onPress,
  disabled = false,
  onLayout,
  // Spacing variants from ContainerStyleProps
  gap,
  padding,
  paddingVertical,
  paddingHorizontal,
  margin,
  marginVertical,
  marginHorizontal,
  background,
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
  // Derive pressable from whether onPress is provided
  const pressable = !!onPress;

  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    return getNativeInteractiveAccessibilityProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityDisabled: accessibilityDisabled ?? disabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? (pressable ? 'button' : 'none'),
      accessibilityPressed,
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityDisabled, disabled, accessibilityHidden, accessibilityRole, pressable, accessibilityPressed]);

  // Apply variants
  cardStyles.useVariants({
    type,
    radius,
    pressable,
    disabled,
    background,
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

  // Use appropriate component based on pressable state
  const Component = pressable ? Pressable : View;

  const componentProps = {
    ref,
    nativeID: id,
    style: [cardStyle, style],
    testID,
    onLayout,
    ...nativeA11yProps,
    ...(pressable && {
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
