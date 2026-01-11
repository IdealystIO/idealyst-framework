import React, { isValidElement, forwardRef, ComponentRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { alertStyles } from './Alert.styles';
import { isIconName } from '../Icon/icon-resolver';
import type { AlertProps } from './types';

// Default icon names for each intent
const defaultIcons: Record<string, string> = {
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
  id,
}, ref) => {
  // Call all styles as functions to get theme-reactive styles
  const dynamicProps = { intent, type };
  const containerStyle = (alertStyles.container as any)(dynamicProps);
  const iconContainerStyle = (alertStyles.iconContainer as any)(dynamicProps);
  const titleStyle = (alertStyles.title as any)(dynamicProps);
  const messageStyle = (alertStyles.message as any)(dynamicProps);
  const contentStyle = (alertStyles.content as any)({});
  const actionsStyle = (alertStyles.actions as any)({});
  const closeButtonStyle = (alertStyles.closeButton as any)({});
  const closeIconStyle = (alertStyles.closeIcon as any)(dynamicProps);

  const displayIcon = icon !== undefined ? icon : (showIcon ? defaultIcons[intent] : null);

  // Helper to render icon
  const renderIcon = () => {
    if (!displayIcon) return null;

    if (typeof displayIcon === 'string' && isIconName(displayIcon)) {
      return (
        <MaterialDesignIcons
          name={displayIcon}
          size={20}
          style={iconContainerStyle}
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
      nativeID={id}
      style={[containerStyle, style]}
      testID={testID}
      accessibilityRole="alert"
    >
      {displayIcon && (
        <View style={iconContainerStyle}>
          {renderIcon()}
        </View>
      )}

      <View style={contentStyle}>
        {title && (
          <Text style={titleStyle}>
            {title}
          </Text>
        )}

        {message && (
          <Text style={messageStyle}>
            {message}
          </Text>
        )}

        {children && (
          typeof children === 'string' ? (
            <Text style={messageStyle}>{children}</Text>
          ) : (
            children
          )
        )}

        {actions && (
          <View style={actionsStyle}>
            {actions}
          </View>
        )}
      </View>

      {dismissible && onDismiss && (
        <TouchableOpacity
          style={closeButtonStyle}
          onPress={onDismiss}
          accessibilityLabel="Dismiss alert"
          accessibilityRole="button"
        >
          <MaterialDesignIcons
            name="close"
            size={16}
            style={closeIconStyle}
          />
        </TouchableOpacity>
      )}
    </View>
  );
});

Alert.displayName = 'Alert';

export default Alert;
