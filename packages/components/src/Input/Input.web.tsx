import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { InputProps } from './types';
import { inputStyles } from './Input.styles';

const Input: React.FC<InputProps> = ({
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
}) => {
  const getInputType = () => {
    switch (inputType) {
      case 'email':
        return 'email';
      case 'number':
        return 'number';
      case 'password':
        return 'password';
      case 'text':
      default:
        return 'text';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeText) {
      onChangeText(e.target.value);
    }
  };

  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  // Apply variants using the correct Unistyles 3.0 pattern
  inputStyles.useVariants({
    size: size as 'small' | 'medium' | 'large',
    variant: variant as 'default' | 'outlined' | 'filled' | 'bare',
  });

  // Create the style array following the official documentation pattern
  const inputStyleArray = [
    inputStyles.input,
    disabled && inputStyles.disabled,
    hasError && inputStyles.error,
    style,
  ].filter(Boolean);

  // Use getWebProps to generate className and ref for web
  const webProps = getWebProps(inputStyleArray);

  return (
    <input
      {...webProps}
      type={secureTextEntry ? 'password' : getInputType()}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      autoCapitalize={autoCapitalize}
      data-testid={testID}
    />
  );
};

export default Input; 