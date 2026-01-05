import React, { isValidElement, forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { menuItemStyles } from './MenuItem.styles';
import type { MenuItem as MenuItemType, MenuSizeVariant } from './types';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { resolveIconPath, isIconName } from '../Icon/icon-resolver';
import useMergeRefs from '../hooks/useMergeRefs';

interface MenuItemProps {
  item: MenuItemType;
  onPress: (item: MenuItemType) => void;
  size?: MenuSizeVariant;
  testID?: string;
}

const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(({ item, onPress, size = 'md', testID }, ref) => {
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

  // Merge refs
  const mergedRef = useMergeRefs(ref, itemProps.ref);

  return (
    <button
      {...itemProps}
      ref={mergedRef}
      onClick={() => onPress(item)}
      disabled={item.disabled}
      role="menuitem"
      aria-disabled={item.disabled}
      tabIndex={-1}
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
});

MenuItem.displayName = 'MenuItem';

export default MenuItem;
