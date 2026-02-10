import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { DropZoneProps, DropZoneState, PickedFile, RejectedFile } from '../types';
import { dropZoneStyles } from './DropZone.styles';
import { useFilePicker } from '../hooks';

/**
 * DropZone - A drag-and-drop area for file selection (Web).
 */
export const DropZone: React.FC<DropZoneProps> = (props) => {
  const {
    onDrop,
    onReject,
    config,
    children,
    disabled = false,
    style,
    activeStyle,
    rejectStyle,
    testID,
  } = props;

  const { validateFiles, pick, isPicking } = useFilePicker({ config });
  const dropRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);

  const [state, setState] = useState<DropZoneState>({
    isDragActive: false,
    isDragReject: false,
    isProcessing: false,
  });

  // Handle drag enter
  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    dragCounter.current++;

    if (e.dataTransfer?.items?.length) {
      setState(s => ({ ...s, isDragActive: true }));
    }
  }, [disabled]);

  // Handle drag over
  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounter.current--;

    if (dragCounter.current === 0) {
      setState(s => ({ ...s, isDragActive: false, isDragReject: false }));
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounter.current = 0;

    if (disabled) {
      setState(s => ({ ...s, isDragActive: false, isDragReject: false }));
      return;
    }

    setState(s => ({ ...s, isDragActive: false, isProcessing: true }));

    const files = Array.from(e.dataTransfer?.files || []);
    const { accepted, rejected } = validateFiles(files);

    if (rejected.length > 0) {
      onReject?.(rejected);
    }

    if (accepted.length > 0) {
      onDrop?.(accepted);
    }

    setState(s => ({ ...s, isProcessing: false }));
  }, [disabled, validateFiles, onDrop, onReject]);

  // Handle click to open file picker
  const handleClick = useCallback(async () => {
    if (disabled || isPicking) return;

    const result = await pick();
    if (!result.cancelled && result.files.length > 0) {
      onDrop?.(result.files);
    }
    if (result.rejected.length > 0) {
      onReject?.(result.rejected);
    }
  }, [disabled, isPicking, pick, onDrop, onReject]);

  // Set up drag event listeners
  useEffect(() => {
    const element = dropRef.current;
    if (!element) return;

    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);

    return () => {
      element.removeEventListener('dragenter', handleDragEnter);
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('drop', handleDrop);
    };
  }, [handleDragEnter, handleDragOver, handleDragLeave, handleDrop]);

  // Apply variants
  dropZoneStyles.useVariants({
    active: state.isDragActive,
    reject: state.isDragReject,
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
        <Text style={dropZoneStyles.icon({ active: state.isDragActive, reject: state.isDragReject })}>
          {state.isDragActive ? '📂' : '📁'}
        </Text>
        <Text style={dropZoneStyles.text({ active: state.isDragActive, reject: state.isDragReject })}>
          {state.isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </Text>
        <Text style={dropZoneStyles.hint({})}>
          or click to browse
        </Text>
      </View>
    );
  };

  return (
    <Pressable
      onPress={handleClick}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel="Drop zone for file upload"
      style={[
        dropZoneStyles.container({ active: state.isDragActive, reject: state.isDragReject, disabled }),
        style,
        state.isDragActive && activeStyle,
        state.isDragReject && rejectStyle,
      ]}
    >
      <View ref={dropRef as any}>
        {renderChildren()}
      </View>
    </Pressable>
  );
};

DropZone.displayName = 'DropZone';
