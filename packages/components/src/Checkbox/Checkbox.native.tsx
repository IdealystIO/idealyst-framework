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

  return (
    <View ref={ref} nativeID={id} style={[checkboxStyles.wrapper, style]}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        testID={testID}
        {...nativeA11yProps}
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