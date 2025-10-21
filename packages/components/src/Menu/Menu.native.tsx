import React, { useRef, useState, isValidElement, cloneElement, forwardRef } from 'react';
import {
  View,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { menuStyles } from './Menu.styles';
import type { MenuProps, MenuItem as MenuItemType } from './types';
import { Divider } from '../Divider';
import MenuItem from './MenuItem.native';
import useMergeRefs from '../hooks/useMergeRefs';

const Menu = forwardRef<View, MenuProps>(({
  children,
  items,
  open,
  onOpenChange,
  placement = 'bottom-start',
  style,
  size,
  testID,
}, ref) => {
  const triggerRef = useRef<any>(null);
  const mergedTriggerRef = useMergeRefs(ref, triggerRef);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });

  const handleTriggerPress = () => {
    if (!onOpenChange) return;

    if (!open) {
      // Measure trigger position before opening
      triggerRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
        calculateMenuPosition(x, y, width, height);
        onOpenChange(true);
      });
    } else {
      onOpenChange(false);
    }
  };

  const calculateMenuPosition = (x: number, y: number, width: number, height: number) => {
    const offset = 8;
    let top = 0;
    let left = 0;

    // Calculate position based on placement
    switch (placement) {
      case 'bottom':
      case 'bottom-start':
        top = y + height + offset;
        left = x;
        break;
      case 'bottom-end':
        top = y + height + offset;
        left = x + width;
        break;
      case 'top':
      case 'top-start':
        top = y - offset;
        left = x;
        break;
      case 'top-end':
        top = y - offset;
        left = x + width;
        break;
      case 'left':
        top = y;
        left = x - offset;
        break;
      case 'right':
        top = y;
        left = x + width + offset;
        break;
      default:
        top = y + height + offset;
        left = x;
    }

    setMenuPosition({ top, left, width });
  };

  const handleItemPress = (item: MenuItemType) => {
    if (item.disabled) return;

    item.onClick?.();
    onOpenChange?.(false);
  };

  const handleBackdropPress = () => {
    onOpenChange?.(false);
  };

  const renderMenu = () => {
    const isPositioned = menuPosition && menuPosition.top !== 0;

    return (
      <Modal
        visible={open && isPositioned}
        transparent
        animationType="none"
        onRequestClose={() => onOpenChange?.(false)}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={handleBackdropPress}
        >
          <View
            style={[
              menuStyles.menu,
              {
                position: 'absolute',
                top: menuPosition.top,
                left: menuPosition.left,
              },
              style,
            ]}
            onStartShouldSetResponder={() => true}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 300 }}
            >
              {items.map((item, index) => {

                return (
                  <MenuItem
                    key={item.id || index}
                    item={item}
                    onPress={handleItemPress}
                    size={size}
                    testID={testID ? `${testID}-item-${item.id || index}` : undefined}
                  />
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    );
  };

  // Clone the child element and merge onPress handler
  const trigger = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        onPress: () => {
          // Call original onPress if it exists
          const originalOnPress = (children as any).props?.onPress;
          originalOnPress?.();
          // Then handle menu toggle
          handleTriggerPress();
        },
      })
    : children;

  return (
    <>
      <View ref={mergedTriggerRef} collapsable={false}>
        {trigger}
      </View>

      {renderMenu()}
    </>
  );
});

Menu.displayName = 'Menu';

export default Menu;
