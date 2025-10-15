import React, { useState, useRef, useEffect, useLayoutEffect, Children } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { tabsStyles } from './Tabs.styles';
import type { TabsProps, TabProps } from './types';

const Tabs: React.FC<TabsProps> = ({
  children,
  value: controlledValue,
  defaultValue,
  onChange,
  variant = 'default',
  size = 'medium',
  intent = 'primary',
  style,
  testID,
}) => {
  const tabs = Children.toArray(children).filter(
    (child): child is React.ReactElement<TabProps> =>
      React.isValidElement(child) && typeof child.type !== 'string'
  );

  const firstTabValue = tabs[0]?.props.value || '';
  const [internalValue, setInternalValue] = useState(defaultValue || firstTabValue);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const updateIndicatorPosition = (tabElement: HTMLButtonElement) => {
    const container = containerRef.current;
    if (!tabElement || !container) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const tabRect = tabElement.getBoundingClientRect();

    const newStyle = {
      left: tabRect.left - containerRect.left,
      width: tabRect.width,
    };

    setIndicatorStyle(newStyle);
  };

  // Update indicator when value changes
  useEffect(() => {
    const activeTab = tabRefs.current[value];
    if (activeTab) {
      updateIndicatorPosition(activeTab);
    }
  }, [value]);

  // Handle window resize and initial mount
  useEffect(() => {
    const handleResize = () => {
      const activeTab = tabRefs.current[value];
      if (activeTab) {
        updateIndicatorPosition(activeTab);
      }
    };

    // Initial update
    const timer = setTimeout(handleResize, 0);

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [value]);

  const containerProps = getWebProps([tabsStyles.container, style]);

  const handleTabClick = (tabValue: string, disabled?: boolean) => {
    if (disabled) return;

    if (controlledValue === undefined) {
      setInternalValue(tabValue);
    }

    onChange?.(tabValue);
  };

  // Get indicator props - apply variants separately
  const getIndicatorProps = () => {
    tabsStyles.useVariants({
      variant,
      intent,
    });
    return getWebProps([tabsStyles.indicator]);
  };

  const indicatorProps = getIndicatorProps();

  return (
    <div
      ref={containerRef}
      {...containerProps}
      role="tablist"
      data-testid={testID}
    >
      {/* Sliding indicator */}
      <div
        className={indicatorProps.className}
        style={{
          ...indicatorProps.style,
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
        data-indicator-debug={`left:${indicatorStyle.left} width:${indicatorStyle.width}`}
      />

      {tabs.map((tab) => {
        const { value: tabValue, label, disabled, children: tabChildren } = tab.props;
        const isActive = value === tabValue;

        tabsStyles.useVariants({
          size,
          variant,
          intent,
          active: isActive,
          disabled: Boolean(disabled),
        });

        const tabProps = getWebProps([tabsStyles.tab]);
        const tabLabelProps = getWebProps([tabsStyles.tabLabel]);

        return (
          <button
            key={tabValue}
            ref={(el) => {
              if (el) {
                tabRefs.current[tabValue] = el;
                // Update indicator position when active tab ref is set
                if (isActive) {
                  updateIndicatorPosition(el);
                }
              }
            }}
            className={tabProps.className}
            style={tabProps.style}
            onClick={() => handleTabClick(tabValue, disabled)}
            disabled={disabled}
            role="tab"
            aria-selected={isActive}
            aria-disabled={disabled}
            data-testid={`${testID}-tab-${tabValue}`}
          >
            <span className={tabLabelProps.className} style={tabLabelProps.style}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
