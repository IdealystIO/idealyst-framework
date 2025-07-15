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

  if (scrollable) {
    return (
      <RNScrollView style={screenStyleArray} testID={testID}>
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