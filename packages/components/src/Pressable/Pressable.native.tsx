import { forwardRef } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { PressableProps } from './types';
import { pressableStyles } from './Pressable.styles';
import type { IdealystElement } from '../utils/refTypes';

const Pressable = forwardRef<IdealystElement, PressableProps>(({
  children,
  onPress,
  onPressIn,
  onPressOut,
  disabled = false,
  // Spacing variants from PressableSpacingStyleProps
  padding,
  paddingVertical,
  paddingHorizontal,
  style,
  testID,
  accessibilityLabel,
  accessibilityRole: _accessibilityRole,
  id,
}, ref) => {
  // Apply spacing variants
  pressableStyles.useVariants({
    padding,
    paddingVertical,
    paddingHorizontal,
  });

  const pressableStyle = (pressableStyles.pressable as any)({});

  return (
    <TouchableWithoutFeedback
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : onPressIn}
      onPressOut={disabled ? undefined : onPressOut}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      <View ref={ref as any} nativeID={id} style={[pressableStyle, style]}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
});

Pressable.displayName = 'Pressable';

export default Pressable;