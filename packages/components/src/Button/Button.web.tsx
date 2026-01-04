import React, { isValidElement, forwardRef } from 'react';
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
    gradient,
    leftIcon,
    rightIcon,
    leftIconPath,
    rightIconPath,
    style,
    testID,
    id,
  } = props;

  buttonStyles.useVariants({
    type,
    intent,
    size,
    disabled,
    gradient,
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && onPress) {
      onPress();
    }
  };

  // Compute dynamic styles
  const buttonStyleArray = [
    buttonStyles.button,
    buttonStyles.text,
    style as any,
  ];

  // Use getWebProps to generate className and ref for web
  const webProps = getWebProps(buttonStyleArray);

  // Icon container styles
  const iconContainerProps = getWebProps([buttonStyles.iconContainer]);

  // Icon styles with dynamic function
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
      id={id}
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