import React, { useEffect, useRef } from 'react';
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
  showArrow = false, // Arrows are complex on native, disabled by default
  style,
  testID,
}) => {
  const popoverRef = useRef<View>(null);

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

  const handleBackdropPress = () => {
    if (closeOnClickOutside) {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  // For React Native, we simplify positioning - center the popover
  // More complex anchor positioning would require measuring anchor positions
  // which is challenging cross-platform
  const screenDimensions = Dimensions.get('window');
  const popoverStyle = [
    popoverStyles.container,
    {
      // Center on screen as a simplified approach
      position: 'absolute',
      top: screenDimensions.height * 0.4,
      left: 20,
      right: 20,
      maxWidth: screenDimensions.width - 40,
    },
    style,
  ];

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
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View ref={popoverRef} style={popoverStyle}>
              {showArrow && (
                <View style={[
                  popoverStyles.arrow,
                  // Apply placement-based arrow positioning
                ]} />
              )}
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