import { useEffect, forwardRef, useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, BackHandler, Platform, Keyboard, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue, useDerivedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
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
  height,
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

  // Animated keyboard height for smooth keyboard avoidance
  const keyboardHeight = useSharedValue(0);
  const { height: screenHeight } = useWindowDimensions();

  useEffect(() => {
    if (!avoidKeyboard || !open) {
      // Animate back to 0 when dialog closes or avoidKeyboard is disabled
      keyboardHeight.value = withTiming(0, { duration: 250 });
      return;
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      const duration = Platform.OS === 'ios' ? e.duration : 250;
      keyboardHeight.value = withTiming(e.endCoordinates.height, { duration });
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      const duration = Platform.OS === 'ios' ? (e?.duration ?? 250) : 250;
      keyboardHeight.value = withTiming(0, { duration });
    });

    return () => {
      showSub.remove();
      hideSub.remove();
      // Animate back to 0 on cleanup so we don't get stuck at a stale value
      keyboardHeight.value = withTiming(0, { duration: 250 });
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

  // Derived bottom offset — animates smoothly with keyboard
  const topOffset = insets.top + paddingProp;
  const bottomOffset = useDerivedValue(() => {
    'worklet';
    return keyboardHeight.value > 0
      ? keyboardHeight.value + paddingProp
      : insets.bottom + paddingProp;
  });

  // Animated style for the positioning wrapper
  const positioningStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      bottom: bottomOffset.value,
    };
  });

  // Resolve explicit height (number or percentage string)
  const resolvedHeight = typeof height === 'string'
    ? height.endsWith('%')
      ? (parseFloat(height) / 100) * screenHeight // approximate; animated version below handles it
      : parseFloat(height)
    : height;

  // Only apply flex: 1 to content when the dialog has a definite height to flex against.
  // Without a definite height, flex: 1 collapses content instead of wrapping naturally.
  const hasDefiniteHeight = Boolean(resolvedHeight || maxContentHeight);

  // Static container styles (not dependent on keyboard)
  const staticContainerStyle = {
    ...containerStyle,
    flex: undefined,
  };

  // Animated maxHeight/height that responds to keyboard changes
  const dialogSizeStyle = useAnimatedStyle(() => {
    'worklet';
    const currentBottom = bottomOffset.value;
    const maxAvailable = screenHeight - topOffset - currentBottom;
    const effectiveMax = maxContentHeight
      ? Math.min(maxContentHeight, maxAvailable)
      : maxAvailable;

    const result: { maxHeight: number; height?: number } = {
      maxHeight: effectiveMax,
    };

    if (resolvedHeight) {
      result.height = Math.min(resolvedHeight, effectiveMax);
    } else if (maxContentHeight) {
      result.height = effectiveMax;
    }

    return result;
  });

  const dialogContainer = (
    <Animated.View
      ref={ref as any}
      style={[staticContainerStyle, style, dialogSizeStyle, containerAnimatedStyle]}
      nativeID={id}
      {...nativeA11yProps}
    >
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
      <View style={[hasDefiniteHeight && { flex: 1, minHeight: 0 }, contentPadding > 0 ? { padding: contentPadding } : undefined, contentStyle]}>
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
      <Animated.View
        style={[{
          position: 'absolute',
          top: topOffset,
          left: 0,
          right: 0,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
        }, positioningStyle]}
        pointerEvents="box-none"
      >
        {dialogContainer}
      </Animated.View>
    </Modal>
  );
});

Dialog.displayName = 'Dialog';

export default Dialog;
