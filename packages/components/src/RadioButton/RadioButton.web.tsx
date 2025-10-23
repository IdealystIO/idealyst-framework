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
  style,
  testID,
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
    intent,
  });

  const containerProps = getWebProps([radioButtonStyles.container, style]);
  const radioProps = getWebProps([radioButtonStyles.radio({ intent })]);
  const dotProps = getWebProps([radioButtonStyles.radioDot({ intent })]);
  const labelProps = getWebProps([radioButtonStyles.label]);

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      data-testid={testID}
      role="radio"
      aria-checked={checked}
      aria-disabled={disabled}
      style={{
        ...containerProps.style,
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
        ...radioProps.style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        backfaceVisibility: 'hidden',
      }}>
        {checked && <div {...dotProps} style={{
          ...dotProps.style,
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