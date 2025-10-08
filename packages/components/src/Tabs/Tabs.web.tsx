import React, { useState } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { tabsStyles } from './Tabs.styles';
import type { TabsProps } from './types';

const Tabs: React.FC<TabsProps> = ({
  items,
  value: controlledValue,
  defaultValue,
  onChange,
  variant = 'default',
  size = 'medium',
  intent = 'primary',
  style,
  testID,
}) => {
  const [internalValue, setInternalValue] = useState(
    defaultValue || items[0]?.id || ''
  );

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  // Apply variants
  tabsStyles.useVariants({
    size,
    variant,
    intent,
  });

  const containerProps = getWebProps([tabsStyles.container, style]);

  const handleTabClick = (tabId: string, disabled?: boolean) => {
    if (disabled) return;

    if (controlledValue === undefined) {
      setInternalValue(tabId);
    }

    onChange?.(tabId);
  };

  return (
    <div
      {...containerProps}
      role="tablist"
      data-testid={testID}
    >
      {items.map((item) => {
        const isActive = value === item.id;

        // Create a new stylesheet instance for each tab with its specific variants
        const tabStylesheet = tabsStyles;
        tabStylesheet.useVariants({
          size,
          variant,
          intent,
          active: isActive,
          disabled: Boolean(item.disabled),
        });

        const tabProps = getWebProps([tabsStyles.tab]);

        return (
          <button
            key={item.id}
            className={tabProps.className}
            style={tabProps.style}
            onClick={() => handleTabClick(item.id, item.disabled)}
            disabled={item.disabled}
            role="tab"
            aria-selected={isActive}
            aria-disabled={item.disabled}
            data-testid={`${testID}-tab-${item.id}`}
          >
            {item.icon && (
              <span className={getWebProps([tabsStyles.tabIcon]).className}>
                {item.icon}
              </span>
            )}
            <span className={getWebProps([tabsStyles.tabLabel]).className}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
