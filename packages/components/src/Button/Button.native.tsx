import React, { isValidElement, forwardRef } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ButtonProps } from './types';
import { buttonStyles } from './Button.styles';

const Button = forwardRef<TouchableOpacity, ButtonProps>((props, ref) => {
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

  // Apply button variants
  buttonStyles.useVariants({
    size,
    intent,
    type,
    disabled,
  });

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
      // The icon styles provide the correct color based on variants
      return (
        <MaterialCommunityIcons
          name={icon}
          size={iconSize}
          style={buttonStyles.icon({ intent })}
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
      style={[buttonStyles.button({ intent }), style]}
    >
      {hasIcons ? (
        <View style={buttonStyles.iconContainer}>
          {leftIcon && renderIcon(leftIcon)}
          <Text style={buttonStyles.text({ intent })}>
            {buttonContent}
          </Text>
          {rightIcon && renderIcon(rightIcon)}
        </View>
      ) : (
        <Text style={buttonStyles.text({ intent })}>
          {buttonContent}
        </Text>
      )}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

export default Button; 