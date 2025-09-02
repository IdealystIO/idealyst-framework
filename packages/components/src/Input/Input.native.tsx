import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { InputProps } from './types';
import { inputStyles } from './Input.styles';

const Input = React.forwardRef<TextInput, InputProps>(({
  value,
  onChangeText,
  onFocus,
  onBlur,
  placeholder,
  disabled = false,
  inputType = 'text',
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  size = 'medium',
  variant = 'default',
  hasError = false,
  style,
  testID,
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const getKeyboardType = () => {
    switch (inputType) {
      case 'email':
        return 'email-address';
      case 'number':
        return 'numeric';
      case 'password':
      case 'text':
      default:
        return 'default';
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) {
      onFocus();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  };

  // Apply variants to the stylesheet
  inputStyles.useVariants({
    size,
    variant,
    focused: isFocused,
  });

  const inputStyleArray = [
    inputStyles.input,
    disabled && inputStyles.disabled,
    hasError && inputStyles.error,
    style,
  ];

  return (
    <TextInput
      ref={ref}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      editable={!disabled}
      keyboardType={getKeyboardType()}
      secureTextEntry={secureTextEntry || inputType === 'password'}
      autoCapitalize={autoCapitalize}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={inputStyleArray}
      testID={testID}
      placeholderTextColor="#999999"
    />
  );
});

export default Input; 