import { isValidElement, cloneElement, forwardRef, useEffect, useMemo } from 'react';
import {
  View,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { menuStyles } from './Menu.styles';
import type { MenuProps, MenuItem as MenuItemType } from './types';
import MenuItem from './MenuItem.native';
import useMergeRefs from '../hooks/useMergeRefs';
import { BoundedModalContent } from '../internal/BoundedModalContent.native';
import { useSmartPosition } from '../hooks/useSmartPosition.native';
import { getNativeInteractiveAccessibilityProps } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';

const Menu = forwardRef<IdealystElement, MenuProps>(({
  children,
  items,
  open,
  onOpenChange,
  placement = 'bottom-start',
  style,
  size,
  testID,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityDisabled,
  accessibilityHidden,
  accessibilityRole,
  accessibilityExpanded,
}, ref) => {
  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    return getNativeInteractiveAccessibilityProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityDisabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'menu',
      accessibilityExpanded: accessibilityExpanded ?? open,
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityDisabled, accessibilityHidden, accessibilityRole, accessibilityExpanded, open]);
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

  // Animation shared values
  const menuScale = useSharedValue(0.9);
  const menuOpacity = useSharedValue(0);

  const animatedMenuStyle = useAnimatedStyle(() => ({
    opacity: menuOpacity.value,
    transform: [{ scale: menuScale.value }],
  }));

  // Animate in when measured and positioned
  const isMeasured = menuSize.height > 0;
  const shouldShow = isMeasured && isPositioned;

  useEffect(() => {
    if (shouldShow) {
      menuScale.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      });
      menuOpacity.value = withTiming(1, {
        duration: 150,
        easing: Easing.out(Easing.ease),
      });
    } else {
      menuScale.value = 0.9;
      menuOpacity.value = 0;
    }
  }, [shouldShow]);

  // Reset position when menu closes
  useEffect(() => {
    if (!open) {
      resetPosition();
      menuScale.value = 0.9;
      menuOpacity.value = 0;
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
            maxHeight={300}
            style={[
              (menuStyles.menu as any)({}),
              style,
            ]}
            onLayout={handleMenuLayout}
          >
            <Animated.View style={animatedMenuStyle}>
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
            </Animated.View>
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
      <View ref={mergedTriggerRef} nativeID={id} collapsable={false} {...nativeA11yProps}>
        {trigger}
      </View>

      {renderMenu()}
    </>
  );
});

Menu.displayName = 'Menu';

export default Menu;
