import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Animated } from 'react-native';
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

  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;
  const tabLayouts = useRef<{ [key: string]: { x: number; width: number } }>({});

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const updateIndicatorPosition = (itemValue: string) => {
    const layout = tabLayouts.current[itemValue];
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

  // Apply container variants
  tabBarStyles.useVariants({ variant, intent });

  return (
    <View style={[tabBarStyles.container, style]} testID={testID}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: 'row' }}
      >
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

          return (
            <TouchableOpacity
              key={item.value}
              onLayout={(event) => {
                const { x, width } = event.nativeEvent.layout;
                handleTabLayout(item.value, x, width);
              }}
              style={tabBarStyles.tab}
              onPress={() => handleTabClick(item.value, item.disabled)}
              disabled={item.disabled}
              activeOpacity={0.7}
              testID={`${testID}-tab-${item.value}`}
            >
              <Text style={tabBarStyles.tabLabel}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Animated indicator */}
      <Animated.View
        style={[
          tabBarStyles.indicator,
          {
            transform: [{ translateX: indicatorPosition }],
            width: indicatorWidth,
          },
        ]}
      />
    </View>
  );
};

export default TabBar;
