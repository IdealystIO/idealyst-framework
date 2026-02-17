import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { DropZoneProps, DropZoneState } from '../types';
import { dropZoneStyles } from './DropZone.styles';
import { useFilePicker } from '../hooks';

/**
 * DropZone - A touch area for file selection (Native).
 *
 * Note: Drag and drop is not supported on native. This component acts as a
 * styled button that opens the file picker when pressed.
 */
export const DropZone: React.FC<DropZoneProps> = (props) => {
  const {
    onDrop,
    onReject,
    config,
    children,
    disabled = false,
    style,
    testID,
  } = props;

  const { pick, isPicking } = useFilePicker({ config });

  const state: DropZoneState = {
    isDragActive: false,
    isDragReject: false,
    isProcessing: isPicking,
  };

  // Handle press to open file picker
  const handlePress = useCallback(async () => {
    if (disabled || isPicking) return;

    const result = await pick();
    if (!result.cancelled && result.files.length > 0) {
      onDrop?.(result.files);
    }
    if (result.rejected.length > 0) {
      onReject?.(result.rejected);
    }
  }, [disabled, isPicking, pick, onDrop, onReject]);

  // Apply variants
  dropZoneStyles.useVariants({
    active: false,
    reject: false,
    disabled,
  });

  // Render children
  const renderChildren = () => {
    if (typeof children === 'function') {
      return children(state);
    }

    if (children) {
      return children;
    }

    // Default content
    return (
      <View style={dropZoneStyles.content({})}>
        <Text style={dropZoneStyles.icon({})}>
          📁
        </Text>
        <Text style={dropZoneStyles.text({})}>
          Tap to select files
        </Text>
        <Text style={dropZoneStyles.hint({})}>
          or use the camera
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || isPicking}
      activeOpacity={0.75}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel="Touch to select files"
      style={[
        dropZoneStyles.container({ disabled }),
        style,
      ]}
    >
      {renderChildren()}
    </TouchableOpacity>
  );
};

DropZone.displayName = 'DropZone';
