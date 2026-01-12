import { useState, forwardRef, useMemo } from 'react';
import { View, TextInput, NativeSyntheticEvent, TextInputContentSizeChangeEventData } from 'react-native';
import { textAreaStyles } from './TextArea.styles';
import Text from '../Text';
import type { TextAreaProps } from './types';
import { getNativeFormAccessibilityProps } from '../utils/accessibility';

const TextArea = forwardRef<TextInput, TextAreaProps>(({
  value: controlledValue,
  defaultValue = '',
  onChange,
  placeholder,
  disabled = false,
  minHeight,
  maxHeight,
  autoGrow = false,
  maxLength,
  rows = 4,
  label,
  error,
  helperText,
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
  accessibilityRequired,
  accessibilityInvalid,
  accessibilityErrorMessage,
}, ref) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const hasError = Boolean(error);

  // Generate native accessibility props
  const nativeA11yProps = useMemo(() => {
    const computedLabel = accessibilityLabel ?? label ?? placeholder;
    const isInvalid = accessibilityInvalid ?? hasError;

    return getNativeFormAccessibilityProps({
      accessibilityLabel: computedLabel,
      accessibilityHint: accessibilityHint ?? (error || helperText),
      accessibilityDisabled: accessibilityDisabled ?? disabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'textbox',
      accessibilityLabelledBy,
      accessibilityDescribedBy,
      accessibilityRequired,
      accessibilityInvalid: isInvalid,
      accessibilityErrorMessage: accessibilityErrorMessage ?? error,
    });
  }, [
    accessibilityLabel,
    label,
    placeholder,
    accessibilityHint,
    error,
    helperText,
    accessibilityDisabled,
    disabled,
    accessibilityHidden,
    accessibilityRole,
    accessibilityLabelledBy,
    accessibilityDescribedBy,
    accessibilityRequired,
    accessibilityInvalid,
    hasError,
    accessibilityErrorMessage,
  ]);

  // Apply variants
  textAreaStyles.useVariants({
    size,
    intent,
    disabled,
    hasError,
    resize: 'none',
    isNearLimit: maxLength ? value.length >= maxLength * 0.9 : false,
    isAtLimit: maxLength ? value.length >= maxLength : false,
    margin,
    marginVertical,
    marginHorizontal,
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

  // Get dynamic styles - call as functions for theme reactivity
  const containerStyleComputed = (textAreaStyles.container as any)({});
  const labelStyleComputed = (textAreaStyles.label as any)({ disabled });
  const textareaContainerStyleComputed = (textAreaStyles.textareaContainer as any)({});
  const textareaStyleComputed = (textAreaStyles.textarea as any)({ intent, disabled, hasError });
  const footerStyleComputed = (textAreaStyles.footer as any)({});
  const helperTextStyleComputed = (textAreaStyles.helperText as any)({ hasError });
  const characterCountStyleComputed = (textAreaStyles.characterCount as any)({
    isNearLimit: maxLength ? value.length >= maxLength * 0.9 : false,
    isAtLimit: maxLength ? value.length >= maxLength : false,
  });

  return (
    <View nativeID={id} style={[containerStyleComputed, style]} testID={testID}>
      {label && (
        <Text style={labelStyleComputed}>{label}</Text>
      )}

      <View style={textareaContainerStyleComputed}>
        <TextInput
          ref={ref}
          {...nativeA11yProps}
          style={[
            textareaStyleComputed,
            {
              textAlignVertical: 'top',
              backgroundColor: 'transparent',
            },
            maxHeight && { maxHeight },
            { height: autoGrow ? contentHeight : rows * 24 },
            textareaStyle,
          ]}
          value={value}
          onChangeText={handleChange}
          onContentSizeChange={handleContentSizeChange}
          placeholder={placeholder}
          editable={!disabled}
          multiline
          numberOfLines={0}
          maxLength={maxLength}
          placeholderTextColor="#999"
        />
      </View>

      {showFooter && (
        <View style={footerStyleComputed}>
          <View style={{ flex: 1 }}>
            {error && (
              <Text style={helperTextStyleComputed}>
                {error}
              </Text>
            )}
            {!error && helperText && (
              <Text style={helperTextStyleComputed}>
                {helperText}
              </Text>
            )}
          </View>

          {showCharacterCount && maxLength && (
            <Text style={characterCountStyleComputed}>
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
