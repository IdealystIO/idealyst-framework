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
  // Initialize styles with useVariants (for size and disabled)
  menuItemStyles.useVariants({
    size,
    disabled: Boolean(item.disabled),
  });

  // Compute dynamic styles - call as functions for theme reactivity
  const itemStyle = (menuItemStyles.item as any)({ intent: item.intent || 'neutral' });
  const iconStyle = (menuItemStyles.icon as any)({});
  const labelStyle = (menuItemStyles.label as any)({});

  const itemProps = getWebProps([itemStyle]);
  const iconProps = getWebProps([iconStyle]);
  const labelProps = getWebProps([labelStyle]);

  const renderIcon = () => {
    if (!item.icon) return null;

    if (isIconName(item.icon)) {
      // Resolve icon name to path and render with IconSvg
      const iconPath = resolveIconPath(item.icon);
      // IconSvg uses size="1em" by default, sized by container's fontSize from styles
      return (
        <IconSvg
          path={iconPath}
          color="currentColor"
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

  // Button reset styles that must be applied directly
  const buttonResetStyles: React.CSSProperties = {
    display: 'flex',
    width: '100%',
    border: 'none',
    outline: 'none',
    cursor: item.disabled ? 'not-allowed' : 'pointer',
    background: 'transparent',
    textAlign: 'left',
  };

  return (
    <button
      {...itemProps}
      ref={mergedRef}
      style={{ ...buttonResetStyles, ...itemProps.style }}
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
