import React, { useState, isValidElement, useMemo, useEffect, useRef, useCallback } from 'react';
import { View, TextInput as RNTextInput, TouchableOpacity, Platform, TextInputProps as RNTextInputProps } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useUnistyles } from 'react-native-unistyles';
import { TextInputProps } from './types';
import { textInputStyles } from './TextInput.styles';
import { getNativeFormAccessibilityProps } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';

// Inner TextInput component that can be memoized to prevent re-renders
// for Android secure text entry
type InnerTextInputProps = {
  inputRef: React.ForwardedRef<RNTextInput>;
  value: string | undefined;
  onChangeText: ((text: string) => void) | undefined;
  isAndroidSecure: boolean;
  textInputProps: Omit<RNTextInputProps, 'value' | 'defaultValue' | 'onChangeText'>;
  inputStyle: any;
};

const InnerRNTextInput = React.memo<InnerTextInputProps>(
  ({ inputRef, value, onChangeText, isAndroidSecure, textInputProps, inputStyle }) => {
    return (
      <RNTextInput
        ref={inputRef as any}
        // For Android secure text entry, don't pass value prop at all
        // Let TextInput manage its own state to preserve character reveal animation
        {...(isAndroidSecure ? {} : { value })}
        onChangeText={onChangeText}
        style={inputStyle}
        {...textInputProps}
      />
    );
  },
  (prevProps, nextProps) => {
    // For Android secure text entry, skip re-renders when only value changes
    if (nextProps.isAndroidSecure) {
      // Only re-render if non-value props change
      const valueChanged = prevProps.value !== nextProps.value;
      const otherPropsChanged =
        prevProps.onChangeText !== nextProps.onChangeText ||
        prevProps.isAndroidSecure !== nextProps.isAndroidSecure ||
        prevProps.textInputProps !== nextProps.textInputProps ||
        prevProps.inputStyle !== nextProps.inputStyle;

      if (valueChanged && !otherPropsChanged) {
        return true; // Skip re-render
      }
    }
    return false; // Allow re-render
  }
);

