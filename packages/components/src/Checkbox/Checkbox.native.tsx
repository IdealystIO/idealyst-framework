import React, { useState, useEffect, forwardRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CheckboxProps } from './types';
import { checkboxStyles, checkboxLabelStyles, checkboxCheckmarkStyles, checkboxHelperStyles } from './Checkbox.styles';

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

  // Apply variants for main checkbox
  checkboxStyles.useVariants({
    size,
    intent,
    variant: variant as any,
    checked: internalChecked,
    disabled,
  });

  // Apply variants for label
  checkboxLabelStyles.useVariants({
    size,
    disabled,
  });

  // Apply variants for checkmark
  checkboxCheckmarkStyles.useVariants({
    size,
    visible: internalChecked,
  });

  // Apply variants for helper text
  checkboxHelperStyles.useVariants({
    error: !!error,
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
        <View style={checkboxStyles.checkbox}>
          {(internalChecked || indeterminate) && (
            <MaterialCommunityIcons
              name={indeterminate ? 'minus' : 'check'}
              size={checkboxCheckmarkStyles.checkmark.width}
              color={checkboxCheckmarkStyles.checkmark.color}
            />
          )}
        </View>
        {labelContent && (
          <Text style={checkboxLabelStyles.label}>
            {labelContent}
          </Text>
        )}
      </Pressable>
      {displayHelperText && (
        <Text style={checkboxHelperStyles.helperText}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox; 