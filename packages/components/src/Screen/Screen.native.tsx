import { forwardRef, useEffect } from 'react';
import { View as RNView, ScrollView as RNScrollView, Keyboard, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from '@idealyst/theme';
import { ScreenProps } from './types';
import { screenStyles } from './Screen.styles';
import type { IdealystElement } from '../utils/refTypes';

const Screen = forwardRef<IdealystElement, ScreenProps>(({
  children,
  background = 'screen',
  safeArea = true,
  safeAreaTop,
  safeAreaBottom,
  safeAreaLeft,
  safeAreaRight,
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

  // Resolve safe area per edge: specific prop > general safeArea prop
  const applySafeAreaTop = safeAreaTop ?? safeArea;
  const applySafeAreaBottom = safeAreaBottom ?? safeArea;
  const applySafeAreaLeft = safeAreaLeft ?? safeArea;
  const applySafeAreaRight = safeAreaRight ?? safeArea;

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

  // Calculate safe area padding per edge
  const safeAreaStyle = {
    paddingTop: applySafeAreaTop ? insets.top : 0,
    paddingBottom: applySafeAreaBottom ? insets.bottom : 0,
    paddingLeft: applySafeAreaLeft ? insets.left : 0,
    paddingRight: applySafeAreaRight ? insets.right : 0,
  };

  if (scrollable) {
    // Content styles applied via View wrapper for Unistyles reactivity
    // (contentContainerStyle isn't reactive, only style prop is)
    const contentInsetStyle = contentInset ? {
      paddingTop: safeAreaStyle.paddingTop + (contentInset.top ?? 0),
      paddingBottom: safeAreaStyle.paddingBottom + (contentInset.bottom ?? 0),
      paddingLeft: safeAreaStyle.paddingLeft + (contentInset.left ?? 0),
      paddingRight: safeAreaStyle.paddingRight + (contentInset.right ?? 0),
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

  const contentInsetStyle = contentInset ? {
    paddingTop: safeAreaStyle.paddingTop + (contentInset.top ?? 0),
    paddingBottom: safeAreaStyle.paddingBottom + (contentInset.bottom ?? 0),
    paddingLeft: safeAreaStyle.paddingLeft + (contentInset.left ?? 0),
    paddingRight: safeAreaStyle.paddingRight + (contentInset.right ?? 0),
  } : safeAreaStyle;

  return (
    <Animated.View style={[{ flex: 1 }, avoidKeyboard && animatedKeyboardStyle]}>
      <RNView ref={ref as any} nativeID={id} style={[screenStyle, style]} testID={testID} onLayout={onLayout}>
        <RNView style={[contentInsetStyle, { flex: 1 }]}>
          {children}
        </RNView>
      </RNView>
    </Animated.View>
  );
});

Screen.displayName = 'Screen';

export default Screen;
