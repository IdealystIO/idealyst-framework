import { forwardRef, useEffect } from 'react';
import { View as RNView, ScrollView as RNScrollView, Keyboard, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenProps } from './types';
import { screenStyles } from './Screen.styles';
import type { IdealystElement } from '../utils/refTypes';

const Screen = forwardRef<IdealystElement, ScreenProps>(({
  children,
  background = 'screen',
  safeArea = true,
  scrollable = true,
  avoidKeyboard = true,
  contentInset,
  onLayout,
  // Spacing variants from ContainerStyleProps
  gap,
  padding,
  paddingVertical,
  paddingHorizontal,
  margin,
  marginVertical,
  marginHorizontal,
  style,
  testID,
  id,
}, ref) => {
  const insets = useSafeAreaInsets();

  // Animated keyboard offset
  const keyboardOffset = useSharedValue(0);

  // Listen for keyboard events and animate
  useEffect(() => {
    if (!avoidKeyboard) return;

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (e) => {
      keyboardOffset.value = withTiming(e.endCoordinates.height, {
        duration: Platform.OS === 'ios' ? e.duration : 250,
        easing: Easing.out(Easing.cubic),
      });
    });

    const hideSubscription = Keyboard.addListener(hideEvent, (e) => {
      keyboardOffset.value = withTiming(0, {
        duration: Platform.OS === 'ios' ? (e.duration ?? 250) : 250,
        easing: Easing.out(Easing.cubic),
      });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [avoidKeyboard]);

  const animatedKeyboardStyle = useAnimatedStyle(() => ({
    paddingBottom: keyboardOffset.value,
  }));

  // Handle 'transparent' background separately since it's not a surface color key
  // The $surface iterator only expands to actual surface color keys
  const backgroundVariant = background === 'transparent' ? undefined : background;

  // Set active variants for this render
  screenStyles.useVariants({
    background: backgroundVariant,
    safeArea,
    gap,
    padding,
    paddingVertical,
    paddingHorizontal,
    margin,
    marginVertical,
    marginHorizontal,
  });

  // Call styles as functions to get theme-reactive styles
  const screenStyle = (screenStyles.screen as any)({});

  // Calculate safe area padding
  const safeAreaStyle = safeArea ? {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  } : undefined;

  if (scrollable) {
    // Content styles applied via View wrapper for Unistyles reactivity
    // (contentContainerStyle isn't reactive, only style prop is)
    const contentInsetStyle = contentInset ? {
      paddingTop: (safeArea ? insets.top : 0) + (contentInset.top ?? 0),
      paddingBottom: (safeArea ? insets.bottom : 0) + (contentInset.bottom ?? 0),
      paddingLeft: (safeArea ? insets.left : 0) + (contentInset.left ?? 0),
      paddingRight: (safeArea ? insets.right : 0) + (contentInset.right ?? 0),
    } : safeAreaStyle;

    return (
      <Animated.View style={[{ flex: 1 }, avoidKeyboard && animatedKeyboardStyle]}>
        <RNScrollView
          ref={ref as any}
          nativeID={id}
          style={[screenStyle, style]}
          contentContainerStyle={{ flexGrow: 1 }}
          testID={testID}
          onLayout={onLayout}
          keyboardShouldPersistTaps="handled"
        >
          <RNView style={[contentInsetStyle, { flex: 1 }]}>
            {children}
          </RNView>
        </RNScrollView>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[{ flex: 1 }, avoidKeyboard && animatedKeyboardStyle]}>
      <RNView ref={ref as any} nativeID={id} style={[screenStyle, safeAreaStyle, style]} testID={testID} onLayout={onLayout}>
        {children}
      </RNView>
    </Animated.View>
  );
});

Screen.displayName = 'Screen';

export default Screen;
