import { useState, useRef, useEffect, forwardRef, ReactNode, useMemo } from 'react';
import { View, TouchableOpacity, Text, ScrollView, LayoutChangeEvent } from 'react-native';
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
import type { IdealystElement } from '../utils/refTypes';

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

const TabBar = forwardRef<IdealystElement, TabBarProps>(({
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
        damping: 100,
        stiffness: 300,
      });
      indicatorWidth.value = withSpring(layout.width, {
        damping: 100,
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

  // Apply container variants (for spacing only)
  tabBarContainerStyles.useVariants({
    justify,
    gap,
    padding,
    paddingVertical,
    paddingHorizontal,
    margin,
    marginVertical,
    marginHorizontal,
  });

  // Compute dynamic container and indicator styles
  const containerStyle = (tabBarContainerStyles.container as any)({ type, pillMode });
  const indicatorStyle = (tabBarIndicatorStyles.indicator as any)({ type, pillMode });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        position: 'relative',
        flexGrow: 1,
      }}
      style={{ width: '100%' }}
    >
      <View ref={ref as any} nativeID={id} style={[containerStyle, style]} testID={testID} {...nativeA11yProps}>
        {/* Animated indicator - render first so it's behind */}
        <Animated.View
          style={[
            indicatorStyle,
            indicatorAnimatedStyle,
          ]}
        />

        {/* Tabs - render second so they're on top */}
        <View style={{ flexDirection: 'row', flex: 1 }}>
          {items.map((item) => {
            const isActive = value === item.value;
            const iconSize = ICON_SIZES[size] || 18;

            // Apply icon variants (size, disabled, iconPosition)
            tabBarIconStyles.useVariants({
              size,
              active: isActive,
              disabled: Boolean(item.disabled),
              iconPosition,
            });

            // Compute dynamic styles for this tab - call as functions for theme reactivity
            const tabStyle = (tabBarTabStyles.tab as any)({ type, size, active: isActive, pillMode, justify });
            const labelStyle = (tabBarLabelStyles.tabLabel as any)({ type, active: isActive, pillMode });
            const iconContainerStyle = (tabBarIconStyles.tabIcon as any)({});

            const icon = renderIcon(item.icon, isActive, iconSize);

            return (
              <TouchableOpacity
                key={item.value}
                onLayout={(event: LayoutChangeEvent) => {
                  const { x, width } = event.nativeEvent.layout;
                  handleTabLayout(item.value, x, width);
                }}
                style={tabStyle}
                onPress={() => handleTabClick(item.value, item.disabled)}
                disabled={item.disabled}
                activeOpacity={0.7}
                testID={`${testID}-tab-${item.value}`}
                accessibilityRole="tab"
                accessibilityLabel={item.label}
                accessibilityState={{ selected: isActive, disabled: item.disabled }}
              >
                {icon && <View style={iconContainerStyle}>{icon}</View>}
                <Text style={labelStyle}>{item.label}</Text>
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
