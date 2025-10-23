import React, { useRef, useState, isValidElement, cloneElement, forwardRef, useEffect } from 'react';
import {
  View,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { menuStyles } from './Menu.styles';
import type { MenuProps, MenuItem as MenuItemType } from './types';
import { Divider } from '../Divider';
import MenuItem from './MenuItem.native';
import useMergeRefs from '../hooks/useMergeRefs';
import { calculateSmartPosition, calculateAvailableHeight } from '../utils/positionUtils.native';
import { BoundedModalContent } from '../internal/BoundedModalContent.native';

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
  const [menuSize, setMenuSize] = useState({ width: 0, height: 0 });
  const anchorMeasurements = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const insets = useSafeAreaInsets();

  // Recalculate position when menu size changes
  useEffect(() => {
    if (open && anchorMeasurements.current && menuSize.width > 0 && menuSize.height > 0) {
      const { x, y, width, height } = anchorMeasurements.current;
      calculateMenuPosition(x, y, width, height);
    }
  }, [menuSize, open]);

  const handleTriggerPress = () => {
    if (!onOpenChange) return;

    if (!open) {
      // Measure trigger position before opening
      triggerRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
        // Store anchor measurements for potential recalculation
        anchorMeasurements.current = { x, y, width, height };
        calculateMenuPosition(x, y, width, height);
        onOpenChange(true);
      });
    } else {
      onOpenChange(false);
    }
  };

  const calculateMenuPosition = (x: number, y: number, width: number, height: number) => {
    const offset = 8;
    const desiredMaxHeight = 300; // Maximum height we want for the menu

    // For flip detection, use maxHeight so it properly detects when there's not enough space
    // But if we have a measured size that's SMALLER than maxHeight, use that for final positioning
    // to avoid unnecessary gaps (this happens when content naturally fits)
    const heightForPositioning = menuSize.height > 0 && menuSize.height < desiredMaxHeight
      ? menuSize.height
      : desiredMaxHeight;

    const desiredSize = {
      width: menuSize.width,
      height: heightForPositioning
    };

    // Use smart positioning with boundary detection and flipping
    const position = calculateSmartPosition(
      { x, y, width, height },
      desiredSize,
      placement,
      offset,
      false,
      insets
    );

    setMenuPosition({ top: position.top, left: position.left, width });
  };

  const handleMenuLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    // Only update if size has changed significantly
    if (Math.abs(width - menuSize.width) > 1 || Math.abs(height - menuSize.height) > 1) {
      setMenuSize({ width, height });
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
          <BoundedModalContent
            top={menuPosition.top}
            left={menuPosition.left}
            width={menuPosition.width}
            maxHeight={300}
            style={[menuStyles.menu, style]}
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
      <View ref={mergedTriggerRef} collapsable={false}>
        {trigger}
      </View>

      {renderMenu()}
    </>
  );
});

Menu.displayName = 'Menu';

export default Menu;
