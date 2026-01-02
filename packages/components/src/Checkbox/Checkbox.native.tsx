import React, { useState, useEffect, forwardRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CheckboxProps } from './types';
import { checkboxStyles } from './Checkbox.styles';

const Checkbox = forwardRef<View, CheckboxProps>(({
  checked = false,
  indeterminate = false,
  disabled = false,
  onCheckedChange,
  size = 'md',
  intent = 'primary',
  variant = 'default',
  label,
  children,
  // Spacing variants from FormInputStyleProps
  margin,
  marginVertical,
  marginHorizontal,
  style,
  testID,
  accessibilityLabel,
  required = false,
  error,
  helperText,
}, ref) => {
  const [internalChecked, setInternalChecked] = useState(checked);

  useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  const handlePress = () => {
    if (disabled) return;

    const newChecked = !internalChecked;
    setInternalChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  // Apply variants
  checkboxStyles.useVariants({
    size,
    type: variant as any,
    checked: internalChecked,
    disabled,
    visible: internalChecked || indeterminate,
    error: !!error,
    margin,
    marginVertical,
    marginHorizontal,
  });

  const labelContent = children || label;
  const displayHelperText = error || helperText;

  return (
    <View ref={ref} style={[checkboxStyles.wrapper, style]}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: internalChecked }}
        style={checkboxStyles.container}
      >
        <View style={checkboxStyles.checkbox({ intent })}>
          {(internalChecked || indeterminate) && (
            <MaterialCommunityIcons
              name={indeterminate ? 'minus' : 'check'}
              size={14}
              color="#ffffff"
              style={checkboxStyles.checkmark}
            />
          )}
        </View>
        {labelContent && (
          <Text style={checkboxStyles.label}>
            {labelContent}
          </Text>
        )}
      </Pressable>
      {displayHelperText && (
        <Text style={checkboxStyles.helperText}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox; 