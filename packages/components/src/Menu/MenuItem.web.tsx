import React, { isValidElement } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { menuItemStyles } from './MenuItem.styles';
import type { MenuItem as MenuItemType } from './types';
import { IconSvg } from '../Icon/IconSvg.web';
import { resolveIconPath, isIconName } from '../Icon/icon-resolver';

interface MenuItemProps {
  item: MenuItemType;
  onPress: (item: MenuItemType) => void;
  size?: 'small' | 'medium' | 'large';
  testID?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onPress, size = 'medium', testID }) => {
  // Initialize styles with useVariants
  menuItemStyles.useVariants({
    size,
    disabled: Boolean(item.disabled),
    intent: item.intent || 'neutral',
  });

  const itemProps = getWebProps([menuItemStyles.item]);
  const iconProps = getWebProps([menuItemStyles.icon]);
  const labelProps = getWebProps([menuItemStyles.label]);

  const renderIcon = () => {
    if (!item.icon) return null;

    if (isIconName(item.icon)) {
      // Resolve icon name to path and render with IconSvg
      const iconPath = resolveIconPath(item.icon);
      return (
        <IconSvg
          path={iconPath}
          aria-label={item.icon}
        />
      );
    } else if (isValidElement(item.icon)) {
      // Render custom component as-is
      return item.icon;
    }

    return null;
  };

  return (
    <button
      className={itemProps.className}
      style={itemProps.style}
      onClick={() => onPress(item)}
      disabled={item.disabled}
      role="menuitem"
      data-testid={testID}
    >
      {item.icon && (
        <span className={iconProps.className} style={iconProps.style}>
          {renderIcon()}
        </span>
      )}
      <span className={labelProps.className} style={labelProps.style}>
        {item.label}
      </span>
    </button>
  );
};

export default MenuItem;
