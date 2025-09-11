import React from 'react';
import { View, Input, Text } from '@idealyst/components';
import { DateInputBase } from './DateInputBase';
import { DateInputProps } from './types';
import { dateInputStyles } from './DateInput.styles';

export const DateInput: React.FC<DateInputProps> = (props) => {
  const {
    label,
    error,
    helperText,
    size = 'medium',
    variant = 'outlined',
    disabled = false,
    style,
    inputStyle,
    testID,
    ...baseProps
  } = props;


  return (
    <View style={style} testID={testID}>
      {label && (
        <Text style={dateInputStyles.label} testID={testID ? `${testID}-label` : undefined}>
          {label}
        </Text>
      )}
      
      <DateInputBase {...baseProps} disabled={disabled} testID={testID}>
        {({ value, onChangeText, onFocus, onBlur, placeholder, disabled: inputDisabled, testID: inputTestID }) => (
          <Input
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={inputDisabled}
            size={size}
            variant={variant}
            hasError={error ? true : false}
            style={inputStyle}
            testID={inputTestID}
          />
        )}
      </DateInputBase>
      
      {error && (
        <Text style={dateInputStyles.errorText} testID={testID ? `${testID}-error` : undefined}>
          {error}
        </Text>
      )}
      
      {!error && helperText && (
        <Text style={dateInputStyles.helperText} testID={testID ? `${testID}-helper` : undefined}>
          {helperText}
        </Text>
      )}
    </View>
  );
};