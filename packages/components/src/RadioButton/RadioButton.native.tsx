import React, { ComponentRef, forwardRef, useMemo } from 'react';
import { View, Pressable, Animated } from 'react-native';
import Text from '../Text';
import { radioButtonStyles } from './RadioButton.styles';
import type { RadioButtonProps } from './types';
import { useRadioGroup } from './RadioGroup.native';
import { getNativeSelectionAccessibilityProps } from '../utils/accessibility';

const RadioButton = forwardRef<ComponentRef<typeof Pressable>, RadioButtonProps>(({
  value,
  checked: checkedProp,
  onPress,
  disabled: disabledProp = false,
  label,
  size = 'md',
  intent = 'primary',
  // Spacing variants from FormInputStyleProps
  margin,
  marginVertical,
  marginHorizontal,
  style,
  testID,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityDisabled,
  accessibilityHidden,
  accessibilityRole,
  accessibilityLabelledBy,
  accessibilityDescribedBy,
  accessibilityChecked,
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

  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    const computedLabel = accessibilityLabel ?? label;
    const computedChecked = accessibilityChecked ?? checked;

    return getNativeSelectionAccessibilityProps({
      accessibilityLabel: computedLabel,
      accessibilityHint,
      accessibilityDisabled: accessibilityDisabled ?? disabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'radio',
      accessibilityLabelledBy,
      accessibilityDescribedBy,
      accessibilityChecked: computedChecked,
    });
  }, [
    accessibilityLabel,
    label,
    accessibilityHint,
    accessibilityDisabled,
    disabled,
    accessibilityHidden,
    accessibilityRole,
    accessibilityLabelledBy,
    accessibilityDescribedBy,
    accessibilityChecked,
    checked,
  ]);

  // Apply variants for radio styles
  radioButtonStyles.useVariants({
    size,
    checked,
    disabled,
    margin,
    marginVertical,
    marginHorizontal,
  });

  const dotScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Get dynamic styles - call as functions for theme reactivity
  const containerStyle = (radioButtonStyles.container as any)({});
  const radioStyle = (radioButtonStyles.radio as any)({ intent, checked, disabled });
  const radioDotStyle = (radioButtonStyles.radioDot as any)({ intent });
  const labelStyle = (radioButtonStyles.label as any)({ disabled });

  return (
    <Pressable
      ref={ref}
      nativeID={id}
      onPress={handlePress}
      disabled={disabled}
      style={[containerStyle, style]}
      testID={testID}
      {...nativeA11yProps}
    >
      <View style={radioStyle}>
        <Animated.View
          style={[
            radioDotStyle,
            {
              transform: [{ scale: dotScale }],
            },
          ]}
        />
      </View>
      {label && (
        <Text style={labelStyle}>
          {label}
        </Text>
      )}
    </Pressable>
  );
});

RadioButton.displayName = 'RadioButton';

export default RadioButton;