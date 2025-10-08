import React from 'react';
import { View, Pressable, Animated } from 'react-native';
import Text from '../Text';
import { radioButtonStyles } from './RadioButton.styles';
import type { RadioButtonProps } from './types';
import { useRadioGroup } from './RadioGroup.native';

const RadioButton: React.FC<RadioButtonProps> = ({
  value,
  checked: checkedProp,
  onPress,
  disabled: disabledProp = false,
  label,
  style,
  testID,
}) => {
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

  const dotScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[radioButtonStyles.container, style]}
      testID={testID}
      accessibilityRole="radio"
      accessibilityState={{ checked, disabled }}
    >
      <View
        style={[
          radioButtonStyles.radio,
          checked && radioButtonStyles.radioChecked,
          disabled && radioButtonStyles.radioDisabled,
        ]}
      >
        <Animated.View
          style={[
            radioButtonStyles.radioDot,
            {
              transform: [{ scale: dotScale }],
            },
          ]}
        />
      </View>
      {label && (
        <Text style={[radioButtonStyles.label, disabled && radioButtonStyles.labelDisabled]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export default RadioButton;