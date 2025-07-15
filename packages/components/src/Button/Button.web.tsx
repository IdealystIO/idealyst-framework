import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { ButtonProps } from './types';
import { buttonStyles } from './Button.styles';

const Button: React.FC<ButtonProps> = ({
  title,
  children,
  onPress,
  disabled = false,
  variant = 'contained',
  intent = 'primary',
  size = 'medium',
  style,
  testID,
}) => {
  const handleClick = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  // Apply variants using the correct Unistyles 3.0 pattern
  buttonStyles.useVariants({
    size: size as 'small' | 'medium' | 'large',
    intent: intent as 'primary' | 'success' | 'error' | 'warning' | 'neutral',
    variant: variant as 'contained' | 'outlined' | 'text',
    disabled: disabled as boolean,
  });

  // Create the style array following the official documentation pattern
  const buttonStyleArray = [
    buttonStyles.button,
    buttonStyles.text, // Include text styles for font sizing
    style,
  ];

  // Use getWebProps to generate className and ref for web
  const webProps = getWebProps(buttonStyleArray);

  // Use children if available, otherwise use title
  const buttonContent = children || title;

  return (
    <button
      {...webProps}
      onClick={handleClick}
      disabled={disabled}
      data-testid={testID}
    >
      {buttonContent}
    </button>
  );
};

export default Button; 