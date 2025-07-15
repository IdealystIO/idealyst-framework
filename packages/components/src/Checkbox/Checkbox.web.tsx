import React, { useState, useEffect } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { CheckboxProps } from './types';
import { checkboxStyles, checkboxLabelStyles, checkboxCheckmarkStyles, checkboxHelperStyles } from './Checkbox.styles';

const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  indeterminate = false,
  disabled = false,
  onCheckedChange,
  size = 'medium',
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
}) => {
  const [internalChecked, setInternalChecked] = useState(checked);
  
  useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const newChecked = event.target.checked;
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

  // Create style arrays
  const wrapperStyleArray = [checkboxStyles.wrapper, style];
  const containerStyleArray = [checkboxStyles.container];
  const checkboxStyleArray = [checkboxStyles.checkbox];
  const labelStyleArray = [checkboxLabelStyles.label];
  const helperTextStyleArray = [checkboxHelperStyles.helperText];
  const checkmarkStyleArray = [checkboxCheckmarkStyles.checkmark];

  // Generate web props
  const wrapperProps = getWebProps(wrapperStyleArray);
  const containerProps = getWebProps(containerStyleArray);
  const checkboxProps = getWebProps(checkboxStyleArray);
  const labelProps = getWebProps(labelStyleArray);
  const helperTextProps = getWebProps(helperTextStyleArray);
  const checkmarkProps = getWebProps(checkmarkStyleArray);

  const labelContent = children || label;
  const displayHelperText = error || helperText;

  return (
    <div {...wrapperProps}>
      <label {...containerProps}>
        <div style={{ position: 'relative' }}>
          <input
            type="checkbox"
            checked={internalChecked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            data-testid={testID}
            aria-label={accessibilityLabel}
            ref={(ref) => {
              if (ref) {
                ref.indeterminate = indeterminate;
              }
            }}
            style={{
              position: 'absolute',
              opacity: 0,
              width: '100%',
              height: '100%',
              margin: 0,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          />
          <div {...checkboxProps}>
            {(internalChecked || indeterminate) && (
              <div {...checkmarkProps}>
                {indeterminate ? '−' : '✓'}
              </div>
            )}
          </div>
        </div>
        {labelContent && (
          <span {...labelProps}>
            {labelContent}
          </span>
        )}
      </label>
      {displayHelperText && (
        <div {...helperTextProps}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};

export default Checkbox; 