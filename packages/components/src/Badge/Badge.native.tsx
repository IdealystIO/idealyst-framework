import { isValidElement, forwardRef } from 'react';
import { View, Text } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { BadgeProps } from './types';
import { badgeStyles } from './Badge.styles';
import { isIconName } from '../Icon/icon-resolver';
import type { IdealystElement } from '../utils/refTypes';

/**
 * Small status indicator for counts, labels, or notifications.
 * Available in filled, outlined, and dot variants with customizable colors.
 *
 * Supports both `intent` (semantic colors) and `color` (raw palette colors).
 * If both are provided, `intent` takes precedence.
 */
const Badge = forwardRef<IdealystElement, BadgeProps>(({
  children,
  icon,
  size = 'md',
  type = 'filled',
  intent,
  color,
  style,
  testID,
  id,
}, ref) => {
  // Default to 'primary' intent if neither intent nor color is provided
  const effectiveColor = intent ? undefined : (color ?? 'primary');

  badgeStyles.useVariants({
    size,
    type,
  });

  // Call dynamic styles with intent/color - intent takes precedence
  const badgeStyle = (badgeStyles.badge as any)({ intent, color: effectiveColor });
  const textStyle = (badgeStyles.text as any)({ intent, color: effectiveColor });

  // Map badge size to icon size
  const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;

  // Helper to render icon
  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string' && isIconName(icon)) {
      return (
        <MaterialDesignIcons
          name={icon}
          size={iconSize}
          color={textStyle.color}
        />
      );
    } else if (isValidElement(icon)) {
      return icon;
    }
    return null;
  };


  if (type === 'dot') {
    return (
      <View
        nativeID={id}
        style={[badgeStyle, style]}
        testID={testID}
        accessibilityLabel="status indicator"
      />
    );
  }

  const hasIcon = Boolean(icon);
  const hasChildren = Boolean(children);

  return (
    <View
      ref={ref as any}
      nativeID={id}
      style={[badgeStyle, style]}
      testID={testID}
      accessibilityLabel="badge"
    >
      {hasIcon && hasChildren ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {renderIcon()}
          <Text style={textStyle}>
            {children}
          </Text>
        </View>
      ) : hasIcon ? (
        renderIcon()
      ) : (
        <Text style={textStyle}>
          {children}
        </Text>
      )}
    </View>
  );
});

Badge.displayName = 'Badge';

export default Badge; 