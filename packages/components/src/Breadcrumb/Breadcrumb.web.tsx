import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
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
  breadcrumbStyles.useVariants({
    size,
    intent,
  });

  const containerProps = getWebProps([breadcrumbStyles.container, style]);
  const separatorProps = getWebProps([breadcrumbStyles.separator, separatorStyle]);
  const ellipsisProps = getWebProps([breadcrumbStyles.ellipsis]);

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
    const iconProps = getWebProps([breadcrumbStyles.icon]);
    const itemTextProps = getWebProps([
      breadcrumbStyles.itemText,
      itemStyle,
    ]);

    breadcrumbStyles.useVariants({
      size,
      intent,
      disabled: item.disabled || false,
      isLast,
      clickable: !!item.onPress && !item.disabled,
    });

    const handleClick = () => {
      if (!item.disabled && item.onPress) {
        item.onPress();
      }
    };

    const content = (
      <div
        className={getWebProps([breadcrumbStyles.item]).className}
        style={getWebProps([breadcrumbStyles.item]).style}
      >
        {item.icon && (
          <span
            className={iconProps.className}
            style={{
              ...iconProps.style,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {item.icon}
          </span>
        )}
        <span className={itemTextProps.className} style={itemTextProps.style}>
          {item.label}
        </span>
      </div>
    );

    if (item.onPress && !item.disabled) {
      return (
        <button
          key={index}
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
      <div key={index} aria-current={isLast ? 'page' : undefined}>
        {content}
      </div>
    );
  };

  return (
    <nav
      className={containerProps.className}
      style={containerProps.style}
      aria-label="Breadcrumb"
      data-testid={testID}
    >
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const shouldShowEllipsis = showEllipsis && index === 1;

        return (
          <React.Fragment key={index}>
            {shouldShowEllipsis && (
              <>
                <span
                  className={ellipsisProps.className}
                  style={ellipsisProps.style}
                >
                  ...
                </span>
                <span
                  className={separatorProps.className}
                  style={separatorProps.style}
                  aria-hidden="true"
                >
                  {separator}
                </span>
              </>
            )}

            {renderItem(item, index, isLast)}

            {!isLast && (
              <span
                className={separatorProps.className}
                style={separatorProps.style}
                aria-hidden="true"
              >
                {separator}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
