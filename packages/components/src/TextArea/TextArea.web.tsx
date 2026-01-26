import React, { useState, useRef, useEffect, forwardRef, useMemo, useCallback } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { textAreaStyles } from './TextArea.styles';
import type { TextAreaProps } from './types';
import useMergeRefs from '../hooks/useMergeRefs';
import { getWebFormAriaProps, combineIds, generateAccessibilityId } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';

/**
 * Multi-line text input with auto-grow, character counting, and validation support.
 * Includes label, helper text, and error message display.
 */
const TextArea = forwardRef<IdealystElement, TextAreaProps>(({
  value: controlledValue,
  defaultValue = '',
  onChange,
  onKeyDown,
  placeholder,
  disabled = false,
  rows = 4,
  minHeight,
  maxHeight,
  autoGrow = false,
  maxLength,
  label,
  error,
  helperText,
  resize = 'none',
  showCharacterCount = false,
  intent = 'primary',
  size = 'md',
  type = 'outlined',
  // Spacing variants from FormInputStyleProps
  margin,
  marginVertical,
  marginHorizontal,
  style,
  textareaStyle,
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
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const hasError = Boolean(error);

  // Generate unique IDs for accessibility
  const textareaId = useMemo(() => id || generateAccessibilityId('textarea'), [id]);
  const errorId = useMemo(() => `${textareaId}-error`, [textareaId]);
  const helperId = useMemo(() => `${textareaId}-helper`, [textareaId]);
  const labelId = useMemo(() => label ? `${textareaId}-label` : undefined, [textareaId, label]);

  // Generate ARIA props for the textarea element
  const ariaProps = useMemo(() => {
    const isInvalid = accessibilityInvalid ?? hasError;
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
    hasError,
    accessibilityErrorMessage,
    accessibilityAutoComplete,
  ]);

  const isNearLimit = maxLength ? value.length >= maxLength * 0.9 : false;
  const isAtLimit = maxLength ? value.length >= maxLength : false;

  // Apply variants
  textAreaStyles.useVariants({
    size,
    intent,
    type,
    focused: isFocused,
    disabled,
    hasError,
    autoGrow,
    isNearLimit,
    isAtLimit,
    margin,
    marginVertical,
    marginHorizontal,
  });

  // Get dynamic styles - call as functions for theme reactivity
  const containerStyleComputed = (textAreaStyles.container as any)({});
  const labelStyleComputed = (textAreaStyles.label as any)({ disabled });
  const textareaContainerStyleComputed = (textAreaStyles.textareaContainer as any)({ type, focused: isFocused, hasError, disabled });
  const textareaStyleComputed = (textAreaStyles.textarea as any)({ autoGrow, disabled });
  const footerStyleComputed = (textAreaStyles.footer as any)({});
  const helperTextStyleComputed = (textAreaStyles.helperText as any)({ hasError });
  const characterCountStyleComputed = (textAreaStyles.characterCount as any)({ isNearLimit, isAtLimit });

  // Convert to web props
  const containerProps = getWebProps([containerStyleComputed, style as any]);
  const labelProps = getWebProps([labelStyleComputed]);
  const textareaContainerProps = getWebProps([textareaContainerStyleComputed]);
  const footerProps = getWebProps([footerStyleComputed]);
  const helperTextProps = getWebProps([helperTextStyleComputed]);
  const characterCountProps = getWebProps([characterCountStyleComputed]);

  const adjustHeight = useCallback(() => {
    if (!autoGrow || !textareaRef.current) return;

    const textarea = textareaRef.current;

    // Reset height to allow shrinking
    textarea.style.height = '1px';

    let newHeight = textarea.scrollHeight;

    if (minHeight && newHeight < minHeight) {
      newHeight = minHeight;
    }

    if (maxHeight && newHeight > maxHeight) {
      newHeight = maxHeight;
    }

    textarea.style.height = `${newHeight}px`;
  }, [autoGrow, minHeight, maxHeight]);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    const newValue = e.target.value;

    if (maxLength && newValue.length > maxLength) {
      return;
    }

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (onKeyDown) {
      onKeyDown({
        key: e.key,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
        preventDefault: () => e.preventDefault(),
      });
    }
  };

  const showFooter = (error || helperText) || (showCharacterCount && maxLength);

  const computedTextareaProps = getWebProps([
    textareaStyleComputed,
    textareaStyle as any,
    { resize } as any, // Apply resize as inline style since it's CSS-only
    minHeight ? { minHeight: `${minHeight}px` } : null,
    maxHeight ? { maxHeight: `${maxHeight}px` } : null,
    autoGrow && maxHeight && textareaRef.current && textareaRef.current.scrollHeight > maxHeight ? { overflowY: 'auto' as const } : null,
  ].filter(Boolean));

  const mergedRef = useMergeRefs(ref, containerProps.ref);
  const mergedTextareaRef = useMergeRefs(textareaRef, computedTextareaProps.ref);

  return (
    <div {...containerProps} ref={mergedRef} id={id} data-testid={testID}>
      {label && (
        <label {...labelProps} id={labelId} htmlFor={textareaId}>{label}</label>
      )}

      <div {...textareaContainerProps}>
        <textarea
          {...computedTextareaProps}
          {...ariaProps}
          id={textareaId}
          ref={mergedTextareaRef}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={autoGrow ? undefined : rows}
          maxLength={maxLength}
        />
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

          {showCharacterCount && maxLength && (
            <span {...characterCountProps}>
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
