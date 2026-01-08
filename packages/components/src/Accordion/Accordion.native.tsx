import React, { useState, forwardRef, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { accordionStyles } from './Accordion.styles';
import Text from '../Text';
import type { AccordionProps, AccordionItem as AccordionItemType } from './types';
import { getNativeAccessibilityProps } from '../utils/accessibility';

interface AccordionItemProps {
  item: AccordionItemType;
  isExpanded: boolean;
  onToggle: () => void;
  size: AccordionProps['size'];
  type: AccordionProps['type'];
  isLast: boolean;
  testID?: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  item,
  isExpanded,
  onToggle,
  size,
  type,
  isLast,
  testID,
}) => {
  const contentHeight = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  // Apply item-specific variants (for size, expanded, disabled)
  accordionStyles.useVariants({
    size,
    expanded: isExpanded,
    disabled: Boolean(item.disabled),
  });

  // Get dynamic styles - call as functions to get theme-reactive styles
  const itemStyle = (accordionStyles.item as any)({ type, isLast });
  const headerStyle = (accordionStyles.header as any)({});
  const iconStyle = (accordionStyles.icon as any)({});
  const contentStyle = (accordionStyles.content as any)({});
  const titleStyle = (accordionStyles.title as any)({});
  const contentInnerStyle = (contentInnerStyle as any)({});

  // Animate height and icon rotation when expanded state changes
  useEffect(() => {
    contentHeight.value = withTiming(
      isExpanded ? measuredHeight : 0,
      {
        duration: 250,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1), // Material Design standard easing
      }
    );
    iconRotation.value = withTiming(
      isExpanded ? 180 : 0,
      {
        duration: 200,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      }
    );
  }, [isExpanded, measuredHeight]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    height: contentHeight.value,
    overflow: 'hidden',
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  const handleContentLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && height !== measuredHeight) {
      setMeasuredHeight(height);
    }
  };

  return (
    <View style={itemStyle} testID={testID}>
      <TouchableOpacity
        style={headerStyle}
        onPress={onToggle}
        disabled={item.disabled}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={item.title}
        accessibilityState={{ expanded: isExpanded, disabled: item.disabled }}
      >
        <View style={titleStyle}>
          <Text style={headerStyle}>
            {item.title}
          </Text>
        </View>
        <Animated.View style={[iconStyle, animatedIconStyle]}>
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            style={iconStyle}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Hidden view for measuring content height */}
      <View
        style={{ position: 'absolute', opacity: 0, zIndex: -1 }}
        onLayout={handleContentLayout}
      >
        <View style={contentInnerStyle}>
          {typeof item.content === 'string' ? (
            <Text style={contentInnerStyle}>
              {item.content}
            </Text>
          ) : (
            item.content
          )}
        </View>
      </View>

      {/* Animated visible content */}
      <Animated.View style={animatedContentStyle}>
        <View style={contentInnerStyle}>
          {typeof item.content === 'string' ? (
            <Text style={contentInnerStyle}>
              {item.content}
            </Text>
          ) : (
            item.content
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const Accordion = forwardRef<View, AccordionProps>(({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  type = 'standard',
  size = 'md',
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
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);

  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    return getNativeAccessibilityProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityDisabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'none',
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityDisabled, accessibilityHidden, accessibilityRole]);

  // Apply variants
  accordionStyles.useVariants({
    type,
    size,
    gap,
    padding,
    paddingVertical,
    paddingHorizontal,
    margin,
    marginVertical,
    marginHorizontal,
  });

  const toggleItem = (itemId: string, disabled?: boolean) => {
    if (disabled) return;

    setExpandedItems((prev) => {
      const isExpanded = prev.includes(itemId);

      if (allowMultiple) {
        return isExpanded
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId];
      } else {
        return isExpanded ? [] : [itemId];
      }
    });
  };

  const containerStyle = (accordionStyles.container as any)({});

  return (
    <View ref={ref} nativeID={id} style={[containerStyle, style]} testID={testID} {...nativeA11yProps}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isExpanded={expandedItems.includes(item.id)}
          onToggle={() => toggleItem(item.id, item.disabled)}
          size={size}
          type={type}
          isLast={index === items.length - 1}
          testID={`${testID}-item-${item.id}`}
        />
      ))}
    </View>
  );
});

Accordion.displayName = 'Accordion';

export default Accordion;
