import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { UploadProgressProps, Intent } from '../types';
import { uploadProgressStyles } from './UploadProgress.styles';
import { formatBytes, formatDuration } from '../utils';

/**
 * UploadProgress - Shows upload progress with controls (Web).
 */
export const UploadProgress: React.FC<UploadProgressProps> = (props) => {
  const {
    upload,
    showFileName = true,
    showFileSize = true,
    showSpeed = false,
    showETA = false,
    showCancel = true,
    showRetry = true,
    onCancel,
    onRetry,
    variant = 'linear',
    size = 'md',
    style,
    testID,
  } = props;

  // Determine intent based on state
  const getIntent = (): Intent => {
    switch (upload.state) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  const intent = getIntent();

  // Apply variants
  uploadProgressStyles.useVariants({
    size,
    intent,
  });

  // Render state icon
  const renderStateIcon = () => {
    switch (upload.state) {
      case 'completed':
        return <Text style={uploadProgressStyles.stateIcon({ intent: 'success' })}>✓</Text>;
      case 'failed':
        return <Text style={uploadProgressStyles.stateIcon({ intent: 'error' })}>✗</Text>;
      case 'cancelled':
        return <Text style={uploadProgressStyles.stateIcon({ intent: 'secondary' })}>⊘</Text>;
      case 'paused':
        return <Text style={uploadProgressStyles.stateIcon({ intent: 'secondary' })}>⏸</Text>;
      case 'pending':
        return <Text style={uploadProgressStyles.stateIcon({ intent: 'secondary' })}>⏳</Text>;
      default:
        return null;
    }
  };

  // Render progress bar
  const renderProgressBar = () => {
    if (upload.state !== 'uploading' && upload.state !== 'paused') {
      return null;
    }

    return (
      <View style={uploadProgressStyles.progressContainer({})}>
        <View
          style={[
            uploadProgressStyles.progressBar({ intent }),
            { width: `${upload.percentage}%` },
          ]}
        />
      </View>
    );
  };

  // Render details
  const renderDetails = () => {
    const details: string[] = [];

    if (showFileSize) {
      details.push(`${formatBytes(upload.bytesUploaded)} / ${formatBytes(upload.bytesTotal)}`);
    }

    if (showSpeed && upload.state === 'uploading' && upload.speed > 0) {
      details.push(`${formatBytes(upload.speed)}/s`);
    }

    if (showETA && upload.state === 'uploading' && upload.estimatedTimeRemaining > 0) {
      details.push(`${formatDuration(upload.estimatedTimeRemaining)} remaining`);
    }

    if (upload.currentChunk !== undefined && upload.totalChunks !== undefined) {
      details.push(`Chunk ${upload.currentChunk}/${upload.totalChunks}`);
    }

    if (details.length === 0) {
      return null;
    }

    return (
      <View style={uploadProgressStyles.detailsRow({})}>
        {details.map((detail, index) => (
          <Text key={index} style={uploadProgressStyles.detail({})}>
            {detail}
          </Text>
        ))}
      </View>
    );
  };

  // Render actions
  const renderActions = () => {
    const actions: React.ReactNode[] = [];

    if (showCancel && (upload.state === 'uploading' || upload.state === 'pending')) {
      actions.push(
        <Pressable
          key="cancel"
          onPress={onCancel}
          style={uploadProgressStyles.actionButton({})}
          accessibilityRole="button"
          accessibilityLabel="Cancel upload"
        >
          <Text style={uploadProgressStyles.actionIcon({})}>✗</Text>
        </Pressable>
      );
    }

    if (showRetry && upload.state === 'failed') {
      actions.push(
        <Pressable
          key="retry"
          onPress={onRetry}
          style={uploadProgressStyles.actionButton({})}
          accessibilityRole="button"
          accessibilityLabel="Retry upload"
        >
          <Text style={uploadProgressStyles.actionIcon({})}>↻</Text>
        </Pressable>
      );
    }

    if (actions.length === 0) {
      return null;
    }

    return (
      <View style={uploadProgressStyles.actions({})}>
        {actions}
      </View>
    );
  };

  // Render error message
  const renderError = () => {
    if (upload.state !== 'failed' || !upload.error) {
      return null;
    }

    return (
      <Text style={uploadProgressStyles.errorText({})}>
        {upload.error.message}
      </Text>
    );
  };

  return (
    <View style={[uploadProgressStyles.container({}), style]} testID={testID}>
      {/* File info row */}
      <View style={uploadProgressStyles.infoRow({})}>
        {showFileName && (
          <Text style={uploadProgressStyles.fileName({})} numberOfLines={1}>
            {upload.file.name}
          </Text>
        )}
        {renderStateIcon()}
        {renderActions()}
      </View>

      {/* Progress bar */}
      {renderProgressBar()}

      {/* Details row */}
      {renderDetails()}

      {/* Error message */}
      {renderError()}
    </View>
  );
};

UploadProgress.displayName = 'UploadProgress';
