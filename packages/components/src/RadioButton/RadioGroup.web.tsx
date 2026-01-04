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
  id,
}) => {
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
        role="radiogroup"
        id={id}
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