import { useEffect, forwardRef, useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, BackHandler, Platform, Keyboard, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from '@idealyst/theme';
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
  avoidKeyboard = false,
  padding: paddingProp = 20,
  maxContentHeight,
  contentPadding = 24,
  contentStyle,
  style,
  testID,
  id,
  BackdropComponent,
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

  // Get safe area insets
  const insets = useSafeAreaInsets();

  // Track keyboard height for avoidKeyboard
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { height: screenHeight } = useWindowDimensions();

  useEffect(() => {
    if (!avoidKeyboard || !open) return;

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [avoidKeyboard, open]);

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
    'worklet';
    return {
      opacity: containerOpacity.value,
      transform: [
        { scale: containerScale.value },
      ] as { scale: number }[],
    };
  });

  // Get dynamic styles - call as functions for theme reactivity
  const backdropStyle = (dialogStyles.backdrop as any)({});
  const containerStyle = (dialogStyles.container as any)({});
  const headerStyle = (dialogStyles.header as any)({});
  const titleStyle = (dialogStyles.title as any)({});
  const closeButtonStyle = (dialogStyles.closeButton as any)({});
  const closeButtonTextStyle = (dialogStyles.closeButtonText as any)({});

  // Style for custom backdrop component container (fills entire backdrop area)
  const customBackdropContainerStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  // Position offsets for the container view
  // Top: always safe area + padding
  // Bottom: safe area + padding (no keyboard) or keyboard + padding (with keyboard)
  const topOffset = insets.top + paddingProp;
  const bottomOffset = keyboardHeight > 0
    ? keyboardHeight + paddingProp
    : insets.bottom + paddingProp;

  // Max height is the available space (used as a ceiling, children can be smaller)
  const maxAvailableHeight = screenHeight - topOffset - bottomOffset;

  // Use the smaller of user's preferred max height and available space
  const effectiveMaxHeight = maxContentHeight
    ? Math.min(maxContentHeight, maxAvailableHeight)
    : maxAvailableHeight;

  // Dialog uses the effective max height, with flex: 1 so children can fill it
  const dialogContainerStyle = {
    ...containerStyle,
    maxHeight: effectiveMaxHeight,
    height: maxContentHeight ? effectiveMaxHeight : undefined,
    flex: undefined,
  };

  const dialogContainer = (
    <Animated.View ref={ref as any} style={[dialogContainerStyle, style, containerAnimatedStyle]} nativeID={id} {...nativeA11yProps}>
      {(title || showCloseButton) && (
        <View style={[headerStyle, { flexShrink: 0 }]}>
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
      <View style={[contentPadding > 0 ? { padding: contentPadding } : undefined, contentStyle]}>
        {children}
      </View>
    </Animated.View>
  );

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={() => onClose()}
      statusBarTranslucent
      testID={testID}
    >
      {/* Backdrop layer - positioned absolute, full screen */}
      {BackdropComponent ? (
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View style={[customBackdropContainerStyle, backdropAnimatedStyle]} pointerEvents="auto">
            <View style={{ flex: 1 }} pointerEvents="none">
              <BackdropComponent isVisible={open} />
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View style={[backdropStyle, backdropAnimatedStyle]} />
        </TouchableWithoutFeedback>
      )}
      {/* Dialog content - positioned absolute, accounts for keyboard and safe areas */}
      <View
        style={{
          position: 'absolute',
          top: topOffset,
          left: 0,
          right: 0,
          bottom: bottomOffset,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
        }}
        pointerEvents="box-none"
      >
        {dialogContainer}
      </View>
    </Modal>
  );
});

Dialog.displayName = 'Dialog';

export default Dialog;