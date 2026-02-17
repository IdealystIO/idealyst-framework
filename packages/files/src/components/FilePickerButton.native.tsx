import React, { forwardRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import type { FilePickerButtonProps, FilePickerResult, FilePickerError } from '../types';
import { filePickerButtonStyles } from './FilePickerButton.styles';
import { useFilePicker } from '../hooks';

/**
 * FilePickerButton - A styled button that opens the file picker (Native).
 */
export const FilePickerButton = forwardRef<View, FilePickerButtonProps>((props, ref) => {
  const {
    children = 'Select File',
    pickerConfig,
    onPick,
    onError,
    disabled = false,
    loading = false,
    variant = 'solid',
    size = 'md',
    intent = 'primary',
    leftIcon = 'file-upload',
    style,
    testID,
  } = props;

  const { pick, isPicking } = useFilePicker({ config: pickerConfig });

  const isDisabled = disabled || loading || isPicking;
  const isLoading = loading || isPicking;

  const handlePress = useCallback(async () => {
    if (isDisabled) return;

    try {
      const result: FilePickerResult = await pick();
      if (!result.cancelled) {
        onPick?.(result);
      }
    } catch (err) {
      onError?.(err as FilePickerError);
    }
  }, [isDisabled, pick, onPick, onError]);

  // Apply variants
  filePickerButtonStyles.useVariants({
    size,
    intent,
    variant,
    disabled: isDisabled,
  });

  return (
    <TouchableOpacity
      ref={ref}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[filePickerButtonStyles.button({ intent, variant }), style]}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      accessibilityLabel={typeof children === 'string' ? children : 'Select file'}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={filePickerButtonStyles.spinner({ intent, variant }).color as string}
        />
      ) : leftIcon ? (
        <Text style={filePickerButtonStyles.icon({ intent, variant })}>
          {/* Icon placeholder - in a real implementation, use MDI icon */}
          📁
        </Text>
      ) : null}
      <Text style={filePickerButtonStyles.text({ intent, variant })}>
        {children}
      </Text>
    </TouchableOpacity>
  );
});

FilePickerButton.displayName = 'FilePickerButton';
