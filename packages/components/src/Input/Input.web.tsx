import React, { isValidElement, useState, useMemo, useRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { useUnistyles } from 'react-native-unistyles';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { isIconName } from '../Icon/icon-resolver';
import useMergeRefs from '../hooks/useMergeRefs';
import { inputStyles } from './Input.styles';
import { InputProps } from './types';
import { getWebFormAriaProps, generateAccessibilityId, combineIds } from '../utils/accessibility';

/**
 * Text input field with support for icons, password visibility toggle, and validation states.
 * Available in outlined and filled variants with multiple sizes.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(({
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
  accessibilityLabelledBy,
  accessibilityDescribedBy,
  accessibilityControls,
  accessibilityExpanded,
  accessibilityPressed,
  accessibilityOwns,
  accessibilityHasPopup,
  accessibilityRequired,
  accessibilityInvalid,
  accessibilityErrorMessage,
  accessibilityAutoComplete,
}, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Determine if we should show password toggle
  const isPasswordField = inputType === 'password' || secureTextEntry;
  const shouldShowPasswordToggle = isPasswordField && (showPasswordToggle !== false);

  // Get theme for icon sizes and colors
  const { theme } = useUnistyles();
  const iconSize = theme.sizes.input[size].iconSize;
  const iconColor = theme.colors.text.secondary;

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

  const handlePress = (e: React.MouseEvent<HTMLDivElement>) => {
    // For web compatibility, we can trigger onFocus when pressed
    e.preventDefault();
    e.stopPropagation();
    if (onPress) {
      onPress();
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
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

  // Apply variants (for size and spacing)
  inputStyles.useVariants({
    size,
    margin,
    marginVertical,
    marginHorizontal,
  });

  // Get web props for all styled elements (all styles are dynamic functions)
  const dynamicContainerStyle = (inputStyles.container as any)({ type, focused: isFocused, hasError, disabled });
  const {ref: containerStyleRef, ...containerProps} = getWebProps([dynamicContainerStyle, style]);
  const leftIconContainerProps = getWebProps([(inputStyles.leftIconContainer as any)({})]);
  const rightIconContainerProps = getWebProps([(inputStyles.rightIconContainer as any)({})]);
  const passwordToggleProps = getWebProps([(inputStyles.passwordToggle as any)({})]);

  // Get input props
  const inputWebProps = getWebProps([(inputStyles.input as any)({})]);

  // Generate accessibility props
  const ariaProps = useMemo(() => {
    // Derive invalid state from hasError or explicit accessibilityInvalid
    const isInvalid = accessibilityInvalid ?? hasError;

    return getWebFormAriaProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityDisabled: accessibilityDisabled ?? disabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'textbox',
      accessibilityLabelledBy,
      accessibilityDescribedBy,
      accessibilityControls,
      accessibilityExpanded,
      accessibilityPressed,
      accessibilityOwns,
      accessibilityHasPopup,
      accessibilityRequired,
      accessibilityInvalid: isInvalid,
      accessibilityErrorMessage,
      accessibilityAutoComplete,
    });
  }, [
    accessibilityLabel,
    accessibilityHint,
    accessibilityDisabled,
    disabled,
    accessibilityHidden,
    accessibilityRole,
    accessibilityLabelledBy,
    accessibilityDescribedBy,
    accessibilityControls,
    accessibilityExpanded,
    accessibilityPressed,
    accessibilityOwns,
    accessibilityHasPopup,
    accessibilityRequired,
    accessibilityInvalid,
    hasError,
    accessibilityErrorMessage,
    accessibilityAutoComplete,
  ]);

  // Merge the forwarded ref with unistyles ref for the input
  const mergedInputRef = useMergeRefs(ref, inputWebProps.ref);

  // Helper to render left icon
  const renderLeftIcon = () => {
    if (!leftIcon) return null;

    if (isIconName(leftIcon)) {
      return (
        <IconSvg
          name={leftIcon}
          size={iconSize}
          color={iconColor}
          aria-label={leftIcon}
        />
      );
    } else if (isValidElement(leftIcon)) {
      return <span {...leftIconContainerProps}>{leftIcon}</span>;
    }

    return null;
  };

  // Helper to render right icon (not password toggle)
  const renderRightIcon = () => {
    if (!rightIcon) return null;

    if (isIconName(rightIcon)) {
      return (
        <IconSvg
          name={rightIcon}
          size={iconSize}
          color={iconColor}
          aria-label={rightIcon}
        />
      );
    } else if (isValidElement(rightIcon)) {
      return <span {...rightIconContainerProps}>{rightIcon}</span>;
    }

    return null;
  };

  // Helper to render password toggle icon
  const renderPasswordToggleIcon = () => {
    const iconName = isPasswordVisible ? 'eye-off' : 'eye';
    return (
      <IconSvg
        name={iconName}
        size={iconSize}
        color={iconColor}
        aria-label={iconName}
      />
    );
  };

  const containerRef = useRef<HTMLDivElement>(null);

    const handleContainerPress = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    containerRef.current?.focus();
  }

  const mergedContainerRef = useMergeRefs(containerRef, containerStyleRef);

  return (
    <div onClick={handleContainerPress} ref={mergedContainerRef} {...containerProps} id={id} data-testid={testID}>
      {/* Left Icon */}
      {leftIcon && (
        <span {...leftIconContainerProps}>
          {renderLeftIcon()}
        </span>
      )}

      {/* Input */}
      <input
        {...inputWebProps}
        {...ariaProps}
        ref={mergedInputRef}
        type={getInputType()}
        value={value}
        onClick={handlePress}
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
