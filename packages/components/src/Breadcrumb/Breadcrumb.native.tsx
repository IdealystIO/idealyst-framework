import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { breadcrumbStyles } from './Breadcrumb.styles';
import type { BreadcrumbProps, BreadcrumbItem } from './types';

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  maxItems,
  intent = 'primary',
  size = 'medium',
  style,
  itemStyle,
  separatorStyle,
  testID,
}) => {
  const { styles } = useStyles(breadcrumbStyles, {
    size,
    intent,
  });

  // Handle truncation logic
  let displayItems = items;
  let showEllipsis = false;

  if (maxItems && items.length > maxItems) {
    showEllipsis = true;
    const firstItems = items.slice(0, 1);
    const lastItems = items.slice(-(maxItems - 1));
    displayItems = [...firstItems, ...lastItems];
  }

  const renderItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
    const { styles: itemStyles } = useStyles(breadcrumbStyles, {
      size,
      intent,
      disabled: item.disabled || false,
      isLast,
      clickable: !!item.onPress && !item.disabled,
    });

    const content = (
      <View style={[styles.item, itemStyle]}>
        {item.icon && <View style={styles.icon}>{item.icon}</View>}
        <Text style={itemStyles.itemText}>{item.label}</Text>
      </View>
    );

    if (item.onPress && !item.disabled) {
      return (
        <Pressable
          key={index}
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

    return <View key={index}>{content}</View>;
  };

  return (
    <View
      style={[styles.container, style]}
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
                <Text style={styles.ellipsis}>...</Text>
                <Text style={[styles.separator, separatorStyle]}>
                  {typeof separator === 'string' ? separator : '/'}
                </Text>
              </>
            )}

            {renderItem(item, index, isLast)}

            {!isLast && (
              <Text style={[styles.separator, separatorStyle]}>
                {typeof separator === 'string' ? separator : '/'}
              </Text>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

export default Breadcrumb;
