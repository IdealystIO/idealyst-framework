import React, { forwardRef } from 'react';
import { View as RNView, ScrollView as RNScrollView } from 'react-native';
import { ScreenProps } from './types';
import { screenStyles } from './Screen.styles';

const Screen = forwardRef<RNView | RNScrollView, ScreenProps>(({
  children,
  background = 'primary',
  padding = 'md',
  safeArea = false,
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

  const screenStyleArray = [
    screenStyles.screen,
    style,
  ];

  // Build content container style from contentInset
  const contentContainerStyle = contentInset ? {
    paddingTop: contentInset.top,
    paddingBottom: contentInset.bottom,
    paddingLeft: contentInset.left,
    paddingRight: contentInset.right,
  } : undefined;

  if (scrollable) {
    return (
      <RNScrollView
        ref={ref as any}
        style={screenStyleArray}
        contentContainerStyle={contentContainerStyle}
        testID={testID}
      >
        {children}
      </RNScrollView>
    );
  }

  return (
    <RNView ref={ref as any} style={screenStyleArray} testID={testID}>
      {children}
    </RNView>
  );
});

Screen.displayName = 'Screen';

export default Screen; 