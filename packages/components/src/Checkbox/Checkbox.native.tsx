import React, { useState, useEffect, forwardRef, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CheckboxProps } from './types';
import { checkboxStyles } from './Checkbox.styles';
import { getNativeSelectionAccessibilityProps } from '../utils/accessibility';

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
  required = false,
  error,
  helperText,
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

  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    const labelContent = children || label;
    const computedLabel = accessibilityLabel ?? (typeof labelContent === 'string' ? labelContent : undefined);
    const computedChecked = accessibilityChecked ?? (indeterminate ? 'mixed' : internalChecked);

    return getNativeSelectionAccessibilityProps({
      accessibilityLabel: computedLabel,
      accessibilityHint: accessibilityHint ?? (error || helperText),
      accessibilityDisabled: accessibilityDisabled ?? disabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'checkbox',
      accessibilityLabelledBy,
      accessibilityDescribedBy,
      accessibilityChecked: computedChecked,
    });
  }, [
    accessibilityLabel,
    children,
    label,
    accessibilityHint,
    error,
    helperText,
    accessibilityDisabled,
    disabled,
    accessibilityHidden,
    accessibilityRole,
    accessibilityLabelledBy,
    accessibilityDescribedBy,
    accessibilityChecked,
    indeterminate,
    internalChecked,
  ]);

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

  // Get dynamic styles - call as functions for theme reactivity
  const wrapperStyle = (checkboxStyles.wrapper as any)({});
  const containerStyle = (checkboxStyles.container as any)({});
  const checkboxStyle = (checkboxStyles.checkbox as any)({ intent, checked: internalChecked, disabled, type: variant });
  const checkmarkStyle = (checkboxStyles.checkmark as any)({ checked: internalChecked });
  const labelStyle = (checkboxStyles.label as any)({ disabled });
  const helperTextStyle = (checkboxStyles.helperText as any)({ error: !!error });

  return (
    <View ref={ref} nativeID={id} style={[wrapperStyle, style]}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        testID={testID}
        {...nativeA11yProps}
        style={containerStyle}
      >
        <View style={checkboxStyle}>
          {(internalChecked || indeterminate) && (
            <MaterialCommunityIcons
              name={indeterminate ? 'minus' : 'check'}
              size={14}
              color="#ffffff"
              style={checkmarkStyle}
            />
          )}
        </View>
        {labelContent && (
          <Text style={labelStyle}>
            {labelContent}
          </Text>
        )}
      </Pressable>
      {displayHelperText && (
        <Text style={helperTextStyle}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox; 