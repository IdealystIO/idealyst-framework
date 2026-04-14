import { isValidElement, forwardRef } from 'react';
import { View, Text } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useUnistyles } from 'react-native-unistyles';
import type { Theme } from '@idealyst/theme';
import { BadgeProps } from './types';
import { badgeStyles, resolveBadgeColor } from './Badge.styles';
import { isIconName } from '../Icon/icon-resolver';
import type { IdealystElement } from '../utils/refTypes';

/**
 * Small status indicator for counts, labels, or notifications.
 * Available in filled, outlined, and dot variants with customizable colors.
 */
const Badge = forwardRef<IdealystElement, BadgeProps>((props, ref) => {
  const {
    children,
    icon,
    size = 'md',
    type: typeProp,
    variant,
    intent = 'primary',
    color,
    style,
    testID,
    id,
  } = props;

  const type = variant ?? typeProp ?? 'filled';
  const { theme } = useUnistyles() as { theme: Theme };

  badgeStyles.useVariants({ size, type, intent });

  // Resolve color prop overrides (only when color is set without explicit intent)
  const colorStyles = color && !props.intent
    ? resolveBadgeColor(theme, color, type)
    : null;

  // Map badge size to icon size
  const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;

  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string' && isIconName(icon)) {
      return (
        <MaterialDesignIcons
          name={icon}
          size={iconSize}
          color={colorStyles?.iconColor ?? (badgeStyles.icon as any).color}
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
        style={[badgeStyles.badge as any, colorStyles?.badge, style]}
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
      style={[badgeStyles.badge as any, colorStyles?.badge, style]}
      testID={testID}
      accessibilityLabel="badge"
    >
      {hasIcon && hasChildren ? (
        <View style={badgeStyles.content as any}>
          {renderIcon()}
          <Text style={[badgeStyles.text as any, colorStyles?.text]}>
            {children}
          </Text>
        </View>
      ) : hasIcon ? (
        renderIcon()
      ) : (
        <Text style={[badgeStyles.text as any, colorStyles?.text]}>
          {children}
        </Text>
      )}
    </View>
  );
});

Badge.displayName = 'Badge';

export default Badge;
