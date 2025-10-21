import React, { forwardRef } from 'react';
import { View } from 'react-native';
import { radioButtonStyles } from './RadioButton.styles';
import type { RadioGroupProps } from './types';

const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}>({});

export const useRadioGroup = () => React.useContext(RadioGroupContext);

const RadioGroup = forwardRef<View, RadioGroupProps>(({
  value,
  onValueChange,
  disabled = false,
  orientation = 'vertical',
  children,
  style,
  testID,
}, ref) => {

  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
      <View
        ref={ref}
        style={[
          radioButtonStyles.groupContainer,
          orientation === 'horizontal' ? radioButtonStyles.groupHorizontal : radioButtonStyles.groupVertical,
          style,
        ]}
        accessibilityRole="radiogroup"
        testID={testID}
      >
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
});

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;