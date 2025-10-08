import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { radioButtonStyles } from './RadioButton.styles';
import type { RadioGroupProps } from './types';

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
}) => {
  // Apply variants
  radioButtonStyles.useVariants({
    orientation,
  });

  const groupProps = getWebProps([
    radioButtonStyles.groupContainer,
    style,
  ]);

  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
      <div
        {...groupProps}
        role="radiogroup"
        data-testid={testID}
        style={{
          ...groupProps.style,
          display: 'flex',
        }}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

export default RadioGroup;