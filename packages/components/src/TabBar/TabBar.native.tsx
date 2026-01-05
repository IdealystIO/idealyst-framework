import React, { useState, useRef, useEffect, forwardRef, ReactNode, useMemo } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import {
  tabBarContainerStyles,
  tabBarTabStyles,
  tabBarLabelStyles,
  tabBarIndicatorStyles,
  tabBarIconStyles
} from './TabBar.styles';
import type { TabBarProps, TabBarItem } from './types';
import { getNativeAccessibilityProps } from '../utils/accessibility';

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

const TabBar = forwardRef<View, TabBarProps>(({
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
}, ref) => {
  const firstItemValue = items[0]?.value || '';
  const [internalValue, setInternalValue] = useState(defaultValue || firstItemValue);

  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    return getNativeAccessibilityProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityDisabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'tablist',
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityDisabled, accessibilityHidden, accessibilityRole]);

  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const tabLayouts = useRef<{ [key: string]: { x: number; width: number } }>({});

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const updateIndicatorPosition = (itemValue: string) => {
    const layout = tabLayouts.current[itemValue];
    if (layout) {
      // For pills type, account for container padding
      const containerPadding = type === 'pills' ? 4 : 0;

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

  // Apply container and indicator types right before rendering
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
  tabBarIndicatorStyles.useVariants({ type, pillMode });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ position: 'relative' }}
    >
      <View ref={ref} nativeID={id} style={[tabBarContainerStyles.container, style]} testID={testID} {...nativeA11yProps}>
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
            const iconSize = ICON_SIZES[size] || 18;

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

            const icon = renderIcon(item.icon, isActive, iconSize);

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
                accessibilityRole="tab"
                accessibilityLabel={item.label}
                accessibilityState={{ selected: isActive, disabled: item.disabled }}
              >
                {icon && <View style={tabBarIconStyles.tabIcon}>{icon}</View>}
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
