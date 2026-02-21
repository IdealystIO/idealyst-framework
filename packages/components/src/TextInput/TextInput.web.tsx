import React, { isValidElement, useState, useMemo, useRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { useUnistyles } from 'react-native-unistyles';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { isIconName } from '../Icon/icon-resolver';
import useMergeRefs from '../hooks/useMergeRefs';
import { textInputStyles } from './TextInput.styles';
import { TextInputProps } from './types';
import { getWebFormAriaProps, combineIds, generateAccessibilityId } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';
import { flattenStyle } from '../utils/flattenStyle';

/**
 * Single-line text input field with support for icons, password visibility toggle, and validation states.
 * Available in outlined and filled variants with multiple sizes.
 */
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
  error,
  helperText,
  label,
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
  onSubmitEditing,
  // returnKeyType is native-only, ignored on web
  returnKeyType: _returnKeyType,
}, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Determine if we should show password toggle
  const isPasswordField = inputMode === 'password' || secureTextEntry;
  const shouldShowPasswordToggle = isPasswordField && (showPasswordToggle !== false);

  // Derive hasError from error prop or hasError boolean
  const computedHasError = Boolean(error) || hasError;

  // Determine if we need a wrapper (when label, error, or helperText is present)
  const needsWrapper = Boolean(label) || Boolean(error) || Boolean(helperText);

  // Generate unique IDs for accessibility
  const inputId = useMemo(() => id || generateAccessibilityId('textinput'), [id]);
  const errorId = useMemo(() => `${inputId}-error`, [inputId]);
  const helperId = useMemo(() => `${inputId}-helper`, [inputId]);
  const labelId = useMemo(() => label ? `${inputId}-label` : undefined, [inputId, label]);

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

    switch (inputMode) {
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
    e.stopPropagation();
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmitEditing) {
      onSubmitEditing();
    }
  };

  // Apply variants (for size, type, and spacing)
  textInputStyles.useVariants({
    size,
    type,
    focused: isFocused,
    hasError: computedHasError,
    disabled,
    margin,
    marginVertical,
    marginHorizontal,
  });

  // Get web props for all styled elements (all styles are dynamic functions)
  const dynamicContainerStyle = (textInputStyles.container as any)({ type, focused: isFocused, hasError: computedHasError, disabled });
  const {ref: containerStyleRef, ...containerProps} = getWebProps([dynamicContainerStyle, !needsWrapper && flattenStyle(style)].filter(Boolean));
  const leftIconContainerProps = getWebProps([(textInputStyles.leftIconContainer as any)({})]);
  const rightIconContainerProps = getWebProps([(textInputStyles.rightIconContainer as any)({})]);
  const passwordToggleProps = getWebProps([(textInputStyles.passwordToggle as any)({})]);

  // Wrapper, label, and footer styles
  const wrapperStyleComputed = (textInputStyles.wrapper as any)({});
  const labelStyleComputed = (textInputStyles.label as any)({ disabled });
  const footerStyleComputed = (textInputStyles.footer as any)({});
  const helperTextStyleComputed = (textInputStyles.helperText as any)({ hasError: computedHasError });

  const wrapperProps = getWebProps([wrapperStyleComputed, flattenStyle(style)]);
  const labelProps = getWebProps([labelStyleComputed]);
  const footerProps = getWebProps([footerStyleComputed]);
  const helperTextProps = getWebProps([helperTextStyleComputed]);

  // Get input props
  const inputWebProps = getWebProps([(textInputStyles.input as any)({})]);

  // Generate accessibility props
  const ariaProps = useMemo(() => {
    // Derive invalid state from computedHasError or explicit accessibilityInvalid
    const isInvalid = accessibilityInvalid ?? computedHasError;
    const describedByIds = combineIds(
      accessibilityDescribedBy,
      error ? errorId : helperText ? helperId : undefined
    );

    return getWebFormAriaProps({
      accessibilityLabel,
      accessibilityHint,
      accessibilityDisabled: accessibilityDisabled ?? disabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'textbox',
      accessibilityLabelledBy: accessibilityLabelledBy ?? labelId,
      accessibilityDescribedBy: describedByIds,
      accessibilityControls,
      accessibilityExpanded,
      accessibilityPressed,
      accessibilityOwns,
      accessibilityHasPopup,
      accessibilityRequired,
      accessibilityInvalid: isInvalid,
      accessibilityErrorMessage: accessibilityErrorMessage ?? (error ? errorId : undefined),
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
    labelId,
    accessibilityDescribedBy,
    error,
    errorId,
    helperText,
    helperId,
    accessibilityControls,
    accessibilityExpanded,
    accessibilityPressed,
    accessibilityOwns,
    accessibilityHasPopup,
    accessibilityRequired,
    accessibilityInvalid,
    computedHasError,
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
  };

  const mergedContainerRef = useMergeRefs(containerRef, containerStyleRef);

  const showFooter = Boolean(error) || Boolean(helperText);

  // If no wrapper needed, return flat input container
  if (!needsWrapper) {
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
          id={inputId}
          ref={mergedInputRef}
          type={getInputType()}
          value={value}
          onClick={handlePress}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
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
  }

  // With wrapper for label/error/helperText
  return (
    <div {...wrapperProps} id={id} data-testid={testID}>
      {label && (
        <label {...labelProps} id={labelId} htmlFor={inputId}>{label}</label>
      )}

      <div onClick={handleContainerPress} ref={mergedContainerRef} {...containerProps}>
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
          id={inputId}
          ref={mergedInputRef}
          type={getInputType()}
          value={value}
          onClick={handlePress}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
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

      {showFooter && (
        <div {...footerProps}>
          <div style={{ flex: 1 }}>
            {error && (
              <span {...helperTextProps} id={errorId} role="alert">
                {error}
              </span>
            )}
            {!error && helperText && (
              <span {...helperTextProps} id={helperId}>
                {helperText}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
