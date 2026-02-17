import { useState, useEffect, forwardRef, useMemo, memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { CheckboxProps } from './types';
import { checkboxStyles } from './Checkbox.styles';
import { getNativeSelectionAccessibilityProps } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';

/**
 * Isolated checkmark icon component.
 * Uses the resolved checkmark style as the single source of truth for sizing,
 * reducing rerenders on the parent Checkbox component.
 */
const CheckmarkIcon = memo(({ indeterminate, checked }: { indeterminate: boolean; checked: boolean }) => {
  const checkmarkStyle = (checkboxStyles.checkmark as any)({ checked });
  const iconSize = (typeof checkmarkStyle?.width === 'number' ? checkmarkStyle.width : 14);

  return (
    <View style={checkmarkStyle}>
      <MaterialDesignIcons
        name={indeterminate ? 'minus' : 'check'}
        size={iconSize}
        color="#ffffff"
      />
    </View>
  );
});

CheckmarkIcon.displayName = 'CheckmarkIcon';

const Checkbox = forwardRef<IdealystElement, CheckboxProps>(({
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
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
  required: _required = false,
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
    onChange?.(newChecked);
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
    intent,
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
  const labelStyle = (checkboxStyles.label as any)({ disabled });
  const helperTextStyle = (checkboxStyles.helperText as any)({ error: !!error });

  return (
    <View ref={ref as any} nativeID={id} style={[wrapperStyle, style]}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        testID={testID}
        {...nativeA11yProps}
        style={containerStyle}
      >
        <View style={checkboxStyle}>
          {(internalChecked || indeterminate) && (
            <CheckmarkIcon indeterminate={indeterminate} checked={internalChecked} />
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