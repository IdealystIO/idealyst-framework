import React, { forwardRef } from 'react';
import { View as RNView, ScrollView as RNScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenProps } from './types';
import { screenStyles } from './Screen.styles';

const Screen = forwardRef<RNView | RNScrollView, ScreenProps>(({
  children,
  background = 'primary',
  safeArea = true,
  scrollable = true,
  contentInset,
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

  // Set active variants for this render
  screenStyles.useVariants({
    background,
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
  const screenContentStyle = (screenStyles.screenContent as any)({});

  // Calculate safe area padding
  const safeAreaStyle = safeArea ? {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  } : undefined;

  if (scrollable) {
    return (
      <RNScrollView
        ref={ref as any}
        nativeID={id}
        style={[{ flex: 1 }, style]}
        contentContainerStyle={[
          screenContentStyle,
          safeAreaStyle,
          contentInset ? {
            paddingTop: (safeArea ? insets.top : 0) + (contentInset.top ?? 0),
            paddingBottom: (safeArea ? insets.bottom : 0) + (contentInset.bottom ?? 0),
            paddingLeft: (safeArea ? insets.left : 0) + (contentInset.left ?? 0),
            paddingRight: (safeArea ? insets.right : 0) + (contentInset.right ?? 0),
          } : undefined,
        ]}
        testID={testID}
      >
        {children}
      </RNScrollView>
    );
  }

  return (
    <RNView ref={ref as any} nativeID={id} style={[screenStyle, safeAreaStyle, style]} testID={testID}>
      {children}
    </RNView>
  );
});

Screen.displayName = 'Screen';

export default Screen;
