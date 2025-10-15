import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Animated } from 'react-native';
import { accordionStyles } from './Accordion.styles';
import type { AccordionProps } from './types';

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  variant = 'default',
  intent = 'primary',
  size = 'medium',
  style,
  testID,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);

  // Apply variants
  accordionStyles.useVariants({
    variant,
    intent,
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

  const ChevronIcon = () => (
    <View style={{ width: 16, height: 16 }}>
      <Text>▼</Text>
    </View>
  );

  return (
    <View style={[accordionStyles.container, style]} testID={testID}>
      {items.map((item, index) => {
        const isExpanded = expandedItems.includes(item.id);
        const isLast = index === items.length - 1;

        // Apply item-specific variants
        const itemStylesheet = accordionStyles;
        itemStylesheet.useVariants({
          variant,
          isLast,
          size,
          expanded: isExpanded,
          disabled: Boolean(item.disabled),
          intent,
        });

        return (
          <View
            key={item.id}
            style={accordionStyles.item}
            testID={`${testID}-item-${item.id}`}
          >
            <TouchableOpacity
              style={accordionStyles.header}
              onPress={() => toggleItem(item.id, item.disabled)}
              disabled={item.disabled}
              activeOpacity={0.7}
            >
              <View style={accordionStyles.title}>
                <Text style={{ fontFamily: accordionStyles.header.fontFamily }}>
                  {item.title}
                </Text>
              </View>
              <View style={accordionStyles.icon}>
                <ChevronIcon />
              </View>
            </TouchableOpacity>

            <Animated.View
              style={accordionStyles.content}
            >
              {isExpanded && (
                <View style={accordionStyles.contentInner}>
                  {item.content}
                </View>
              )}
            </Animated.View>
          </View>
        );
      })}
    </View>
  );
};

export default Accordion;
