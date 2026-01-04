import React, { useRef, useState, isValidElement, cloneElement, forwardRef, useEffect } from 'react';
import {
  View,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { menuStyles } from './Menu.styles';
import type { MenuProps, MenuItem as MenuItemType } from './types';
import MenuItem from './MenuItem.native';
import useMergeRefs from '../hooks/useMergeRefs';
import { BoundedModalContent } from '../internal/BoundedModalContent.native';
import { useSmartPosition } from '../hooks/useSmartPosition.native';

const Menu = forwardRef<View, MenuProps>(({
  children,
  items,
  open,
  onOpenChange,
  placement = 'bottom-start',
  style,
  size,
  testID,
  id,
}, ref) => {
  const {
    position: menuPosition,
    size: menuSize,
    isPositioned,
    anchorRef: triggerRef,
    measureAndPosition,
    handleLayout: handleMenuLayout,
    reset: resetPosition,
  } = useSmartPosition({
    placement,
    offset: 8,
    maxHeight: 300,
    matchWidth: false,
  });

  const mergedTriggerRef = useMergeRefs(ref, triggerRef);

  // Reset position when menu closes
  useEffect(() => {
    if (!open) {
      resetPosition();
    }
  }, [open]);

  const handleTriggerPress = () => {
    if (!onOpenChange) return;

    if (!open) {
      // Measure and position menu
      measureAndPosition();
      onOpenChange(true);
    } else {
      onOpenChange(false);
    }
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
    if (!open) return null;

    // Show menu only after it has been measured AND positioned
    const isMeasured = menuSize.height > 0;
    const shouldShow = isMeasured && isPositioned;

    return (
      <Modal
        visible={true}
        transparent
        animationType="none"
        onRequestClose={() => onOpenChange?.(false)}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={handleBackdropPress}
        >
          <BoundedModalContent
            top={menuPosition.top}
            left={menuPosition.left}
            width={menuPosition.width}
            maxHeight={300}
            style={[
              menuStyles.menu,
              style,
              { opacity: shouldShow ? 1 : 0 }
            ]}
            onLayout={handleMenuLayout}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
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
          </BoundedModalContent>
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
      <View ref={mergedTriggerRef} nativeID={id} collapsable={false}>
        {trigger}
      </View>

      {renderMenu()}
    </>
  );
});

Menu.displayName = 'Menu';

export default Menu;
