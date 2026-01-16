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

  const renderIcon = () => {
    if (!item.icon) return null;

    if (typeof item.icon === 'string') {
      return (
        <MaterialDesignIcons
          name={item.icon as any}
          style={iconStyle}
        />
      );
    } else if (isValidElement(item.icon)) {
      return item.icon;
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
      {item.icon && (
        <View>
          {renderIcon()}
        </View>
      )}
      <Text style={labelStyle}>
        {item.label}
      </Text>
    </Pressable>
  );
});

MenuItem.displayName = 'MenuItem';

export default MenuItem;
