import React, { useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { radioButtonStyles } from './RadioButton.styles';
import type { RadioGroupProps } from './types';
import { getWebAriaProps, generateAccessibilityId } from '../utils/accessibility';

const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}>({});

export const useRadioGroup = () => React.useContext(RadioGroupContext);

const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onValueChange,
  disabled = false,
  orientation = 'vertical',
  children,
  error,
  helperText,
  label,
  style,
  testID,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityDisabled,
  accessibilityHidden,
  accessibilityRole,
}) => {
  // Generate unique ID for accessibility
  const groupId = useMemo(() => id || generateAccessibilityId('radiogroup'), [id]);
  const hasError = Boolean(error);
  const showFooter = Boolean(error || helperText);

  // Generate ARIA props
  const ariaProps = useMemo(() => {
    return getWebAriaProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityDisabled: accessibilityDisabled ?? disabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'radiogroup',
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityDisabled, disabled, accessibilityHidden, accessibilityRole]);

  // Apply variants
  radioButtonStyles.useVariants({
    orientation,
    disabled,
    hasError,
  });

  const groupProps = getWebProps([
    radioButtonStyles.groupContainer,
    style as any,
  ]);

  const wrapperProps = getWebProps([(radioButtonStyles.groupWrapper as any)({})]);
  const labelProps = getWebProps([(radioButtonStyles.groupLabel as any)({ disabled })]);
  const helperTextProps = getWebProps([(radioButtonStyles.groupHelperText as any)({ hasError })]);

  const content = (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
      <div
        {...groupProps}
        {...ariaProps}
        id={groupId}
        data-testid={testID}
        style={{
          display: 'flex',
        }}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );

  if (!label && !showFooter) {
    return content;
  }

  return (
    <div {...wrapperProps}>
      {label && <span {...labelProps}>{label}</span>}
      {content}
      {showFooter && (
        <div style={{ flex: 1 }}>
          {error && (
            <span {...helperTextProps} role="alert">
              {error}
            </span>
          )}
          {!error && helperText && (
            <span {...helperTextProps}>
              {helperText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default RadioGroup;