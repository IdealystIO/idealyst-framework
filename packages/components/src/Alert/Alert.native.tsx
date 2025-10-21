import React, { isValidElement, forwardRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  alertContainerStyles,
  alertIconStyles,
  alertContentStyles,
  alertTitleStyles,
  alertMessageStyles,
  alertActionsStyles,
  alertCloseButtonStyles,
} from './Alert.styles';
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

const Alert = forwardRef<View, AlertProps>(({
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
}, ref) => {
  // Apply variants to each stylesheet
  alertContainerStyles.useVariants({ variant, intent });
  alertIconStyles.useVariants({ variant, intent });
  alertTitleStyles.useVariants({ variant, intent });
  alertMessageStyles.useVariants({ variant, intent });

  const displayIcon = icon !== undefined ? icon : (showIcon ? defaultIcons[intent] : null);

  // Helper to render icon
  const renderIcon = () => {
    if (!displayIcon) return null;

    if (typeof displayIcon === 'string' && isIconName(displayIcon)) {
      const iconColor = alertIconStyles.iconContainer.color || '#000';
      return (
        <MaterialCommunityIcons
          name={displayIcon}
          size={20}
          color={iconColor}
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
      style={[alertContainerStyles.container, style]}
      testID={testID}
      accessibilityRole="alert"
    >
      {displayIcon && (
        <View style={alertIconStyles.iconContainer}>
          {renderIcon()}
        </View>
      )}

      <View style={alertContentStyles.content}>
        {title && (
          <Text style={alertTitleStyles.title}>
            {title}
          </Text>
        )}

        {message && (
          <Text style={alertMessageStyles.message}>
            {message}
          </Text>
        )}

        {children}

        {actions && (
          <View style={alertActionsStyles.actions}>
            {actions}
          </View>
        )}
      </View>

      {dismissible && onDismiss && (
        <TouchableOpacity
          style={alertCloseButtonStyles.closeButton}
          onPress={onDismiss}
          accessibilityLabel="Dismiss alert"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="close"
            size={16}
            color={alertCloseButtonStyles.closeButton.color || '#000'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
});

Alert.displayName = 'Alert';

export default Alert;
