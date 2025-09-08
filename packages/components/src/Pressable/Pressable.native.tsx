import React from 'react';
import { Pressable as RNPressable } from 'react-native';
import { PressableProps } from './types';

const Pressable: React.FC<PressableProps> = ({
  children,
  onPress,
  onPressIn,
  onPressOut,
  disabled = false,
  style,
  testID,
  accessibilityLabel,
  accessibilityRole,
}) => {
  return (
    <RNPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      style={style}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
    >
      {children}
    </RNPressable>
  );
};

export default Pressable;