import React, { isValidElement } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { ButtonProps } from './types';
import { buttonStyles } from './Button.styles';
import { IconSvg } from '../Icon/IconSvg.web';

// Extended props to include path props added by Babel plugin
interface InternalButtonProps extends ButtonProps {
  leftIconPath?: string;
  rightIconPath?: string;
}

const Button: React.FC<ButtonProps> = (props: InternalButtonProps) => {
  const {
    title,
    children,
    onPress,
    disabled = false,
    variant = 'contained',
    intent = 'primary',
    size = 'medium',
    leftIcon,
    rightIcon,
    leftIconPath,
    rightIconPath,
    style,
    testID,
  } = props;
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

  // Icon container styles
  const iconContainerProps = getWebProps([buttonStyles.iconContainer]);

  // Icon styles with variants
  const iconStyleArray = [buttonStyles.icon];
  const iconProps = getWebProps(iconStyleArray);

  // Helper to render icon
  const renderIcon = (icon: string | React.ReactNode, iconPath?: string) => {
    if (typeof icon === 'string' && iconPath) {
      // Render IconSvg directly with the path from Babel plugin
      // Don't pass size - let the style control the dimensions
      return (
        <IconSvg
          path={iconPath}
          style={iconProps.style}
          aria-label={icon}
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
    <button
      {...webProps}
      onClick={handleClick}
      disabled={disabled}
      data-testid={testID}
    >
      {hasIcons ? (
        <div {...iconContainerProps}>
          {leftIcon && renderIcon(leftIcon, leftIconPath)}
          {buttonContent}
          {rightIcon && renderIcon(rightIcon, rightIconPath)}
        </div>
      ) : (
        buttonContent
      )}
    </button>
  );
};

export default Button; 