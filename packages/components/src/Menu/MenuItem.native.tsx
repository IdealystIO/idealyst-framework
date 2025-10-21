import React, { isValidElement } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '../Icon';
import { menuStyles } from './Menu.styles';
import type { MenuItem as MenuItemType } from './types';

interface MenuItemProps {
  item: MenuItemType;
  onPress: (item: MenuItemType) => void;
  testID?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onPress, testID }) => {
  // Apply variants for this specific item
  menuStyles.useVariants({
    disabled: Boolean(item.disabled),
    intent: item.intent || 'neutral',
  });

  const renderIcon = () => {
    if (!item.icon) return null;

    if (typeof item.icon === 'string') {
      return (
        <Icon
          name={item.icon}
          size={16}
          style={menuStyles.menuItemIcon}
        />
      );
    } else if (isValidElement(item.icon)) {
      return item.icon;
    }
    return null;
  };

  return (
    <Pressable
      style={menuStyles.menuItem}
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
        <View style={menuStyles.menuItemIcon}>
          {renderIcon()}
        </View>
      )}
      <Text style={menuStyles.menuItemLabel}>
        {item.label}
      </Text>
    </Pressable>
  );
};

export default MenuItem;
