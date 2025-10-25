import React, { isValidElement, forwardRef, ComponentRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { alertStyles } from './Alert.styles';
import { isIconName } from '../Icon/icon-resolver';
import type { AlertProps } from './types';

// Default icon names for each intent
const defaultIcons = {
  primary: 'information',
  success: 'check-circle',
  error: 'alert-circle',
  warning: 'alert',
  info: 'information',
  neutral: 'circle',
};

const Alert = forwardRef<ComponentRef<typeof View>, AlertProps>(({
  title,
  message,
  children,
  intent = 'neutral',
  type = 'soft',
  icon,
  showIcon = true,
  dismissible = false,
  onDismiss,
  actions,
  style,
  testID,
}, ref) => {
  // Apply variants to stylesheet
  alertStyles.useVariants({
    type
  });

  const displayIcon = icon !== undefined ? icon : (showIcon ? defaultIcons[intent] : null);

  // Helper to render icon
  const renderIcon = () => {
    if (!displayIcon) return null;

    if (typeof displayIcon === 'string' && isIconName(displayIcon)) {
      return (
        <MaterialCommunityIcons
          name={displayIcon}
          size={20}
          style={alertStyles.iconContainer}
        />
      );
    } else if (isValidElement(displayIcon)) {
      return displayIcon;
    }
    return null;
  };

  return (
    <View
      ref={ref}
      style={[alertStyles.container, style]}
      testID={testID}
      accessibilityRole="alert"
    >
      {displayIcon && (
        <View style={alertStyles.iconContainer}>
          {renderIcon()}
        </View>
      )}

      <View style={alertStyles.content}>
        {title && (
          <Text style={alertStyles.title}>
            {title}
          </Text>
        )}

        {message && (
          <Text style={alertStyles.message}>
            {message}
          </Text>
        )}

        {children}

        {actions && (
          <View style={alertStyles.actions}>
            {actions}
          </View>
        )}
      </View>

      {dismissible && onDismiss && (
        <TouchableOpacity
          style={alertStyles.closeButton}
          onPress={onDismiss}
          accessibilityLabel="Dismiss alert"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="close"
            size={16}
            style={alertStyles.closeIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
});

Alert.displayName = 'Alert';

export default Alert;
