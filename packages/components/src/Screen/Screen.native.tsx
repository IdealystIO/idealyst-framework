import React from 'react';
import { View as RNView, ScrollView as RNScrollView } from 'react-native';
import { ScreenProps } from './types';
import { screenStyles } from './Screen.styles';

const Screen: React.FC<ScreenProps> = ({
  children,
  background = 'primary',
  padding = 'md',
  safeArea = false,
  scrollable = true,
  contentInset,
  style,
  testID,
}) => {
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
        style={screenStyleArray}
        contentContainerStyle={contentContainerStyle}
        testID={testID}
      >
        {children}
      </RNScrollView>
    );
  }

  return (
    <RNView style={screenStyleArray} testID={testID}>
      {children}
    </RNView>
  );
};

export default Screen; 