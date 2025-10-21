import React, { forwardRef } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { PressableProps } from './types';

const Pressable = forwardRef<View, PressableProps>(({
  children,
  onPress,
  onPressIn,
  onPressOut,
  disabled = false,
  style,
  testID,
  accessibilityLabel,
  accessibilityRole,
}, ref) => {
  return (
    <TouchableWithoutFeedback
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : onPressIn}
      onPressOut={disabled ? undefined : onPressOut}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
    >
      <View ref={ref} style={style}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
});

Pressable.displayName = 'Pressable';

export default Pressable;