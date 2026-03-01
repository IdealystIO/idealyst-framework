import { isValidElement, forwardRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { menuItemStyles } from './MenuItem.styles';
import type { MenuItem as MenuItemType, MenuSizeVariant } from './types';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import type { IdealystElement } from '../utils/refTypes';

interface MenuItemProps {
  item: MenuItemType;
  onPress: (item: MenuItemType) => void;
  size?: MenuSizeVariant;
  testID?: string;
}

const MenuItem = forwardRef<IdealystElement, MenuItemProps>(({ item, onPress, size = 'md', testID }, ref) => {
  // Initialize styles with useVariants (for size and disabled)
  menuItemStyles.useVariants({
    size,
    disabled: Boolean(item.disabled),
  });

  // Call styles as functions to get theme-reactive styles
  const itemStyle = (menuItemStyles.item as any)({ intent: item.intent || 'neutral' });
  const iconStyle = (menuItemStyles.icon as any)({});
  const labelStyle = (menuItemStyles.label as any)({});

  // Extract icon size from theme variant (fontSize is set by $menu.iconSize)
  const iconSize = iconStyle.fontSize || iconStyle.width || 20;

  const renderIcon = () => {
    if (!item.icon) return null;

    if (typeof item.icon === 'string') {
      return (
        <View style={{ width: iconSize, height: iconSize, alignItems: 'center', justifyContent: 'center', marginRight: iconStyle.marginRight || 12, flexShrink: 0 }}>
          <MaterialDesignIcons
            name={item.icon as any}
            size={iconSize}
            color={iconStyle.color}
          />
        </View>
      );
    } else if (isValidElement(item.icon)) {
      return (
        <View style={{ marginRight: iconStyle.marginRight || 12, flexShrink: 0 }}>
          {item.icon}
        </View>
      );
    }
    return null;
  };

  return (
    <Pressable
      ref={ref as any}
      style={itemStyle}
      onPress={() => onPress(item)}
      disabled={item.disabled}
      accessibilityRole="menuitem"
      accessibilityState={{
        disabled: item.disabled,
      }}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
      testID={testID}
    >
      {renderIcon()}
      <Text style={labelStyle} numberOfLines={1}>
        {item.label}
      </Text>
    </Pressable>
  );
});

MenuItem.displayName = 'MenuItem';

export default MenuItem;
