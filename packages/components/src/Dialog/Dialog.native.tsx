import { useEffect, forwardRef, useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, BackHandler, GestureResponderEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { DialogProps } from './types';
import { dialogStyles } from './Dialog.styles';
import { getNativeInteractiveAccessibilityProps } from '../utils/accessibility';

const Dialog = forwardRef<View, DialogProps>(({
  open,
  onClose,
  title,
  children,
  size = 'md',
  type = 'default',
  showCloseButton = true,
  closeOnBackdropClick = true,
  animationType: _animationType = 'fade',
  style,
  testID,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityDisabled,
  accessibilityHidden,
  accessibilityRole,
}, ref) => {
  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    return getNativeInteractiveAccessibilityProps({
      accessibilityLabel: accessibilityLabel ?? title,
      accessibilityHint,
      accessibilityDisabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'none',
    });
  }, [accessibilityLabel, title, accessibilityHint, accessibilityDisabled, accessibilityHidden, accessibilityRole]);

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
      onClose();
      return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [open, onClose]);

  const handleBackdropPress = () => {
    if (closeOnBackdropClick) {
      onClose();
    }
  };

  const handleClosePress = () => {
    onClose();
  };

  // Apply variants
  dialogStyles.useVariants({
    size,
    type,
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

  // Get dynamic styles - call as functions for theme reactivity
  const backdropStyle = (dialogStyles.backdrop as any)({});
  const containerStyle = (dialogStyles.container as any)({});
  const headerStyle = (dialogStyles.header as any)({});
  const titleStyle = (dialogStyles.title as any)({});
  const closeButtonStyle = (dialogStyles.closeButton as any)({});
  const closeButtonTextStyle = (dialogStyles.closeButtonText as any)({});
  const contentStyle = (dialogStyles.content as any)({});

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={() => onClose()}
      statusBarTranslucent
      testID={testID}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View style={[backdropStyle, backdropAnimatedStyle]}>
          <TouchableWithoutFeedback onPress={(e: GestureResponderEvent) => e.stopPropagation()}>
            <Animated.View ref={ref as any} style={[containerStyle, style, containerAnimatedStyle]} nativeID={id} {...nativeA11yProps}>
              {(title || showCloseButton) && (
                <View style={headerStyle}>
                  {title && (
                    <Text style={titleStyle}>
                      {title}
                    </Text>
                  )}
                  {showCloseButton && (
                    <TouchableOpacity
                      style={closeButtonStyle}
                      onPress={handleClosePress}
                      accessibilityLabel="Close dialog"
                      accessibilityRole="button"
                    >
                      <Text style={closeButtonTextStyle}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              <View style={contentStyle}>
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