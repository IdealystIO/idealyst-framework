import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import {
  tabBarContainerStyles,
  tabBarTabStyles,
  tabBarLabelStyles,
  tabBarIndicatorStyles
} from './TabBar.styles';
import type { TabBarProps } from './types';

const TabBar = forwardRef<View, TabBarProps>(({
  items,
  value: controlledValue,
  defaultValue,
  onChange,
  variant = 'default',
  size = 'medium',
  pillMode = 'light',
  style,
  testID,
}, ref) => {
  const firstItemValue = items[0]?.value || '';
  const [internalValue, setInternalValue] = useState(defaultValue || firstItemValue);

  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const tabLayouts = useRef<{ [key: string]: { x: number; width: number } }>({});

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const updateIndicatorPosition = (itemValue: string) => {
    const layout = tabLayouts.current[itemValue];
    if (layout) {
      // For pills variant, account for container padding
      const containerPadding = variant === 'pills' ? 4 : 0;

      indicatorPosition.value = withSpring(layout.x + containerPadding, {
        damping: 30,
        stiffness: 300,
      });
      indicatorWidth.value = withSpring(layout.width, {
        damping: 30,
        stiffness: 300,
      });
    }
  };

  useEffect(() => {
    updateIndicatorPosition(value);
  }, [value]);

  const handleTabLayout = (itemValue: string, x: number, width: number) => {
    tabLayouts.current[itemValue] = { x, width };

    // Update indicator for active tab
    if (itemValue === value) {
      updateIndicatorPosition(itemValue);
    }
  };

  const handleTabClick = (itemValue: string, disabled?: boolean) => {
    if (disabled) return;

    if (controlledValue === undefined) {
      setInternalValue(itemValue);
    }

    onChange?.(itemValue);
  };

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
      width: indicatorWidth.value,
    };
  });

  // Apply container and indicator variants right before rendering
  tabBarContainerStyles.useVariants({ variant, size, pillMode });
  tabBarIndicatorStyles.useVariants({ variant, pillMode });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ position: 'relative' }}
    >
      <View ref={ref} style={[tabBarContainerStyles.container, style]} testID={testID}>
        {/* Animated indicator - render first so it's behind */}
        <Animated.View
          style={[
            tabBarIndicatorStyles.indicator,
            indicatorAnimatedStyle,
          ]}
        />

        {/* Tabs - render second so they're on top */}
        <View style={{ flexDirection: 'row' }}>
          {items.map((item) => {
            const isActive = value === item.value;

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

            return (
              <TouchableOpacity
                key={item.value}
                onLayout={(event) => {
                  const { x, width } = event.nativeEvent.layout;
                  handleTabLayout(item.value, x, width);
                }}
                style={tabBarTabStyles.tab}
                onPress={() => handleTabClick(item.value, item.disabled)}
                disabled={item.disabled}
                activeOpacity={0.7}
                testID={`${testID}-tab-${item.value}`}
              >
                <Text style={tabBarLabelStyles.tabLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
});

TabBar.displayName = 'TabBar';

export default TabBar;
