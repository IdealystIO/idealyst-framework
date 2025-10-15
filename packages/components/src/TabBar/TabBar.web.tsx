import React, { useState, useRef, useEffect } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { tabBarStyles } from './TabBar.styles';
import type { TabBarProps } from './types';

const TabBar: React.FC<TabBarProps> = ({
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
  const firstItemValue = items[0]?.value || '';
  const [internalValue, setInternalValue] = useState(defaultValue || firstItemValue);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const updateIndicator = () => {
    const activeButton = tabRefs.current[value];
    const container = containerRef.current;

    if (activeButton && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      const newStyle = {
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      };

      setIndicatorStyle(newStyle);
    }
  };

  // Update indicator when value changes
  useEffect(() => {
    updateIndicator();
  }, [value]);

  // Update indicator on mount and window resize
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(updateIndicator, 0);
    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, []);

  // Update indicator when items change
  useEffect(() => {
    updateIndicator();
  }, [items]);

  const handleTabClick = (itemValue: string, disabled?: boolean) => {
    if (disabled) return;

    if (controlledValue === undefined) {
      setInternalValue(itemValue);
    }

    onChange?.(itemValue);
  };

  // Apply container variants
  const containerProps = getWebProps([tabBarStyles.container, style]);

  // Apply indicator variants
  tabBarStyles.useVariants({ variant, intent });
  const indicatorProps = getWebProps([tabBarStyles.indicator]);

  return (
    <div
      ref={containerRef}
      {...containerProps}
      role="tablist"
      data-testid={testID}
    >
      {/* Sliding indicator */}
      <div
        {...indicatorProps}
        style={{
          ...indicatorProps.style,
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />

      {items.map((item) => {
        const isActive = value === item.value;

        // Apply tab variants for this specific tab
        tabBarStyles.useVariants({
          size,
          variant,
          intent,
          active: isActive,
          disabled: Boolean(item.disabled),
        });

        const tabProps = getWebProps([tabBarStyles.tab]);

        return (
          <button
            key={item.value}
            ref={(el) => {
              tabRefs.current[item.value] = el;
              // Update indicator when active tab ref is set
              if (el && isActive) {
                requestAnimationFrame(() => updateIndicator());
              }
            }}
            {...tabProps}
            onClick={() => handleTabClick(item.value, item.disabled)}
            disabled={item.disabled}
            role="tab"
            aria-selected={isActive}
            aria-disabled={item.disabled}
            data-testid={`${testID}-tab-${item.value}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabBar;
