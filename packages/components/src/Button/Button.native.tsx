import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { ButtonProps } from './types';
import { buttonStyles } from './Button.styles';

const Button: React.FC<ButtonProps> = ({
  children,
  title,
  onPress,
  disabled = false,
  variant = 'contained',
  intent = 'primary',
  size = 'medium',
  style,
  testID,
}) => {
  buttonStyles.useVariants({
    size,
    intent,
    variant,
    disabled,
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      activeOpacity={0.7}
      style={[buttonStyles.button, style]}
    >
      <Text style={buttonStyles.text}>
        {children || title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button; 