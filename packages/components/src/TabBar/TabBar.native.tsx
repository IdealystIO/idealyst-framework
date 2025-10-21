import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
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

  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const tabLayouts = useRef<{ [key: string]: { x: number; width: number } }>({});

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const updateIndicatorPosition = (itemValue: string) => {
    const layout = tabLayouts.current[itemValue];
    if (layout) {
      indicatorPosition.value = withSpring(layout.x, {
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

  // Apply container variants
  tabBarStyles.useVariants({ variant, intent });

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
      width: indicatorWidth.value,
    };
  });

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
          indicatorAnimatedStyle,
        ]}
      />
    </View>
  );
};

export default TabBar;
