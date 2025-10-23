import React, { forwardRef } from 'react';
import { View, Pressable, Animated } from 'react-native';
import Text from '../Text';
import { radioButtonStyles } from './RadioButton.styles';
import type { RadioButtonProps } from './types';
import { useRadioGroup } from './RadioGroup.native';

const RadioButton = forwardRef<Pressable, RadioButtonProps>(({
  value,
  checked: checkedProp,
  onPress,
  disabled: disabledProp = false,
  label,
  size = 'md',
  intent = 'primary',
  style,
  testID,
}, ref) => {
  const group = useRadioGroup();

  const checked = group.value !== undefined ? group.value === value : checkedProp;
  const disabled = group.disabled || disabledProp;

  const animatedValue = React.useRef(new Animated.Value(checked ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: checked ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  }, [checked, animatedValue]);

  const handlePress = () => {
    if (!disabled) {
      if (group.onValueChange) {
        group.onValueChange(value);
      } else if (onPress) {
        onPress();
      }
    }
  };

  // Apply variants for radio styles
  radioButtonStyles.useVariants({
    size,
    checked,
    disabled,
    intent,
  });

  const dotScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Pressable
      ref={ref}
      onPress={handlePress}
      disabled={disabled}
      style={[radioButtonStyles.container, style]}
      testID={testID}
      accessibilityRole="radio"
      accessibilityState={{ checked, disabled }}
    >
      <View style={radioButtonStyles.radio({ intent })}>
        <Animated.View
          style={[
            radioButtonStyles.radioDot({ intent }),
            {
              transform: [{ scale: dotScale }],
            },
          ]}
        />
      </View>
      {label && (
        <Text style={radioButtonStyles.label}>
          {label}
        </Text>
      )}
    </Pressable>
  );
});

RadioButton.displayName = 'RadioButton';

export default RadioButton;