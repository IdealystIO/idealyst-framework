import React from 'react';
import { View, TextInput, Text } from '@idealyst/components';
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

  // Initialize styles
  dateInputStyles.useVariants({
    size,
    variant,
    state: disabled ? 'disabled' : error ? 'error' : undefined,
  });

  return (
    <View style={style} testID={testID}>
      {label && (
        <Text style={dateInputStyles.label} testID={testID ? `${testID}-label` : undefined}>
          {label}
        </Text>
      )}
      
      <DateInputBase
        {...baseProps}
        disabled={disabled}
        testID={testID}
        renderInput={({
          value,
          onChangeText,
          onFocus,
          onBlur,
          placeholder,
          editable,
          style: inputStyleProp,
          testID: inputTestID,
        }) => (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            editable={editable}
            style={[inputStyleProp, inputStyle]}
            testID={inputTestID}
            autoComplete="off"
            autoCorrect={false}
            spellCheck={false}
            keyboardType="default"
          />
        )}
      />
      
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