import { forwardRef, useMemo, useEffect, useRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { CardProps } from './types';
import { cardStyles } from './Card.styles';
import useMergeRefs from '../hooks/useMergeRefs';
import { getWebInteractiveAriaProps } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';

// Track if we've logged the onClick deprecation warning (log once per session)
let hasLoggedOnClickWarning = false;

/**
 * Container component for grouping related content with elevation and styling options.
 * Supports elevated, outlined, and filled variants with optional click interaction.
 */
const Card = forwardRef<IdealystElement, CardProps>(({
  children,
  type: typeProp,
  variant,
  radius = 'md',
  intent: _intent,
  clickable = false,
  onPress,
  onClick,
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

  // variant is an alias for type - variant takes precedence if both are set
  const type = variant ?? typeProp ?? 'elevated';
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
    if (!disabled && clickable) {
      // Prefer onPress, fall back to deprecated onClick
      const handler = onPress ?? onClick;
      if (handler) {
        handler();
      }
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
