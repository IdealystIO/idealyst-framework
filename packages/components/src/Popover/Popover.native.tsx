import React, { useEffect, useRef, useState, forwardRef, useMemo } from 'react';
import { Modal, View, TouchableWithoutFeedback, BackHandler, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PopoverProps } from './types';
import { popoverStyles } from './Popover.styles';
import { calculateSmartPosition, calculateAvailableHeight } from '../utils/positionUtils.native';
import { BoundedModalContent } from '../internal/BoundedModalContent.native';
import { getNativeInteractiveAccessibilityProps } from '../utils/accessibility';

const Popover = forwardRef<View, PopoverProps>(({
  open,
  onOpenChange,
  anchor,
  children,
  placement = 'bottom',
  offset = 8,
  closeOnClickOutside = true,
  showArrow = false,
  style,
  testID,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  accessibilityHidden,
}, ref) => {
  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    return getNativeInteractiveAccessibilityProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityRole: accessibilityRole ?? 'none',
      accessibilityHidden,
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityRole, accessibilityHidden]);
  const popoverRef = useRef<View>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0, width: 0 });
  const [popoverSize, setPopoverSize] = useState({ width: 0, height: 0 });
  const anchorMeasurements = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const insets = useSafeAreaInsets();

  // Apply variants
  popoverStyles.useVariants({});

  // Get dynamic styles - call as functions for theme reactivity
  const backdropStyle = (popoverStyles.backdrop as any)({});
  const containerStyle = (popoverStyles.container as any)({});
  const arrowStyle = (popoverStyles.arrow as any)({});
  const contentStyle = (popoverStyles.content as any)({});

  // Determine if anchor is a ref object
  const anchorRefToUse = React.useMemo(() => {
    if (!anchor || typeof anchor !== 'object') return null;
    // Check if it has 'current' property (ref object)
    if ('current' in anchor) {
      return anchor as React.RefObject<any>;
    }
    return null;
  }, [anchor]);

  // Handle Android back button
  useEffect(() => {
    if (!open) return;

    const handleBackPress = () => {
      onOpenChange(false);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [open, onOpenChange]);

  // Measure anchor position when opening
  useEffect(() => {
    if (open && anchorRefToUse?.current) {
      anchorRefToUse.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
        anchorMeasurements.current = { x, y, width, height };
        calculatePopoverPosition(x, y, width, height);
      });
    }
  }, [open, placement, anchorRefToUse]);

  // Recalculate position when popover size changes
  useEffect(() => {
    if (open && popoverSize.width > 0 && popoverSize.height > 0) {
      const { x, y, width, height } = anchorMeasurements.current;
      if (x > 0 || y > 0) {
        calculatePopoverPosition(x, y, width, height);
      }
    }
  }, [popoverSize, open]);

  const calculatePopoverPosition = (x: number, y: number, width: number, height: number) => {
    // Use measured size if available, otherwise use estimates
    const popoverWidth = popoverSize.width || 200;
    const desiredMaxHeight = 500; // Maximum height we want for popovers

    // For flip detection, use maxHeight so it properly detects when there's not enough space
    // But if we have a measured size that's SMALLER than maxHeight, use that for final positioning
    // to avoid unnecessary gaps (this happens when content naturally fits)
    const heightForPositioning = popoverSize.height > 0 && popoverSize.height < desiredMaxHeight
      ? popoverSize.height
      : desiredMaxHeight;

    const desiredSize = {
      width: popoverWidth,
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

    setPopoverPosition({ top: position.top, left: position.left, width });
  };

  const handleBackdropPress = () => {
    if (closeOnClickOutside) {
      onOpenChange(false);
    }
  };

  const handlePopoverLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    // Only update if size has changed significantly (to avoid infinite loops)
    if (Math.abs(width - popoverSize.width) > 1 || Math.abs(height - popoverSize.height) > 1) {
      setPopoverSize({ width, height });
    }
  };

  const { width: screenWidth } = Dimensions.get('window');
  const maxPopoverWidth = screenWidth - 24; // 12px padding on each side

  if (!open || popoverPosition.top === 0) {
    return null;
  }

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
      testID={testID}
      nativeID={id}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={backdropStyle}>
          <TouchableWithoutFeedback>
            <BoundedModalContent
              top={popoverPosition.top}
              left={popoverPosition.left}
              width={Math.min(popoverPosition.width || 200, maxPopoverWidth)}
              maxHeight={500}
              style={[containerStyle, style]}
              onLayout={handlePopoverLayout}
              {...nativeA11yProps}
            >
              {showArrow && <View style={arrowStyle} />}
              <View style={contentStyle}>
                {children}
              </View>
            </BoundedModalContent>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

Popover.displayName = 'Popover';

export default Popover;