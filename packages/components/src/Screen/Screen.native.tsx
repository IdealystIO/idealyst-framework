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

  // Calculate safe area padding
  const safeAreaStyle = safeArea ? {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  } : undefined;

  if (scrollable) {
    // For ScrollView, flex: 1 goes on the ScrollView style
    // Background and padding go on contentContainerStyle (without flex: 1)
    const scrollViewStyle = [{ flex: 1 }, style];

    const contentContainerStyleArray = [
      screenStyles.screenContent,
      safeAreaStyle,
      contentInset ? {
        paddingTop: (safeArea ? insets.top : 0) + (contentInset.top ?? 0),
        paddingBottom: (safeArea ? insets.bottom : 0) + (contentInset.bottom ?? 0),
        paddingLeft: (safeArea ? insets.left : 0) + (contentInset.left ?? 0),
        paddingRight: (safeArea ? insets.right : 0) + (contentInset.right ?? 0),
      } : undefined,
    ];

    return (
      <RNScrollView
        ref={ref as any}
        nativeID={id}
        style={scrollViewStyle}
        contentContainerStyle={contentContainerStyleArray}
        testID={testID}
      >
        {children}
      </RNScrollView>
    );
  }

  const containerStyle = [
    screenStyles.screen,
    safeAreaStyle,
    style,
  ];

  return (
    <RNView ref={ref as any} nativeID={id} style={containerStyle} testID={testID}>
      {children}
    </RNView>
  );
});

Screen.displayName = 'Screen';

export default Screen;
