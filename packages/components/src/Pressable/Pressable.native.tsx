import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
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
    <TouchableWithoutFeedback
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : onPressIn}
      onPressOut={disabled ? undefined : onPressOut}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
    >
      <View style={style}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Pressable;