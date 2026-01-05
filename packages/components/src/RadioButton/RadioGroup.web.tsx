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
  });

  const groupProps = getWebProps([
    radioButtonStyles.groupContainer,
    style as any,
  ]);

  return (
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
};

export default RadioGroup;