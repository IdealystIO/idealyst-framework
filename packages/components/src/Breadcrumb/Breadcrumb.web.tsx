import React, { isValidElement } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import {
  breadcrumbContainerStyles,
  breadcrumbItemStyles,
  breadcrumbSeparatorStyles,
  breadcrumbEllipsisStyles
} from './Breadcrumb.styles';
import type { BreadcrumbProps, BreadcrumbItem as BreadcrumbItemType } from './types';
import { IconSvg } from '../Icon/IconSvg.web';
import { resolveIconPath, isIconName } from '../Icon/icon-resolver';

interface BreadcrumbItemProps {
  item: BreadcrumbItemType;
  isLast: boolean;
  size: BreadcrumbProps['size'];
  intent: BreadcrumbProps['intent'];
  itemStyle?: BreadcrumbProps['itemStyle'];
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ item, isLast, size, intent, itemStyle }) => {
  // Apply variants for this item only
  breadcrumbItemStyles.useVariants({
    size,
    intent,
    disabled: item.disabled || false,
    isLast,
    clickable: !!item.onPress && !item.disabled,
  });

  const itemProps = getWebProps([breadcrumbItemStyles.item]);
  const itemTextProps = getWebProps([breadcrumbItemStyles.itemText, itemStyle]);
  const iconProps = getWebProps([breadcrumbItemStyles.icon]);

  const handleClick = () => {
    if (!item.disabled && item.onPress) {
      item.onPress();
    }
  };

  const renderIcon = () => {
    if (!item.icon) return null;

    if (isIconName(item.icon)) {
      const iconPath = resolveIconPath(item.icon);
      return (
        <IconSvg
          path={iconPath}
          {...iconProps}
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
            ...iconProps.style,
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

  if (item.onPress && !item.disabled) {
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
        disabled={item.disabled}
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
  breadcrumbSeparatorStyles.useVariants({ size });
  const separatorProps = getWebProps([breadcrumbSeparatorStyles.separator, separatorStyle]);

  return (
    <span {...separatorProps} aria-hidden="true">
      {separator}
    </span>
  );
};

interface BreadcrumbEllipsisProps {
  size: BreadcrumbProps['size'];
}

const BreadcrumbEllipsis: React.FC<BreadcrumbEllipsisProps> = ({ size }) => {
  breadcrumbEllipsisStyles.useVariants({ size });
  const ellipsisProps = getWebProps([breadcrumbEllipsisStyles.ellipsis]);

  return <span {...ellipsisProps}>...</span>;
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
}) => {
  const containerProps = getWebProps([breadcrumbContainerStyles.container, style]);

  // Handle truncation logic
  let displayItems = items;
  let showEllipsis = false;

  if (maxItems && items.length > maxItems) {
    showEllipsis = true;
    const firstItems = items.slice(0, 1);
    const lastItems = items.slice(-(maxItems - 1));
    displayItems = [...firstItems, ...lastItems];
  }

  return (
    <nav {...containerProps} aria-label="Breadcrumb" data-testid={testID}>
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const shouldShowEllipsis = showEllipsis && index === 1;

        return (
          <React.Fragment key={index}>
            {shouldShowEllipsis && (
              <>
                <BreadcrumbEllipsis size={size} />
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
