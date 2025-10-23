import React, { forwardRef } from 'react';
import { View as RNView, ScrollView as RNScrollView, SafeAreaView } from 'react-native';
import { ScreenProps } from './types';
import { screenStyles } from './Screen.styles';

const Screen = forwardRef<RNView | RNScrollView, ScreenProps>(({
  children,
  background = 'primary',
  padding = 'md',
  safeArea = true,
  scrollable = true,
  contentInset,
  style,
  testID,
}, ref) => {

  screenStyles.useVariants({
    background,
    padding,
    safeArea,
  });

  if (scrollable) {
    // For ScrollView, flex: 1 goes on the ScrollView style
    // Background and padding go on contentContainerStyle (without flex: 1)
    const scrollViewStyle = [{ flex: 1 }, style];

    const contentContainerStyleArray = [
      screenStyles.screenContent,
      contentInset ? {
        paddingTop: contentInset.top,
        paddingBottom: contentInset.bottom,
        paddingLeft: contentInset.left,
        paddingRight: contentInset.right,
      } : undefined,
    ];

  return (
    <RNScrollView
      ref={ref as any}
      style={scrollViewStyle}
      contentContainerStyle={contentContainerStyleArray}
      testID={testID}
    >
      {children}
    </RNScrollView>
    );
  }

  const containerStyle = [screenStyles.screen, style];

  const view = (
    <RNView ref={ref as any} style={containerStyle} testID={testID}>
      {children}
    </RNView>
  );

  if (safeArea) {
    return <SafeAreaView style={{ flex: 1 }}>{view}</SafeAreaView>;
  }

  return view;
});

Screen.displayName = 'Screen';

export default Screen; 