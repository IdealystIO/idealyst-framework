import React, { ComponentRef, forwardRef, isValidElement } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { buttonStyles } from './Button.styles';
import { ButtonProps } from './types';

const Button = forwardRef<ComponentRef<typeof TouchableOpacity>, ButtonProps>((props, ref) => {
  const {
    children,
    title,
    onPress,
    disabled = false,
    type = 'contained',
    intent = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    style,
    testID,
  } = props;

  // Compute dynamic styles
  const buttonStyle = buttonStyles.button;
  const textStyle = buttonStyles.text;
  const iconStyle = buttonStyles.icon;

  // Map button size to icon size
  const iconSizeMap = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  } as const;
  const iconSize = iconSizeMap[size];

  // Helper to render icon - uses the icon styles from buttonStyles
  const renderIcon = (icon: string | React.ReactNode) => {
    if (typeof icon === 'string') {
      // Render MaterialCommunityIcons with explicit size prop
      // The icon styles provide the correct color based on dynamic styles
      return (
        <MaterialCommunityIcons
          name={icon}
          size={iconSize}
          style={iconStyle}
        />
      );
    } else if (isValidElement(icon)) {
      // Render custom component as-is
      return icon;
    }
    return null;
  };

  // Use children if available, otherwise use title
  const buttonContent = children || title;

  // Determine if we need to wrap content in icon container
  const hasIcons = leftIcon || rightIcon;

  return (
    <TouchableOpacity
      ref={ref}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      activeOpacity={0.7}
      style={[buttonStyle, style]}
    >
      {hasIcons ? (
        <View style={buttonStyles.iconContainer}>
          {leftIcon && renderIcon(leftIcon)}
          <Text style={textStyle}>
            {buttonContent}
          </Text>
          {rightIcon && renderIcon(rightIcon)}
        </View>
      ) : (
        <Text style={textStyle}>
          {buttonContent}
        </Text>
      )}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

export default Button; 