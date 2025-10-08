import React, { useState, useRef, useEffect } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { textAreaStyles } from './TextArea.styles';
import type { TextAreaProps } from './types';

const TextArea: React.FC<TextAreaProps> = ({
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
  size = 'medium',
  style,
  textareaStyle,
  testID,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const hasError = Boolean(error);

  // Apply variants
  textAreaStyles.useVariants({
    size,
    intent,
    disabled,
    hasError,
    resize,
    isNearLimit: maxLength ? value.length >= maxLength * 0.9 : false,
    isAtLimit: maxLength ? value.length >= maxLength : false,
  });

  const containerProps = getWebProps([textAreaStyles.container, style]);
  const labelProps = getWebProps([textAreaStyles.label]);
  const textareaContainerProps = getWebProps([textAreaStyles.textareaContainer]);
  const textareaProps = getWebProps([textAreaStyles.textarea]);
  const footerProps = getWebProps([textAreaStyles.footer]);
  const helperTextProps = getWebProps([textAreaStyles.helperText]);
  const characterCountProps = getWebProps([textAreaStyles.characterCount]);

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
  const isNearLimit = maxLength ? value.length >= maxLength * 0.9 : false;
  const isAtLimit = maxLength ? value.length >= maxLength : false;

  const computedTextareaStyle = {
    ...textareaProps.style,
    ...textareaStyle,
    ...(minHeight && { minHeight: `${minHeight}px` }),
    ...(maxHeight && { maxHeight: `${maxHeight}px` }),
    ...(autoGrow && maxHeight && textareaRef.current && textareaRef.current.scrollHeight > maxHeight && { overflowY: 'auto' }),
  };

  return (
    <div {...containerProps} data-testid={testID}>
      {label && (
        <label {...labelProps}>{label}</label>
      )}

      <div {...textareaContainerProps}>
        <textarea
          ref={textareaRef}
          className={textareaProps.className}
          style={computedTextareaStyle}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={autoGrow ? undefined : rows}
          maxLength={maxLength}
          aria-invalid={hasError}
          aria-describedby={error ? `${testID}-error` : helperText ? `${testID}-helper` : undefined}
        />
      </div>

      {showFooter && (
        <div {...footerProps}>
          <div style={{ flex: 1 }}>
            {error && (
              <span {...helperTextProps} id={`${testID}-error`}>
                {error}
              </span>
            )}
            {!error && helperText && (
              <span {...helperTextProps} id={`${testID}-helper`}>
                {helperText}
              </span>
            )}
          </div>

          {showCharacterCount && maxLength && (
            <span
              className={characterCountProps.className}
              style={{
                ...characterCountProps.style,
                color: isAtLimit
                  ? characterCountProps.style?.color
                  : isNearLimit
                  ? characterCountProps.style?.color
                  : undefined,
              }}
            >
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TextArea;
