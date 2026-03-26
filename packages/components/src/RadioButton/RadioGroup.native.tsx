import React, { forwardRef, useMemo } from 'react';
import { View, Text } from 'react-native';
import { radioButtonStyles } from './RadioButton.styles';
import type { RadioGroupProps } from './types';
import { getNativeAccessibilityProps } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';

const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}>({});

export const useRadioGroup = () => React.useContext(RadioGroupContext);

const RadioGroup = forwardRef<IdealystElement, RadioGroupProps>(({
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
}, ref) => {
  const hasError = Boolean(error);
  const showFooter = Boolean(error || helperText);

  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    return getNativeAccessibilityProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityDisabled: accessibilityDisabled ?? disabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'radiogroup',
    });
  }, [accessibilityLabel, accessibilityHint, accessibilityDisabled, disabled, accessibilityHidden, accessibilityRole]);

  // Apply variants for group styles
  radioButtonStyles.useVariants({
    orientation,
    disabled,
    hasError,
  });

  const content = (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
      <View
        nativeID={id}
        style={[
          radioButtonStyles.groupContainer,
          style as any,
        ]}
        testID={testID}
        {...nativeA11yProps}
      >
        {children}
      </View>
    </RadioGroupContext.Provider>
  );

  if (!label && !showFooter) {
    return content;
  }

  return (
    <View ref={ref as any} style={radioButtonStyles.groupWrapper}>
      {label && <Text style={radioButtonStyles.groupLabel}>{label}</Text>}
      {content}
      {showFooter && (
        <View style={{ flex: 1 }}>
          {error && <Text style={radioButtonStyles.groupHelperText}>{error}</Text>}
          {!error && helperText && <Text style={radioButtonStyles.groupHelperText}>{helperText}</Text>}
        </View>
      )}
    </View>
  );
});

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;