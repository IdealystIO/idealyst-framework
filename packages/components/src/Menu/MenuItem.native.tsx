import React, { isValidElement, forwardRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '../Icon';
import { menuItemStyles } from './MenuItem.styles';
import type { MenuItem as MenuItemType, MenuSizeVariant } from './types';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

interface MenuItemProps {
  item: MenuItemType;
  onPress: (item: MenuItemType) => void;
  size?: MenuSizeVariant;
  testID?: string;
}

const MenuItem = forwardRef<Pressable, MenuItemProps>(({ item, onPress, size = 'md', testID }, ref) => {
  // Initialize styles with useVariants
  menuItemStyles.useVariants({
    size,
    disabled: Boolean(item.disabled),
    intent: item.intent || 'neutral',
  });

  console.log(Icon)

  const renderIcon = () => {
    if (!item.icon) return null;

    if (typeof item.icon === 'string') {
      return (
        <MaterialDesignIcons
          name={item.icon as any}
          style={menuItemStyles.icon}
        />
      );
    } else if (isValidElement(item.icon)) {
      return item.icon;
    }
    return null;
  };

  return (
    <Pressable
      ref={ref}
      style={menuItemStyles.item}
      onPress={() => onPress(item)}
      disabled={item.disabled}
      accessibilityRole="menuitem"
      accessibilityState={{
        disabled: item.disabled,
      }}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
      testID={testID}
    >
      {item.icon && (
        <View>
          {renderIcon()}
        </View>
      )}
      <Text style={menuItemStyles.label}>
        {item.label}
      </Text>
    </Pressable>
  );
});

MenuItem.displayName = 'MenuItem';

export default MenuItem;
