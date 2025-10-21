import React, { useState } from 'react';
import { View, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { accordionStyles } from './Accordion.styles';
import Text from '../Text';
import type { AccordionProps } from './types';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

    // Configure layout animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

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

        const iconStyle = accordionStyles.icon;
        const headerTextColor = accordionStyles.header.color || '#000';

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
                <Text style={{ color: headerTextColor }}>
                  {item.title}
                </Text>
              </View>
              <View
                style={[
                  accordionStyles.icon,
                  {
                    transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={iconStyle.width || 20}
                  color={iconStyle.color || headerTextColor}
                />
              </View>
            </TouchableOpacity>

            {isExpanded && (
              <View style={accordionStyles.content}>
                <View style={accordionStyles.contentInner}>
                  {item.content}
                </View>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default Accordion;
