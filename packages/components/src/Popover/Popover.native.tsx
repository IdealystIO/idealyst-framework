import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, TouchableWithoutFeedback, BackHandler, Dimensions } from 'react-native';
import { PopoverProps } from './types';
import { popoverStyles } from './Popover.styles';

const Popover: React.FC<PopoverProps> = ({
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
}) => {
  const popoverRef = useRef<View>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0, width: 0 });
  const [popoverSize, setPopoverSize] = useState({ width: 0, height: 0 });
  const anchorMeasurements = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Apply variants
  popoverStyles.useVariants({});

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
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    // Use measured size if available, otherwise use estimates
    const popoverWidth = popoverSize.width || 200;
    const popoverHeight = popoverSize.height || 150;
    const padding = 12; // Minimum padding from screen edges

    let top = 0;
    let left = 0;

    // Calculate position based on placement
    switch (placement) {
      case 'bottom':
      case 'bottom-start':
        top = y + height + offset;
        left = placement === 'bottom' ? x + width / 2 : x;
        break;
      case 'bottom-end':
        top = y + height + offset;
        left = x + width;
        break;
      case 'top':
      case 'top-start':
        top = y - offset;
        left = placement === 'top' ? x + width / 2 : x;
        break;
      case 'top-end':
        top = y - offset;
        left = x + width;
        break;
      case 'left':
      case 'left-start':
      case 'left-end':
        top = placement === 'left' ? y + height / 2 : placement === 'left-start' ? y : y + height;
        left = x - offset;
        break;
      case 'right':
      case 'right-start':
      case 'right-end':
        top = placement === 'right' ? y + height / 2 : placement === 'right-start' ? y : y + height;
        left = x + width + offset;
        break;
      default:
        top = y + height + offset;
        left = x;
    }

    // Keep popover within viewport bounds
    if (left < padding) {
      left = padding;
    }
    if (left + popoverWidth > screenWidth - padding) {
      left = screenWidth - popoverWidth - padding;
    }
    if (top < padding) {
      top = padding;
    }
    if (top + popoverHeight > screenHeight - padding) {
      top = screenHeight - popoverHeight - padding;
    }

    setPopoverPosition({ top, left, width });
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

  const popoverStyle = [
    popoverStyles.container,
    {
      position: 'absolute',
      top: popoverPosition.top,
      left: popoverPosition.left,
      minWidth: popoverPosition.width || 200,
      maxWidth: maxPopoverWidth,
    },
    style,
  ];

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
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={popoverStyles.backdrop}>
          <TouchableWithoutFeedback>
            <View ref={popoverRef} style={popoverStyle} onLayout={handlePopoverLayout}>
              {showArrow && <View style={popoverStyles.arrow} />}
              <View style={popoverStyles.content}>
                {children}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Popover;