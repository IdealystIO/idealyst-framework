import React, { useState, useRef, useEffect, forwardRef, useMemo } from 'react';
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
    disabled,
    hasError,
    isNearLimit,
    isAtLimit,
    margin,
    marginVertical,
    marginHorizontal,
  });

  // Get static styles (cast to any for Unistyles variant compatibility)
  const containerProps = getWebProps([textAreaStyles.container as any, style as any]);
  const labelProps = getWebProps([textAreaStyles.label as any]);
  const textareaContainerProps = getWebProps([textAreaStyles.textareaContainer as any]);
  const footerProps = getWebProps([textAreaStyles.footer as any]);
  const helperTextProps = getWebProps([textAreaStyles.helperText as any]);
  const characterCountProps = getWebProps([textAreaStyles.characterCount as any]);

  const adjustHeight = () => {
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
  };

  useEffect(() => {
    adjustHeight();
  }, [value, autoGrow, minHeight, maxHeight]);

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

  const showFooter = (error || helperText) || (showCharacterCount && maxLength);

  const computedTextareaProps = getWebProps([
    textAreaStyles.textarea as any,
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
