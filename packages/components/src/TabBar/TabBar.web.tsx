import React, { useState, useRef, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import {
  tabBarContainerStyles,
  tabBarTabStyles,
  tabBarLabelStyles,
  tabBarIndicatorStyles,
  tabBarIconStyles
} from './TabBar.styles';
import type { TabBarProps, TabBarItem } from './types';
import useMergeRefs from '../hooks/useMergeRefs';
import { getWebAriaProps, generateAccessibilityId, TAB_KEYS } from '../utils/accessibility';

// Icon size mapping based on size variant
const ICON_SIZES: Record<string, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
};

// Helper to render icon
function renderIcon(
  icon: TabBarItem['icon'],
  active: boolean,
  size: number
): ReactNode {
  if (!icon) return null;
  if (typeof icon === 'function') {
    return icon({ active, size });
  }
  return icon;
}

interface TabProps {
  item: TabBarItem;
  isActive: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  size: TabBarProps['size'];
  type: TabBarProps['type'];
  pillMode: TabBarProps['pillMode'];
  iconPosition: TabBarProps['iconPosition'];
  justify: TabBarProps['justify'];
  testID?: string;
  tabRef: (el: HTMLButtonElement | null) => void;
  tabId: string;
  panelId: string;
}

const Tab: React.FC<TabProps> = ({
  item,
  isActive,
  onClick,
  onKeyDown,
  size,
  type,
  pillMode,
  iconPosition,
  justify,
  testID,
  tabRef,
  tabId,
  panelId,
}) => {
  const iconSize = ICON_SIZES[size || 'md'] || 18;

  // Apply tab and label types for this specific tab
  tabBarTabStyles.useVariants({
    size,
    type,
    active: isActive,
    disabled: Boolean(item.disabled),
    pillMode,
    iconPosition,
    justify,
  });
  tabBarLabelStyles.useVariants({
    size,
    type,
    pillMode,
    active: isActive,
    disabled: Boolean(item.disabled),
  });
  tabBarIconStyles.useVariants({
    size,
    active: isActive,
    disabled: Boolean(item.disabled),
    iconPosition,
  });

  const tabProps = getWebProps([tabBarTabStyles.tab]);
  const labelProps = getWebProps([tabBarLabelStyles.tabLabel]);
  const iconProps = getWebProps([tabBarIconStyles.tabIcon]);

  // Merge refs from getWebProps with our tracking ref
  const mergedRef = useMergeRefs<HTMLButtonElement>(
    tabProps.ref as React.Ref<HTMLButtonElement>,
    tabRef
  );

  const icon = renderIcon(item.icon, isActive, iconSize);

  return (
    <button
      {...tabProps}
      ref={mergedRef}
      id={tabId}
      onClick={onClick}
      onKeyDown={onKeyDown}
      disabled={item.disabled}
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      aria-disabled={item.disabled}
      tabIndex={isActive ? 0 : -1}
      data-testid={`${testID}-tab-${item.value}`}
    >
      {icon && <span {...iconProps}>{icon}</span>}
      <span {...labelProps}>{item.label}</span>
    </button>
  );
};

const TabBar: React.FC<TabBarProps> = ({
  items,
  value: controlledValue,
  defaultValue,
  onChange,
  type = 'standard',
  size = 'md',
  pillMode = 'light',
  iconPosition = 'left',
  justify = 'start',
  // Spacing variants from ContainerStyleProps
  gap,
  padding,
  paddingVertical,
  paddingHorizontal,
  margin,
  marginVertical,
  marginHorizontal,
  style,
  testID,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityDisabled,
  accessibilityHidden,
  accessibilityRole,
}) => {
  const firstItemValue = items[0]?.value || '';
  const [internalValue, setInternalValue] = useState(defaultValue || firstItemValue);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Generate unique ID for the tablist
  const tabListId = useMemo(() => id || generateAccessibilityId('tablist'), [id]);

  // Generate tab and panel IDs
  const getTabId = useCallback((itemValue: string) => `${tabListId}-tab-${itemValue}`, [tabListId]);
  const getPanelId = useCallback((itemValue: string) => `${tabListId}-panel-${itemValue}`, [tabListId]);

  // Get enabled items for keyboard navigation
  const enabledItems = useMemo(() => items.filter(item => !item.disabled), [items]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent, itemValue: string) => {
    const key = e.key;
    const currentIndex = enabledItems.findIndex(item => item.value === itemValue);
    let nextIndex = -1;

    if (TAB_KEYS.next.includes(key)) {
      e.preventDefault();
      nextIndex = currentIndex < enabledItems.length - 1 ? currentIndex + 1 : 0;
    } else if (TAB_KEYS.prev.includes(key)) {
      e.preventDefault();
      nextIndex = currentIndex > 0 ? currentIndex - 1 : enabledItems.length - 1;
    } else if (TAB_KEYS.first.includes(key)) {
      e.preventDefault();
      nextIndex = 0;
    } else if (TAB_KEYS.last.includes(key)) {
      e.preventDefault();
      nextIndex = enabledItems.length - 1;
    }

    if (nextIndex >= 0) {
      const nextItem = enabledItems[nextIndex];
      const tabButton = tabRefs.current[nextItem.value];
      tabButton?.focus();
    }
  }, [enabledItems]);

  // Generate ARIA props
  const ariaProps = useMemo(() => {
    return getWebAriaProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityDisabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'tablist',
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityDisabled, accessibilityHidden, accessibilityRole]);

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

  // Apply container and indicator types
  tabBarContainerStyles.useVariants({
    type,
    size,
    pillMode,
    justify,
    gap,
    padding,
    paddingVertical,
    paddingHorizontal,
    margin,
    marginVertical,
    marginHorizontal,
  });
  const containerProps = getWebProps([tabBarContainerStyles.container, style as any]);

  tabBarIndicatorStyles.useVariants({ type, pillMode });
  const indicatorProps = getWebProps([tabBarIndicatorStyles.indicator]);

  // Merge container ref with getWebProps ref
  const mergedContainerRef = useMergeRefs<HTMLDivElement>(
    containerProps.ref as React.Ref<HTMLDivElement>,
    containerRef
  );

  // For pills type, calculate height from parent
  const indicatorInlineStyle: React.CSSProperties = {
    left: `${indicatorStyle.left}px`,
    width: `${indicatorStyle.width}px`,
  };

  // For pills type, use calc() to set height based on top/bottom
  if (type === 'pills') {
    indicatorInlineStyle.height = 'calc(100% - 8px)'; // 100% minus top(4px) + bottom(4px)
  }

  return (
    <div
      {...containerProps}
      {...ariaProps}
      ref={mergedContainerRef}
      role="tablist"
      id={tabListId}
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
            onKeyDown={(e) => handleKeyDown(e, item.value)}
            size={size}
            type={type}
            pillMode={pillMode}
            iconPosition={iconPosition}
            justify={justify}
            testID={testID}
            tabId={getTabId(item.value)}
            panelId={getPanelId(item.value)}
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
