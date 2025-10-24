import React, { useState, forwardRef, useEffect } from 'react';
import { View, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { accordionStyles } from './Accordion.styles';
import Text from '../Text';
import type { AccordionProps, AccordionItem as AccordionItemType } from './types';

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

  // Apply item-specific variants
  accordionStyles.useVariants({
    type,
    isLast,
    size,
    expanded: isExpanded,
    disabled: Boolean(item.disabled),
  });

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
    <View style={accordionStyles.item} testID={testID}>
      <TouchableOpacity
        style={accordionStyles.header}
        onPress={onToggle}
        disabled={item.disabled}
        activeOpacity={0.7}
      >
        <View style={accordionStyles.title}>
          <Text style={accordionStyles.header}>
            {item.title}
          </Text>
        </View>
        <Animated.View style={[accordionStyles.icon, animatedIconStyle]}>
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            style={accordionStyles.icon}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Hidden view for measuring content height */}
      <View
        style={{ position: 'absolute', opacity: 0, zIndex: -1 }}
        onLayout={handleContentLayout}
      >
        <View style={accordionStyles.contentInner}>
          {typeof item.content === 'string' ? (
            <Text style={accordionStyles.contentInner}>
              {item.content}
            </Text>
          ) : (
            item.content
          )}
        </View>
      </View>

      {/* Animated visible content */}
      <Animated.View style={animatedContentStyle}>
        <View style={accordionStyles.contentInner}>
          {typeof item.content === 'string' ? (
            <Text style={accordionStyles.contentInner}>
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
  style,
  testID,
}, ref) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);

  // Apply variants
  accordionStyles.useVariants({
    type,
    size,
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

  return (
    <View ref={ref} style={[accordionStyles.container, style]} testID={testID}>
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
