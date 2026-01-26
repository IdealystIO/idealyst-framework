import { forwardRef, useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { CardProps } from './types';
import { cardStyles } from './Card.styles';
import useMergeRefs from '../hooks/useMergeRefs';
import { useWebLayout } from '../hooks/useWebLayout';
import { getWebInteractiveAriaProps } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';
import { flattenStyle } from '../utils/flattenStyle';

/**
 * Container component for grouping related content with elevation and styling options.
 * Supports elevated, outlined, and filled variants with optional press interaction.
 */
const Card = forwardRef<IdealystElement, CardProps>(({
  children,
  type: typeProp,
  variant,
  radius = 'md',
  intent: _intent,
  background,
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
  const layoutRef = useWebLayout<HTMLElement>(onLayout);

  // Derive pressable from whether onPress is provided
  const pressable = !!onPress;

  // variant is an alias for type - variant takes precedence if both are set
  const type = variant ?? typeProp ?? 'elevated';

  // Generate ARIA props
  const ariaProps = useMemo(() => {
    return getWebInteractiveAriaProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityDisabled: accessibilityDisabled ?? disabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? (pressable ? 'button' : 'region'),
      accessibilityPressed,
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityDisabled, disabled, accessibilityHidden, accessibilityRole, pressable, accessibilityPressed]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && onPress) {
      onPress();
    }
  };

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

  // Generate web props
  const webProps = getWebProps([cardStyle, flattenStyle(style)]);

  const mergedRef = useMergeRefs(ref, webProps.ref, layoutRef);

  return (
    <div
      {...webProps}
      {...ariaProps}
      ref={mergedRef as any}
      id={id}
      onClick={pressable ? handleClick : undefined}
      data-testid={testID}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
