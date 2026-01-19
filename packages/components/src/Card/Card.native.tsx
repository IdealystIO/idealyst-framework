import { forwardRef, useMemo, useEffect, useRef } from 'react';
import { View, Pressable } from 'react-native';
import { CardProps } from './types';
import { cardStyles } from './Card.styles';
import { getNativeInteractiveAccessibilityProps } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';

// Track if we've logged the onClick deprecation warning (log once per session)
let hasLoggedOnClickWarning = false;

const Card = forwardRef<IdealystElement, CardProps>(({
  children,
  type = 'elevated',
  radius = 'md',
  intent: _intent = 'neutral',
  clickable = false,
  onPress,
  onClick,
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
  const hasWarnedRef = useRef(false);

  // Warn about onClick usage (deprecated)
  useEffect(() => {
    if (onClick && !hasWarnedRef.current && !hasLoggedOnClickWarning) {
      hasWarnedRef.current = true;
      hasLoggedOnClickWarning = true;
      console.warn(
        '[Card] onClick is deprecated. Use onPress instead.\n' +
        'Card is a cross-platform component that follows React Native conventions.\n' +
        'onClick will be removed in a future version.\n\n' +
        'Migration: Replace onClick={handler} with onPress={handler}'
      );
    }
  }, [onClick]);

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

  // Use appropriate component based on clickable state
  const Component = clickable ? Pressable : View;

  // Prefer onPress, fall back to deprecated onClick
  const pressHandler = onPress ?? onClick;

  const componentProps = {
    ref,
    nativeID: id,
    style: [cardStyle, style],
    testID,
    onLayout,
    ...nativeA11yProps,
    ...(clickable && {
      onPress: disabled ? undefined : pressHandler,
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
