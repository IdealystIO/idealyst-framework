import React, { isValidElement } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { menuItemStyles } from './MenuItem.styles';
import type { MenuItem as MenuItemType, MenuSizeVariant } from './types';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { resolveIconPath, isIconName } from '../Icon/icon-resolver';

interface MenuItemProps {
  item: MenuItemType;
  onPress: (item: MenuItemType) => void;
  size?: MenuSizeVariant;
  testID?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onPress, size = 'md', testID }) => {
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
      {...itemProps}
      onClick={() => onPress(item)}
      disabled={item.disabled}
      role="menuitem"
      data-testid={testID}
    >
      {item.icon && (
        <span {...iconProps}>
          {renderIcon()}
        </span>
      )}
      <span {...labelProps}>
        {item.label}
      </span>
    </button>
  );
};

export default MenuItem;
