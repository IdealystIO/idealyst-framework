import React, { useState, forwardRef } from 'react';
import { View, TextInput, NativeSyntheticEvent, TextInputContentSizeChangeEventData } from 'react-native';
import { textAreaStyles } from './TextArea.styles';
import Text from '../Text';
import type { TextAreaProps } from './types';

const TextArea = forwardRef<TextInput, TextAreaProps>(({
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
  showCharacterCount = false,
  intent = 'primary',
  size = 'md',
  style,
  textareaStyle,
  testID,
}, ref) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const hasError = Boolean(error);

  // Apply variants
  textAreaStyles.useVariants({
    size,
    intent,
    disabled,
    hasError,
    resize: 'none',
    isNearLimit: maxLength ? value.length >= maxLength * 0.9 : false,
    isAtLimit: maxLength ? value.length >= maxLength : false,
  });

  const handleChange = (newValue: string) => {
    if (maxLength && newValue.length > maxLength) {
      return;
    }

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);
  };

  const handleContentSizeChange = (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    if (!autoGrow) return;

    let newHeight = e.nativeEvent.contentSize.height;

    // Apply min/max height constraints
    if (minHeight && newHeight < minHeight) {
      newHeight = minHeight;
    }

    if (maxHeight && newHeight > maxHeight) {
      newHeight = maxHeight;
    }

    setContentHeight(newHeight);
  };

  const showFooter = (error || helperText) || (showCharacterCount && maxLength);
  const isNearLimit = maxLength ? value.length >= maxLength * 0.9 : false;
  const isAtLimit = maxLength ? value.length >= maxLength : false;

  // Calculate approximate height based on rows and size
  const getTextInputHeight = () => {
    if (autoGrow && contentHeight !== undefined) {
      return contentHeight;
    }

    const lineHeights = {
      sm: 20,
      md: 24,
      lg: 28,
    };
    const paddings = {
      sm: 8,
      md: 12,
      lg: 16,
    };

    const lineHeight = lineHeights[size];
    const padding = paddings[size];

    const calculatedHeight = lineHeight * rows + padding * 2;

    // Apply minHeight if specified
    if (minHeight && calculatedHeight < minHeight) {
      return minHeight;
    }

    return calculatedHeight;
  };

  const inputHeight = getTextInputHeight();

  return (
    <View style={[textAreaStyles.container, style]} testID={testID}>
      {label && (
        <Text style={textAreaStyles.label}>{label}</Text>
      )}

      <View style={textAreaStyles.textareaContainer}>
        <TextInput
          ref={ref}
          style={[
            textAreaStyles.textarea({ intent, disabled, hasError }),
            {
              height: inputHeight,
              textAlignVertical: 'top',
            },
            maxHeight && { maxHeight },
            textareaStyle,
          ]}
          value={value}
          onChangeText={handleChange}
          onContentSizeChange={handleContentSizeChange}
          placeholder={placeholder}
          editable={!disabled}
          multiline
          numberOfLines={autoGrow ? undefined : rows}
          maxLength={maxLength}
          placeholderTextColor="#999"
        />
      </View>

      {showFooter && (
        <View style={textAreaStyles.footer}>
          <View style={{ flex: 1 }}>
            {error && (
              <Text style={textAreaStyles.helperText}>
                {error}
              </Text>
            )}
            {!error && helperText && (
              <Text style={textAreaStyles.helperText}>
                {helperText}
              </Text>
            )}
          </View>

          {showCharacterCount && maxLength && (
            <Text style={textAreaStyles.characterCount}>
              {value.length}/{maxLength}
            </Text>
          )}
        </View>
      )}
    </View>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
