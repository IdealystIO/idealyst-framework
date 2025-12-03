import React, { useState, isValidElement } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { InputProps } from './types';
import { inputStyles } from './Input.styles';

const Input = React.forwardRef<TextInput, InputProps>(({
  value,
  onChangeText,
  onFocus,
  onBlur,
  onPress,
  placeholder,
  disabled = false,
  inputType = 'text',
  secureTextEntry = false,
  leftIcon,
  rightIcon,
  showPasswordToggle,
  autoCapitalize = 'sentences',
  size = 'md',
  type = 'outlined',
  hasError = false,
  style,
  testID,
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Determine if we should show password toggle
  const isPasswordField = inputType === 'password' || secureTextEntry;
  const shouldShowPasswordToggle = isPasswordField && (showPasswordToggle !== false);

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

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  }

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Apply variants to the stylesheet
  inputStyles.useVariants({
    size,
    type,
    focused: isFocused,
    hasError,
    disabled,
  });

  // Helper to render left icon
  const renderLeftIcon = () => {
    if (!leftIcon) return null;

    if (typeof leftIcon === 'string') {
      const iconStyle = inputStyles.leftIcon;
      return (
        <MaterialCommunityIcons
          name={leftIcon}
          size={iconStyle.width}
          color={iconStyle.color}
        />
      );
    } else if (isValidElement(leftIcon)) {
      return leftIcon;
    }

    return null;
  };

  // Helper to render right icon (not password toggle)
  const renderRightIcon = () => {
    if (!rightIcon) return null;

    if (typeof rightIcon === 'string') {
      const iconStyle = inputStyles.rightIcon;
      return (
        <MaterialCommunityIcons
          name={rightIcon}
          size={iconStyle.width}
          color={iconStyle.color}
        />
      );
    } else if (isValidElement(rightIcon)) {
      return rightIcon;
    }

    return null;
  };

  return (
    <View style={[inputStyles.container({ type, hasError }), style]} testID={testID}>
      {/* Left Icon */}
      {leftIcon && (
        <View style={inputStyles.leftIconContainer}>
          {renderLeftIcon()}
        </View>
      )}

      {/* Input */}
      <TextInput
        onPress={handlePress}
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={!disabled}
        keyboardType={getKeyboardType()}
        secureTextEntry={(secureTextEntry || inputType === 'password') && !isPasswordVisible}
        autoCapitalize={autoCapitalize}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={inputStyles.input}
        placeholderTextColor="#999999"
      />

      {/* Right Icon or Password Toggle */}
      {shouldShowPasswordToggle ? (
        <TouchableOpacity
          style={inputStyles.passwordToggle}
          onPress={togglePasswordVisibility}
          disabled={disabled}
          accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
        >
          <MaterialCommunityIcons
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={inputStyles.passwordToggleIcon.width}
            color={inputStyles.passwordToggleIcon.color}
          />
        </TouchableOpacity>
      ) : rightIcon ? (
        <View style={inputStyles.rightIconContainer}>
          {renderRightIcon()}
        </View>
      ) : null}
    </View>
  );
});

export default Input; 