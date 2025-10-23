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

  if (scrollable) {

    // For ScrollView, background and padding should be on contentContainerStyle
    const contentContainerStyleArray = [
      screenStyles.screen,
      contentInset ? {
        paddingTop: contentInset.top,
        paddingBottom: contentInset.bottom,
        paddingLeft: contentInset.left,
        paddingRight: contentInset.right,
      } : undefined,
      style,
    ];

    return (
      <RNScrollView
        ref={ref as any}
        style={{ flex: 1 }}
        contentContainerStyle={contentContainerStyleArray}
        testID={testID}
      >
        {children}
      </RNScrollView>
    );
  }

  return (
    <RNView ref={ref as any} style={[screenStyles.screen, style]} testID={testID}>
      {children}
    </RNView>
  );
});

Screen.displayName = 'Screen';

export default Screen; 