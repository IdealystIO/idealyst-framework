import React, { useEffect, forwardRef } from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, BackHandler } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { DialogProps } from './types';
import { dialogStyles } from './Dialog.styles';

const Dialog = forwardRef<View, DialogProps>(({
  open,
  onOpenChange,
  title,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnBackdropClick = true,
  animationType = 'fade',
  style,
  testID,
}, ref) => {
  const backdropOpacity = useSharedValue(0);
  const containerScale = useSharedValue(0.9);
  const containerOpacity = useSharedValue(0);

  // Animate in/out when open changes
  useEffect(() => {
    if (open) {
      backdropOpacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
      containerScale.value = withTiming(1, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      });
      containerOpacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
    } else {
      backdropOpacity.value = withTiming(0, {
        duration: 150,
        easing: Easing.in(Easing.ease),
      });
      containerScale.value = withTiming(0.9, {
        duration: 150,
        easing: Easing.in(Easing.cubic),
      });
      containerOpacity.value = withTiming(0, {
        duration: 150,
        easing: Easing.in(Easing.ease),
      });
    }
  }, [open]);

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

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: containerOpacity.value,
      transform: [
        { scale: containerScale.value },
      ],
    };
  });

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={() => onOpenChange(false)}
      statusBarTranslucent
      testID={testID}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View style={[dialogStyles.backdrop, backdropAnimatedStyle]}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <Animated.View ref={ref as any} style={[dialogStyles.container, style, containerAnimatedStyle]}>
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
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

Dialog.displayName = 'Dialog';

export default Dialog;