import React, { useState, isValidElement, useRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { InputProps } from './types';
import { inputStyles } from './Input.styles';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { resolveIconPath, isIconName } from '../Icon/icon-resolver';
import useMergeRefs from '../hooks/useMergeRefs';

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  value,
  onChangeText,
  onFocus,
  onBlur,
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Determine if we should show password toggle
  const isPasswordField = inputType === 'password' || secureTextEntry;
  const shouldShowPasswordToggle = isPasswordField && (showPasswordToggle !== false);

  const [isFocused, setIsFocused] = useState(false);

  const getInputType = () => {
    // Handle password visibility
    if (isPasswordField && !isPasswordVisible) {
      return 'password';
    }

    switch (inputType) {
      case 'email':
        return 'email';
      case 'number':
        return 'number';
      case 'password':
        return 'text'; // When visible
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

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Apply variants for container
  inputStyles.useVariants({
    size,
    type,
    focused: isFocused,
    hasError,
    disabled,
  });

  // Get web props for all styled elements
  const containerProps = getWebProps([inputStyles.container, style]);
  const leftIconContainerProps = getWebProps([inputStyles.leftIconContainer]);
  const rightIconContainerProps = getWebProps([inputStyles.rightIconContainer]);
  const leftIconProps = getWebProps([inputStyles.leftIcon]);
  const rightIconProps = getWebProps([inputStyles.rightIcon]);
  const passwordToggleProps = getWebProps([inputStyles.passwordToggle]);
  const passwordToggleIconProps = getWebProps([inputStyles.passwordToggleIcon]);

  // Get input props
  const inputWebProps = getWebProps([inputStyles.input]);

  // Merge the forwarded ref with unistyles ref for the input
  const mergedInputRef = useMergeRefs(ref, inputWebProps.ref);

  // Helper to render left icon
  const renderLeftIcon = () => {
    if (!leftIcon) return null;

    if (isIconName(leftIcon)) {
      const iconPath = resolveIconPath(leftIcon);
      return (
        <IconSvg
          path={iconPath}
          {...leftIconProps}
          aria-label={leftIcon}
        />
      );
    } else if (isValidElement(leftIcon)) {
      return <span {...leftIconProps}>{leftIcon}</span>;
    }

    return null;
  };

  // Helper to render right icon (not password toggle)
  const renderRightIcon = () => {
    if (!rightIcon) return null;

    if (isIconName(rightIcon)) {
      const iconPath = resolveIconPath(rightIcon);
      return (
        <IconSvg
          path={iconPath}
          {...rightIconProps}
          aria-label={rightIcon}
        />
      );
    } else if (isValidElement(rightIcon)) {
      return <span {...rightIconProps}>{rightIcon}</span>;
    }

    return null;
  };

  // Helper to render password toggle icon
  const renderPasswordToggleIcon = () => {
    const iconName = isPasswordVisible ? 'eye-off' : 'eye';
    const iconPath = resolveIconPath(iconName);
    return (
      <IconSvg
        path={iconPath}
        {...passwordToggleIconProps}
        aria-label={iconName}
      />
    );
  };

  return (
    <div {...containerProps} data-testid={testID}>
      {/* Left Icon */}
      {leftIcon && (
        <span {...leftIconContainerProps}>
          {renderLeftIcon()}
        </span>
      )}

      {/* Input */}
      <input
        {...inputWebProps}
        ref={mergedInputRef}
        type={getInputType()}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoCapitalize={autoCapitalize}
      />

      {/* Right Icon or Password Toggle */}
      {shouldShowPasswordToggle ? (
        <button
          {...passwordToggleProps}
          onClick={togglePasswordVisibility}
          disabled={disabled}
          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          type="button"
          tabIndex={-1}
        >
          {renderPasswordToggleIcon()}
        </button>
      ) : rightIcon ? (
        <span {...rightIconContainerProps}>
          {renderRightIcon()}
        </span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 