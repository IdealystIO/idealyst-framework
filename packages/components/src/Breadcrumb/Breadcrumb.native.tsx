import React, { forwardRef, isValidElement } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  breadcrumbContainerStyles,
  breadcrumbItemStyles,
  breadcrumbSeparatorStyles,
  breadcrumbEllipsisStyles
} from './Breadcrumb.styles';
import type { BreadcrumbProps, BreadcrumbItem as BreadcrumbItemType } from './types';
import Icon from '../Icon';
import type { IconName } from '../Icon/icon-types';

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
      <Text style={breadcrumbItemStyles.itemText}>{item.label}</Text>
    </View>
  );

  if (item.onPress && !item.disabled) {
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
}

const BreadcrumbEllipsis: React.FC<BreadcrumbEllipsisProps> = ({ size }) => {
  breadcrumbEllipsisStyles.useVariants({ size });
  return <Text style={breadcrumbEllipsisStyles.ellipsis}>...</Text>;
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
}, ref) => {
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
    <View
      ref={ref}
      style={[breadcrumbContainerStyles.container, style]}
      testID={testID}
      accessibilityRole="navigation"
      accessibilityLabel="Breadcrumb"
    >
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
    </View>
  );
});

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
