import React, { useState, isValidElement } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { InputProps } from './types';
import { inputStyles } from './Input.styles';
import { IconSvg } from '../Icon/IconSvg.web';
import { resolveIconPath, isIconName } from '../Icon/icon-resolver';

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
  size = 'medium',
  variant = 'default',
  hasError = false,
  style,
  testID,
}, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Determine if we should show password toggle
  const isPasswordField = inputType === 'password' || secureTextEntry;
  const shouldShowPasswordToggle = isPasswordField && (showPasswordToggle !== false);

  // Determine if there are icons
  const hasLeftIcon = !!leftIcon;
  const hasRightIcon = !!rightIcon || shouldShowPasswordToggle;

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
    if (onFocus) {
      onFocus();
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Apply variants using the correct Unistyles 3.0 pattern
  inputStyles.useVariants({
    size: size as 'small' | 'medium' | 'large',
    variant: variant as 'default' | 'outlined' | 'filled' | 'bare',
    hasLeftIcon,
    hasRightIcon,
  });

  // Get web props for all styled elements
  const containerProps = getWebProps([inputStyles.container]);
  const leftIconContainerProps = getWebProps([inputStyles.leftIconContainer]);
  const rightIconContainerProps = getWebProps([inputStyles.rightIconContainer]);
  const leftIconProps = getWebProps([inputStyles.leftIcon]);
  const rightIconProps = getWebProps([inputStyles.rightIcon]);
  const passwordToggleProps = getWebProps([inputStyles.passwordToggle]);
  const passwordToggleIconProps = getWebProps([inputStyles.passwordToggleIcon]);

  // Create the style array for the input
  const inputStyleArray = [
    inputStyles.input,
    disabled && inputStyles.disabled,
    hasError && inputStyles.error,
    style,
  ].filter(Boolean);

  // Use getWebProps for input Unistyles, then manually add our ref
  const { ref: unistylesRef, ...webProps } = getWebProps(inputStyleArray);

  // Forward the ref while still providing unistyles with access
  const handleRef = (r: HTMLInputElement | null) => {
    unistylesRef.current = r;
    if (typeof ref === 'function') {
      ref(r);
    } else if (ref) {
      ref.current = r;
    }
  };

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
      return <span className={leftIconProps.className} style={leftIconProps.style}>{leftIcon}</span>;
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
      return <span className={rightIconProps.className} style={rightIconProps.style}>{rightIcon}</span>;
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
    <div className={containerProps.className} style={containerProps.style}>
      {/* Left Icon */}
      {leftIcon && (
        <span
          className={leftIconContainerProps.className}
          style={{
            ...leftIconContainerProps.style,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderLeftIcon()}
        </span>
      )}

      {/* Input */}
      <input
        {...webProps}
        ref={handleRef}
        type={getInputType()}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoCapitalize={autoCapitalize}
        data-testid={testID}
      />

      {/* Right Icon or Password Toggle */}
      {shouldShowPasswordToggle ? (
        <button
          className={passwordToggleProps.className}
          style={{
            ...passwordToggleProps.style,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={togglePasswordVisibility}
          disabled={disabled}
          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          type="button"
          tabIndex={-1}
        >
          {renderPasswordToggleIcon()}
        </button>
      ) : rightIcon ? (
        <span
          className={rightIconContainerProps.className}
          style={{
            ...rightIconContainerProps.style,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderRightIcon()}
        </span>
      ) : null}
    </div>
  );
});

export default Input; 