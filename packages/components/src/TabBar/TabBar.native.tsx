import { useState, useRef, useEffect, forwardRef, ReactNode, useMemo } from 'react';
import { View, TouchableOpacity, Text, ScrollView, LayoutChangeEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {
  tabBarContainerStyles,
  tabBarTabStyles,
  tabBarLabelStyles,
  tabBarIndicatorStyles,
  tabBarIconStyles
} from './TabBar.styles';
import type { TabBarProps, TabBarItem } from './types';
import { getNativeAccessibilityProps } from '../utils/accessibility';
import { isIconName } from '../Icon/icon-resolver';
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
  if (isIconName(icon)) {
    return <MaterialDesignIcons name={icon} size={size} />;
  }
  return icon;
}

/**
 * Individual tab component to isolate useVariants calls per tab.
 */
const TabItem = ({
  item,
  isActive,
  size,
  type,
  iconPosition,
  justify,
  onPress,
  onLayout,
  testID,
}: {
  item: TabBarItem;
  isActive: boolean;
  size: TabBarProps['size'];
  type: TabBarProps['type'];
  iconPosition: TabBarProps['iconPosition'];
  justify: TabBarProps['justify'];
  onPress: () => void;
  onLayout: (e: LayoutChangeEvent) => void;
  testID?: string;
}) => {
  const iconSize = ICON_SIZES[size || 'md'] || 18;

  // Apply tab variants per tab (active/disabled differ per item)
  tabBarTabStyles.useVariants({
    size,
    type,
    active: isActive,
    disabled: Boolean(item.disabled),
    iconPosition,
    justify,
  });

  // Apply label variants
  tabBarLabelStyles.useVariants({
    size,
    type,
    active: isActive,
    disabled: Boolean(item.disabled),
  });

  // Apply icon variants
  tabBarIconStyles.useVariants({
    size,
    disabled: Boolean(item.disabled),
    iconPosition,
  });

  const icon = renderIcon(item.icon, isActive, iconSize);

  return (
    <TouchableOpacity
      onLayout={onLayout}
      style={tabBarTabStyles.tab as any}
      onPress={onPress}
      disabled={item.disabled}
      activeOpacity={0.7}
      testID={`${testID}-tab-${item.value}`}
      accessibilityRole="tab"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: isActive, disabled: item.disabled }}
    >
      {icon && <View style={tabBarIconStyles.tabIcon as any}>{icon}</View>}
      <Text style={tabBarLabelStyles.tabLabel as any}>{item.label}</Text>
    </TouchableOpacity>
  );
};

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

  // Apply container variants
  tabBarContainerStyles.useVariants({
    type,
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

  // Apply indicator variants
  tabBarIndicatorStyles.useVariants({
    type,
    pillMode,
  });

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
      <View ref={ref as any} nativeID={id} style={[tabBarContainerStyles.container as any, style]} testID={testID} {...nativeA11yProps}>
        {/* Animated indicator - render first so it's behind */}
        <Animated.View
          style={[
            tabBarIndicatorStyles.indicator as any,
            indicatorAnimatedStyle,
          ]}
        />

        {/* Tabs - render second so they're on top */}
        <View style={{ flexDirection: 'row', flex: 1 }}>
          {items.map((item) => {
            const isActive = value === item.value;

            return (
              <TabItem
                key={item.value}
                item={item}
                isActive={isActive}
                size={size}
                type={type}
                iconPosition={iconPosition}
                justify={justify}
                onPress={() => handleTabClick(item.value, item.disabled)}
                onLayout={(event: LayoutChangeEvent) => {
                  const { x, width } = event.nativeEvent.layout;
                  handleTabLayout(item.value, x, width);
                }}
                testID={testID}
              />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
});

TabBar.displayName = 'TabBar';

export default TabBar;
