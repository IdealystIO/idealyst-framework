import React, { useState, useRef, useEffect, Children, forwardRef } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Animated } from 'react-native';
import { tabsStyles } from './Tabs.styles';
import type { TabsProps, TabProps } from './types';

const Tabs = forwardRef<View, TabsProps>(({
  children,
  value: controlledValue,
  defaultValue,
  onChange,
  variant = 'default',
  size = 'medium',
  intent = 'primary',
  style,
  testID,
}, ref) => {
  const tabs = Children.toArray(children).filter(
    (child): child is React.ReactElement<TabProps> =>
      React.isValidElement(child) && typeof child.type !== 'string'
  );

  const firstTabValue = tabs[0]?.props.value || '';
  const [internalValue, setInternalValue] = useState(defaultValue || firstTabValue);
  const [indicatorLayout, setIndicatorLayout] = useState({ x: 0, width: 0 });

  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;
  const tabLayouts = useRef<{ [key: string]: { x: number; width: number } }>({});

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const updateIndicatorPosition = (tabValue: string) => {
    const layout = tabLayouts.current[tabValue];
    if (layout) {
      Animated.parallel([
        Animated.spring(indicatorPosition, {
          toValue: layout.x,
          useNativeDriver: false,
          tension: 300,
          friction: 30,
        }),
        Animated.spring(indicatorWidth, {
          toValue: layout.width,
          useNativeDriver: false,
          tension: 300,
          friction: 30,
        }),
      ]).start();
    }
  };

  useEffect(() => {
    updateIndicatorPosition(value);
  }, [value]);

  const handleTabLayout = (tabValue: string, x: number, width: number) => {
    tabLayouts.current[tabValue] = { x, width };

    // Update indicator for active tab
    if (tabValue === value) {
      updateIndicatorPosition(tabValue);
    }
  };

  const handleTabClick = (tabValue: string, disabled?: boolean) => {
    if (disabled) return;

    if (controlledValue === undefined) {
      setInternalValue(tabValue);
    }

    onChange?.(tabValue);
  };

  tabsStyles.useVariants({
    variant,
    intent,
  });

  return (
    <View ref={ref} style={[tabsStyles.container, style]} testID={testID}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: 'row' }}
      >
        {tabs.map((tab) => {
          const { value: tabValue, label, disabled } = tab.props;
          const isActive = value === tabValue;

          tabsStyles.useVariants({
            size,
            variant,
            intent,
            active: isActive,
            disabled: Boolean(disabled),
          });

          return (
            <TouchableOpacity
              key={tabValue}
              onLayout={(event) => {
                const { x, width } = event.nativeEvent.layout;
                handleTabLayout(tabValue, x, width);
              }}
              style={tabsStyles.tab}
              onPress={() => handleTabClick(tabValue, disabled)}
              disabled={disabled}
              activeOpacity={0.7}
              testID={`${testID}-tab-${tabValue}`}
            >
              <Text style={tabsStyles.tabLabel}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Animated indicator */}
      <Animated.View
        style={[
          tabsStyles.indicator,
          {
            transform: [{ translateX: indicatorPosition }],
            width: indicatorWidth,
          },
        ]}
      />
    </View>
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;
