import React, { isValidElement, useState } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { breadcrumbStyles } from './Breadcrumb.styles';
import type { BreadcrumbProps, BreadcrumbItem as BreadcrumbItemType } from './types';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { isIconName } from '../Icon/icon-resolver';
import Menu from '../Menu/Menu.web';
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
  breadcrumbStyles.useVariants({
    size,
  });

  // Get dynamic styles - call as functions for theme reactivity
  const itemStyle_ = (breadcrumbStyles.item as any)({});
  const itemTextStyle = (breadcrumbStyles.itemText as any)({
    intent,
    isLast,
    disabled: isDisabled,
    clickable: isClickable,
  });
  const iconStyle = (breadcrumbStyles.icon as any)({});

  const itemProps = getWebProps([itemStyle_]);
  const itemTextProps = getWebProps([itemTextStyle, itemStyle]);
  const iconProps = getWebProps([iconStyle]);

  const handleClick = () => {
    if (!item.disabled && item.onPress) {
      item.onPress();
    }
  };

  const renderIcon = () => {
    if (!item.icon) return null;

    if (isIconName(item.icon)) {
      return (
        <IconSvg
          name={item.icon}
          aria-label={item.icon}
        />
      );
    } else if (isValidElement(item.icon)) {
      return item.icon;
    }

    return null;
  };

  const content = (
    <div {...itemProps}>
      {item.icon && (
        <span
          {...iconProps}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderIcon()}
        </span>
      )}
      <span {...itemTextProps}>
        {item.label}
      </span>
    </div>
  );

  if (isClickable) {
    return (
      <button
        onClick={handleClick}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          textDecoration: 'none',
        }}
        disabled={isDisabled}
        aria-current={isLast ? 'page' : undefined}
      >
        {content}
      </button>
    );
  }

  return (
    <div aria-current={isLast ? 'page' : undefined}>
      {content}
    </div>
  );
};

interface BreadcrumbSeparatorProps {
  separator: React.ReactNode;
  size: BreadcrumbProps['size'];
  separatorStyle?: BreadcrumbProps['separatorStyle'];
}

const BreadcrumbSeparator: React.FC<BreadcrumbSeparatorProps> = ({ separator, size, separatorStyle }) => {
  breadcrumbStyles.useVariants({ size });
  const separatorStyle_ = (breadcrumbStyles.separator as any)({});
  const separatorProps = getWebProps([separatorStyle_, separatorStyle]);

  return (
    <span {...separatorProps} aria-hidden="true">
      {separator}
    </span>
  );
};

interface BreadcrumbEllipsisProps {
  size: BreadcrumbProps['size'];
  intent: BreadcrumbProps['intent'];
}

const BreadcrumbEllipsis: React.FC<BreadcrumbEllipsisProps> = ({ size, intent }) => {
  breadcrumbStyles.useVariants({ size });
  const ellipsisStyle = (breadcrumbStyles.ellipsis as any)({});
  const ellipsisIconStyle = (breadcrumbStyles.ellipsisIcon as any)({ intent });
  const ellipsisProps = getWebProps([ellipsisStyle]);
  const iconProps = getWebProps([ellipsisIconStyle]);

  return (
    <span {...ellipsisProps}>
      <IconSvg
        name="dots-horizontal"
        {...iconProps}
        aria-label="more items"
      />
    </span>
  );
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({
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
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Get dynamic styles - call as functions for theme reactivity
  const containerStyle = (breadcrumbStyles.container as any)({});
  const menuButtonStyle = (breadcrumbStyles.menuButton as any)({});
  const menuButtonIconStyle = (breadcrumbStyles.menuButtonIcon as any)({ intent });

  const containerProps = getWebProps([containerStyle, style as any]);

  // Apply variants for menu button
  breadcrumbStyles.useVariants({ size });
  const menuButtonProps = getWebProps([menuButtonStyle]);
  const menuIconProps = getWebProps([menuButtonIconStyle]);

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
    icon: isIconName(item.icon) ? item.icon : undefined,
  }));

  return (
    <nav {...containerProps} aria-label="Breadcrumb" id={id} data-testid={testID}>
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
                  <button
                    className={menuButtonProps.className}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    aria-label="Show more breadcrumb items"
                  >
                    <IconSvg
                      name="dots-horizontal"
                      {...menuIconProps}
                      aria-label="dots-horizontal"
                    />
                  </button>
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
    </nav>
  );
};

export default Breadcrumb;
