import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { alertStyles } from './Alert.styles';
import type { AlertProps } from './types';

// Default icons for each intent
const defaultIcons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
  neutral: '●',
};

const Alert: React.FC<AlertProps> = ({
  title,
  message,
  children,
  intent = 'neutral',
  variant = 'soft',
  icon,
  showIcon = true,
  dismissible = false,
  onDismiss,
  actions,
  style,
  testID,
}) => {
  const { styles } = alertStyles.useVariants({
    variant,
    intent,
  });

  const displayIcon = icon !== undefined ? icon : (showIcon ? defaultIcons[intent] : null);

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      accessibilityRole="alert"
    >
      {displayIcon && (
        <View style={styles.iconContainer}>
          {typeof displayIcon === 'string' ? (
            <Text style={{ fontSize: 20, lineHeight: 24 }}>{displayIcon}</Text>
          ) : (
            displayIcon
          )}
        </View>
      )}

      <View style={styles.content}>
        {title && (
          <Text style={styles.title}>
            {title}
          </Text>
        )}

        {message && (
          <Text style={styles.message}>
            {message}
          </Text>
        )}

        {children}

        {actions && (
          <View style={styles.actions}>
            {actions}
          </View>
        )}
      </View>

      {dismissible && onDismiss && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onDismiss}
          accessibilityLabel="Dismiss alert"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 16 }}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Alert;
