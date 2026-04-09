import React, { isValidElement, forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { menuItemStyles } from './MenuItem.styles';
import type { MenuItem as MenuItemType, MenuSizeVariant } from './types';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { isIconName } from '../Icon/icon-resolver';
import useMergeRefs from '../hooks/useMergeRefs';
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
    intent: item.intent || 'neutral',
    disabled: Boolean(item.disabled),
  });

  // Compute dynamic styles - call as functions for theme reactivity
  const intent = item.intent || 'neutral';
  const itemStyle = (menuItemStyles.item as any)({ intent });
  const iconStyle = (menuItemStyles.icon as any)({ intent });
  const labelStyle = (menuItemStyles.label as any)({ intent });

  const itemProps = getWebProps([itemStyle]);
  const iconProps = getWebProps([iconStyle]);
  const labelProps = getWebProps([labelStyle]);

  const renderIcon = () => {
    if (!item.icon) return null;

    if (isIconName(item.icon)) {
      // Use IconSvg with name - registry lookup happens inside
      return (
        <IconSvg
          name={item.icon}
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

  return (
    <button
      {...itemProps}
      ref={mergedRef}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onPress(item);
      }}
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
