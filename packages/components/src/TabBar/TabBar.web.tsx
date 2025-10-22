import React, { useState, useRef, useEffect } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import {
  tabBarContainerStyles,
  tabBarTabStyles,
  tabBarLabelStyles,
  tabBarIndicatorStyles
} from './TabBar.styles';
import type { TabBarProps, TabBarItem } from './types';
import useMergeRefs from '../hooks/useMergeRefs';

interface TabProps {
  item: TabBarItem;
  isActive: boolean;
  onClick: () => void;
  size: TabBarProps['size'];
  variant: TabBarProps['variant'];
  pillMode: TabBarProps['pillMode'];
  testID?: string;
  tabRef: (el: HTMLButtonElement | null) => void;
}

const Tab: React.FC<TabProps> = ({
  item,
  isActive,
  onClick,
  size,
  variant,
  pillMode,
  testID,
  tabRef,
}) => {
  // Apply tab and label variants for this specific tab
  tabBarTabStyles.useVariants({
    size,
    variant,
    active: isActive,
    disabled: Boolean(item.disabled),
    pillMode,
  });
  tabBarLabelStyles.useVariants({
    size,
    variant,
    pillMode,
    active: isActive,
    disabled: Boolean(item.disabled),
  });

  const tabProps = getWebProps([tabBarTabStyles.tab]);
  const labelProps = getWebProps([tabBarLabelStyles.tabLabel]);

  // Merge refs from getWebProps with our tracking ref
  const mergedRef = useMergeRefs<HTMLButtonElement>(
    tabProps.ref as React.Ref<HTMLButtonElement>,
    tabRef
  );

  return (
    <button
      {...tabProps}
      ref={mergedRef}
      onClick={onClick}
      disabled={item.disabled}
      role="tab"
      aria-selected={isActive}
      aria-disabled={item.disabled}
      data-testid={`${testID}-tab-${item.value}`}
    >
      <span {...labelProps}>{item.label}</span>
    </button>
  );
};

const TabBar: React.FC<TabBarProps> = ({
  items,
  value: controlledValue,
  defaultValue,
  onChange,
  variant = 'default',
  size = 'md',
  pillMode = 'light',
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

  // Apply container and indicator variants
  tabBarContainerStyles.useVariants({ variant, size, pillMode });
  const containerProps = getWebProps([tabBarContainerStyles.container, style]);

  tabBarIndicatorStyles.useVariants({ variant, pillMode });
  const indicatorProps = getWebProps([tabBarIndicatorStyles.indicator]);

  // Merge container ref with getWebProps ref
  const mergedContainerRef = useMergeRefs<HTMLDivElement>(
    containerProps.ref as React.Ref<HTMLDivElement>,
    containerRef
  );

  // For pills variant, calculate height from parent
  const indicatorInlineStyle: React.CSSProperties = {
    ...indicatorProps.style,
    left: `${indicatorStyle.left}px`,
    width: `${indicatorStyle.width}px`,
  };

  // For pills variant, use calc() to set height based on top/bottom
  if (variant === 'pills') {
    indicatorInlineStyle.height = 'calc(100% - 8px)'; // 100% minus top(4px) + bottom(4px)
  }

  return (
    <div
      {...containerProps}
      ref={mergedContainerRef}
      role="tablist"
      data-testid={testID}
    >
      {/* Sliding indicator */}
      <div
        {...indicatorProps}
        style={indicatorInlineStyle}
      />

      {items.map((item) => {
        const isActive = value === item.value;

        return (
          <Tab
            key={item.value}
            item={item}
            isActive={isActive}
            onClick={() => handleTabClick(item.value, item.disabled)}
            size={size}
            variant={variant}
            pillMode={pillMode}
            testID={testID}
            tabRef={(el) => {
              tabRefs.current[item.value] = el;
              // Update indicator when active tab ref is set
              if (el && isActive) {
                requestAnimationFrame(() => updateIndicator());
              }
            }}
          />
        );
      })}
    </div>
  );
};

export default TabBar;
