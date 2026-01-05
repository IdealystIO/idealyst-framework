import React, { forwardRef, isValidElement, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  breadcrumbContainerStyles,
  breadcrumbItemStyles,
  breadcrumbSeparatorStyles,
  breadcrumbEllipsisStyles,
  breadcrumbMenuButtonStyles
} from './Breadcrumb.styles';
import type { BreadcrumbProps, BreadcrumbItem as BreadcrumbItemType } from './types';
import Icon from '../Icon';
import type { IconName } from '../Icon/icon-types';
import Menu from '../Menu/Menu.native';
import type { MenuItem } from '../Menu/types';

interface BreadcrumbItemProps {
  item: BreadcrumbItemType;
  isLast: boolean;
  size: BreadcrumbProps['size'];
  intent: BreadcrumbProps['intent'];
  itemStyle?: BreadcrumbProps['itemStyle'];
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ item, isLast, size, intent, itemStyle }) => {
  const isClickable = !!item.onPress && !item.disabled;
  const isDisabled = item.disabled || false;

  // Apply size variant
  breadcrumbItemStyles.useVariants({
    size,
  });

  // Get dynamic item text style
  const itemTextStyle = (breadcrumbItemStyles.itemText as any)({
    intent,
    isLast,
    disabled: isDisabled,
    clickable: isClickable,
  });

  const iconStyle = breadcrumbItemStyles.icon;

  const renderIcon = () => {
    if (!item.icon) return null;

    if (typeof item.icon === 'string') {
      const iconSize = iconStyle.width || 16;
      return (
        <Icon
          name={item.icon as IconName}
          size={iconSize}
          style={iconStyle}
        />
      );
    } else if (isValidElement(item.icon)) {
      return item.icon;
    }

    return null;
  };

  const content = (
    <View style={[breadcrumbItemStyles.item, itemStyle]}>
      {item.icon && <View style={iconStyle}>{renderIcon()}</View>}
      <Text style={itemTextStyle}>{item.label}</Text>
    </View>
  );

  if (isClickable) {
    return (
      <Pressable
        onPress={item.onPress}
        disabled={item.disabled}
        accessibilityRole="link"
        accessibilityState={{
          disabled: item.disabled,
        }}
      >
        {content}
      </Pressable>
    );
  }

  return <View>{content}</View>;
};

interface BreadcrumbSeparatorProps {
  separator: React.ReactNode;
  size: BreadcrumbProps['size'];
  separatorStyle?: BreadcrumbProps['separatorStyle'];
}

const BreadcrumbSeparator: React.FC<BreadcrumbSeparatorProps> = ({ separator, size, separatorStyle }) => {
  breadcrumbSeparatorStyles.useVariants({ size });
  const sepStyle = breadcrumbSeparatorStyles.separator;

  if (typeof separator === 'string') {
    return <Text style={[sepStyle, separatorStyle]}>{separator}</Text>;
  }
  return <View style={[sepStyle, separatorStyle]}>{separator}</View>;
};

interface BreadcrumbEllipsisProps {
  size: BreadcrumbProps['size'];
  intent: BreadcrumbProps['intent'];
}

const BreadcrumbEllipsis: React.FC<BreadcrumbEllipsisProps> = ({ size, intent }) => {
  breadcrumbEllipsisStyles.useVariants({ size });
  const iconStyle = breadcrumbEllipsisStyles.icon({ intent });

  return (
    <View style={breadcrumbEllipsisStyles.ellipsis}>
      <Icon name="dots-horizontal" style={iconStyle} />
    </View>
  );
};

const Breadcrumb = forwardRef<View, BreadcrumbProps>(({
  items,
  separator = '/',
  maxItems,
  intent = 'primary',
  size = 'md',
  style,
  itemStyle,
  separatorStyle,
  testID,
  responsive = false,
  minVisibleItems = 3,
  id,
}, ref) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Apply variants for menu button
  breadcrumbMenuButtonStyles.useVariants({ size });
  const menuIconStyle = breadcrumbMenuButtonStyles.icon({ intent });

  // Handle responsive collapsing
  let displayItems = items;
  let collapsedItems: BreadcrumbItemType[] = [];
  let showMenu = false;
  let showEllipsis = false;

  if (responsive && items.length > minVisibleItems) {
    // Responsive mode: show first item + menu + last (minVisibleItems - 2) items
    showMenu = true;
    const lastItemCount = Math.max(1, minVisibleItems - 2);
    displayItems = [
      items[0],
      ...items.slice(-lastItemCount),
    ];
    collapsedItems = items.slice(1, -(lastItemCount));
  } else if (maxItems && items.length > maxItems) {
    // Legacy truncation mode
    showEllipsis = true;
    const firstItems = items.slice(0, 1);
    const lastItems = items.slice(-(maxItems - 1));
    displayItems = [...firstItems, ...lastItems];
  }

  // Convert collapsed breadcrumb items to menu items
  const menuItems: MenuItem[] = collapsedItems.map((item, index) => ({
    id: `collapsed-${index}`,
    label: item.label,
    onClick: item.onPress,
    disabled: item.disabled,
    icon: typeof item.icon === 'string' ? (item.icon as IconName) : undefined,
  }));

  return (
    <View
      ref={ref}
      nativeID={id}
      style={[breadcrumbContainerStyles.container, style]}
      testID={testID}
      accessibilityLabel="Breadcrumb"
    >
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const shouldShowEllipsis = showEllipsis && index === 1;
        const shouldShowMenu = showMenu && index === 1;

        return (
          <React.Fragment key={index}>
            {shouldShowEllipsis && (
              <>
                <BreadcrumbEllipsis size={size} intent={intent} />
                <BreadcrumbSeparator separator={separator} size={size} separatorStyle={separatorStyle} />
              </>
            )}

            {shouldShowMenu && (
              <>
                <Menu
                  items={menuItems}
                  open={menuOpen}
                  onOpenChange={setMenuOpen}
                  placement="bottom-start"
                  size={size}
                >
                  <Pressable
                    style={breadcrumbMenuButtonStyles.button}
                    accessibilityRole="button"
                    accessibilityLabel="Show more breadcrumb items"
                  >
                    <Icon name="dots-horizontal" style={menuIconStyle} />
                  </Pressable>
                </Menu>
                <BreadcrumbSeparator separator={separator} size={size} separatorStyle={separatorStyle} />
              </>
            )}

            <BreadcrumbItem
              item={item}
              isLast={isLast}
              size={size}
              intent={intent}
              itemStyle={itemStyle}
            />

            {!isLast && (
              <BreadcrumbSeparator separator={separator} size={size} separatorStyle={separatorStyle} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
});

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
