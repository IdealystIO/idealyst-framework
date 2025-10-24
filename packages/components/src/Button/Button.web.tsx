import React, { isValidElement, forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { ButtonProps } from './types';
import { buttonStyles } from './Button.styles';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import useMergeRefs from '../hooks/useMergeRefs';

// Extended props to include path props added by Babel plugin
interface InternalButtonProps extends ButtonProps {
  leftIconPath?: string;
  rightIconPath?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props: InternalButtonProps, ref) => {

  const {
    title,
    children,
    onPress,
    disabled = false,
    type = 'contained',
    intent = 'primary',
    size = 'md',
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
    size,
    intent,
    type,
    disabled,
  });


  // Create the style array following the official documentation pattern
  const buttonStyleArray = [
    buttonStyles.button,
    buttonStyles.text, // Include text styles for font sizing
    style, // Include incoming style prop
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
          {...iconProps}
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

  // Merge unistyles web ref with forwarded ref
  const mergedRef = useMergeRefs(ref, webProps.ref);

  return (
    <button
      {...webProps}
      ref={mergedRef}
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
});

Button.displayName = 'Button';

export default Button; 