import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, BackHandler } from 'react-native';
import { DialogProps } from './types';
import { dialogStyles } from './Dialog.styles';

const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  title,
  children,
  size = 'medium',
  variant = 'default',
  showCloseButton = true,
  closeOnBackdropClick = true,
  animationType = 'fade',
  style,
  testID,
}) => {
  // Handle Android back button
  useEffect(() => {
    if (!open) return;

    const handleBackPress = () => {
      onOpenChange(false);
      return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [open, onOpenChange]);

  const handleBackdropPress = () => {
    if (closeOnBackdropClick) {
      onOpenChange(false);
    }
  };

  const handleClosePress = () => {
    onOpenChange(false);
  };

  // Apply variants
  dialogStyles.useVariants({
    size,
    variant,
  });

  return (
    <Modal
      visible={open}
      transparent
      animationType={animationType}
      onRequestClose={() => onOpenChange(false)}
      statusBarTranslucent
      testID={testID}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={dialogStyles.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={[dialogStyles.container, style]}>
              {(title || showCloseButton) && (
                <View style={dialogStyles.header}>
                  {title && (
                    <Text style={dialogStyles.title}>
                      {title}
                    </Text>
                  )}
                  {showCloseButton && (
                    <TouchableOpacity
                      style={dialogStyles.closeButton}
                      onPress={handleClosePress}
                      accessibilityLabel="Close dialog"
                      accessibilityRole="button"
                    >
                      <Text style={dialogStyles.closeButtonText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              <View style={dialogStyles.content}>
                {children}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Dialog;