const TextInput = React.forwardRef<IdealystElement, TextInputProps>(({
  value,
  onChangeText,
  onFocus,
  onBlur,
  onPress,
  placeholder,
  disabled = false,
  inputMode = 'text',
  secureTextEntry = false,
  leftIcon,
  rightIcon,
  showPasswordToggle,
  autoCapitalize = 'sentences',
  size = 'md',
  type = 'outlined',
  hasError = false,
  // Spacing variants from FormInputStyleProps
  margin,
  marginVertical,
  marginHorizontal,
  style,
  testID,
  id,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityDisabled,
  accessibilityHidden,
  accessibilityRole,
  accessibilityRequired,
  accessibilityInvalid,
  // Submit handling
  onSubmitEditing,
  returnKeyType = 'default',
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Track if this is a secure field that needs Android workaround
  const isSecureField = inputMode === 'password' || secureTextEntry;
  const needsAndroidSecureWorkaround = Platform.OS === 'android' && isSecureField && !isPasswordVisible;

  // For Android secure text entry, we use an internal ref to track value
  const internalValueRef = useRef(value ?? '');

  // Sync external value changes to internal ref (for programmatic updates)
  useEffect(() => {
    if (value !== undefined) {
      internalValueRef.current = value;
    }
  }, [value]);

  // Get theme for icon sizes and colors
  const { theme } = useUnistyles();
  const iconSize = theme.sizes.input[size].iconSize;
  const iconColor = theme.colors.text.secondary;

  // Determine if we should show password toggle
  const isPasswordField = inputMode === 'password' || secureTextEntry;
  const shouldShowPasswordToggle = isPasswordField && (showPasswordToggle !== false);

  const getKeyboardType = useCallback((): 'default' | 'email-address' | 'numeric' => {
    switch (inputMode) {
      case 'email':
        return 'email-address';
      case 'number':
        return 'numeric';
      case 'password':
      case 'text':
      default:
        return 'default';
    }
  }, [inputMode]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmitEditing = useCallback(() => {
    onSubmitEditing?.();
  }, [onSubmitEditing]);

  // Memoized change handler for InnerTextInput
  const handleChangeText = useCallback((text: string) => {
    internalValueRef.current = text;
    onChangeText?.(text);
  }, [onChangeText]);

  // Memoized input style
  const inputStyle = useMemo(() => (textInputStyles.input as any)({}), []);

  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    // Derive invalid state from hasError or explicit accessibilityInvalid
    const isInvalid = accessibilityInvalid ?? hasError;

    return getNativeFormAccessibilityProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityDisabled: accessibilityDisabled ?? disabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'textbox',
      accessibilityRequired,
      accessibilityInvalid: isInvalid,
    });
  }, [
    accessibilityLabel,
    accessibilityHint,
    accessibilityDisabled,
    disabled,
    accessibilityHidden,
    accessibilityRole,
    accessibilityRequired,
    accessibilityInvalid,
    hasError,
  ]);

  // Memoized TextInput props (everything except value/onChangeText)
  const textInputProps = useMemo(() => ({
    onPress: handlePress,
    placeholder,
    editable: !disabled,
    keyboardType: getKeyboardType(),
    secureTextEntry: isSecureField && !isPasswordVisible,
    autoCapitalize,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onSubmitEditing: handleSubmitEditing,
    returnKeyType,
    placeholderTextColor: '#999999',
    ...nativeA11yProps,
  }), [
    handlePress,
    placeholder,
    disabled,
    getKeyboardType,
    isSecureField,
    isPasswordVisible,
    autoCapitalize,
    handleFocus,
    handleBlur,
    handleSubmitEditing,
    returnKeyType,
    nativeA11yProps,
  ]);

  // Apply variants to the stylesheet (for size, type, and spacing)
  textInputStyles.useVariants({
    size,
    type,
    focused: isFocused,
    hasError,
    disabled,
    margin,
    marginVertical,
    marginHorizontal,
  });

  // Compute dynamic styles - call as functions for theme reactivity
  const containerStyle = (textInputStyles.container as any)({ type, focused: isFocused, hasError, disabled });
  const leftIconContainerStyle = (textInputStyles.leftIconContainer as any)({});
  const rightIconContainerStyle = (textInputStyles.rightIconContainer as any)({});
  const passwordToggleStyle = (textInputStyles.passwordToggle as any)({});

  // Helper to render left icon
  const renderLeftIcon = () => {
    if (!leftIcon) return null;

    if (typeof leftIcon === 'string') {
      return (
        <MaterialDesignIcons
          name={leftIcon}
          size={iconSize}
          color={iconColor}
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
      return (
        <MaterialDesignIcons
          name={rightIcon}
          size={iconSize}
          color={iconColor}
        />
      );
    } else if (isValidElement(rightIcon)) {
      return rightIcon;
    }

    return null;
  };

  return (
    <View style={[containerStyle, style]} testID={testID} nativeID={id}>
      {/* Left Icon */}
      {leftIcon && (
        <View style={leftIconContainerStyle}>
          {renderLeftIcon()}
        </View>
      )}

      {/* Input */}
      <InnerRNTextInput
        inputRef={ref}
        value={value}
        onChangeText={handleChangeText}
        isAndroidSecure={needsAndroidSecureWorkaround}
        inputStyle={inputStyle}
        textInputProps={textInputProps}
      />

      {/* Right Icon or Password Toggle */}
      {shouldShowPasswordToggle ? (
        <TouchableOpacity
          style={passwordToggleStyle}
          onPress={togglePasswordVisibility}
          disabled={disabled}
          accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
        >
          <MaterialDesignIcons
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={iconSize}
            color={iconColor}
          />
        </TouchableOpacity>
      ) : rightIcon ? (
        <View style={rightIconContainerStyle}>
          {renderRightIcon()}
        </View>
      ) : null}
    </View>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
