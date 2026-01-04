import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { radioButtonStyles } from './RadioButton.styles';
import type { RadioButtonProps } from './types';
import { useRadioGroup } from './RadioGroup.web';

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
      onClick={handleClick}
      disabled={disabled}
      id={id}
      data-testid={testID}
      role="radio"
      aria-checked={checked}
      aria-disabled={disabled}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
      }}
      {...containerProps}
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