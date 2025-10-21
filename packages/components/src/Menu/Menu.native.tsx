import React, { useRef, useState, isValidElement, cloneElement } from 'react';
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

const Menu: React.FC<MenuProps> = ({
  children,
  items,
  open,
  onOpenChange,
  placement = 'bottom-start',
  style,
  size,
  testID,
}) => {
  const triggerRef = useRef<any>(null);
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

  // Apply base menu styles
  menuStyles.useVariants({ size });

  const renderMenu = () => {
    if (!menuPosition || menuPosition.top === 0) return null;

    return (
      <Modal
        visible={open}
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
                minWidth: menuPosition.width || 200,
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
                if (item.separator) {
                  return <Divider key={`separator-${index}`} />;
                }

                return (
                  <MenuItem
                    key={item.id || index}
                    item={item}
                    onPress={handleItemPress}
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
      <View ref={triggerRef} collapsable={false}>
        {trigger}
      </View>

      {renderMenu()}
    </>
  );
};

export default Menu;
