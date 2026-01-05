import React, { useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { radioButtonStyles } from './RadioButton.styles';
import type { RadioButtonProps } from './types';
import { useRadioGroup } from './RadioGroup.web';
import { getWebSelectionAriaProps, generateAccessibilityId } from '../utils/accessibility';

const RadioButton: React.FC<RadioButtonProps> = ({
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
}) => {
  const group = useRadioGroup();

  const checked = group.value !== undefined ? group.value === value : checkedProp;
  const disabled = group.disabled || disabledProp;

  const handleClick = () => {
    if (!disabled) {
      if (group.onValueChange) {
        group.onValueChange(value);
      } else if (onPress) {
        onPress();
      }
    }
  };

  // Generate unique ID for accessibility
  const radioId = useMemo(() => id || generateAccessibilityId('radio'), [id]);

  // Generate ARIA props
  const ariaProps = useMemo(() => {
    const computedLabel = accessibilityLabel ?? label;
    const computedChecked = accessibilityChecked ?? checked;

    return getWebSelectionAriaProps({
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

  // Apply variants using the correct Unistyles v3 pattern
  radioButtonStyles.useVariants({
    size,
    checked,
    disabled,
    margin,
    marginVertical,
    marginHorizontal,
  });

  const containerProps = getWebProps([radioButtonStyles.container, style]);
  const radioProps = getWebProps([radioButtonStyles.radio({ intent })]);
  const dotProps = getWebProps([radioButtonStyles.radioDot({ intent })]);
  const labelProps = getWebProps([radioButtonStyles.label]);

  return (
    <button
      {...containerProps}
      {...ariaProps}
      onClick={handleClick}
      disabled={disabled}
      id={radioId}
      data-testid={testID}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <div {...radioProps} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        backfaceVisibility: 'hidden',
      }}>
        {checked && <div {...dotProps} style={{
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          backfaceVisibility: 'hidden',
        }} />}
      </div>
      {label && (
        <span {...labelProps}>{label}</span>
      )}
    </button>
  );
};

export default RadioButton;