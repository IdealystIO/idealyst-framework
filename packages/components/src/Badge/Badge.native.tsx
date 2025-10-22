import React, { isValidElement, forwardRef } from 'react';
import { View, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BadgeProps } from './types';
import { badgeStyles } from './Badge.styles';
import { isIconName } from '../Icon/icon-resolver';

const Badge = forwardRef<View, BadgeProps>(({
  children,
  icon,
  size = 'md',
  variant = 'filled',
  color = 'blue',
  style,
  testID,
}, ref) => {
  badgeStyles.useVariants({
    size,
    variant: variant as any,
    color,
  });

  // Map badge size to icon size
  const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;

  // Helper to render icon
  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string' && isIconName(icon)) {
      return (
        <MaterialCommunityIcons
          name={icon}
          size={iconSize}
          color={badgeStyles.text.color}
        />
      );
    } else if (isValidElement(icon)) {
      return icon;
    }
    return null;
  };

  if (variant === 'dot') {
    return (
      <View
        style={[badgeStyles.badge, style]}
        testID={testID}
        accessibilityLabel="status indicator"
      />
    );
  }

  const hasIcon = Boolean(icon);
  const hasChildren = Boolean(children);

  return (
    <View
      ref={ref}
      style={[badgeStyles.badge, style]}
      testID={testID}
      accessibilityLabel="badge"
    >
      {hasIcon && hasChildren ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {renderIcon()}
          <Text style={badgeStyles.text}>
            {children}
          </Text>
        </View>
      ) : hasIcon ? (
        renderIcon()
      ) : (
        <Text style={badgeStyles.text}>
          {children}
        </Text>
      )}
    </View>
  );
});

Badge.displayName = 'Badge';

export default Badge; 