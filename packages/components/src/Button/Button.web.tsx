import React, { isValidElement, forwardRef, useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { ButtonProps } from './types';
import { buttonStyles } from './Button.styles';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import useMergeRefs from '../hooks/useMergeRefs';
import { getWebInteractiveAriaProps, generateAccessibilityId } from '../utils/accessibility';

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
    // Accessibility props
    accessibilityLabel,
    accessibilityHint,
    accessibilityDisabled,
    accessibilityHidden,
    accessibilityRole,
    accessibilityLabelledBy,
    accessibilityDescribedBy,
    accessibilityControls,
    accessibilityExpanded,
    accessibilityPressed,
    accessibilityOwns,
    accessibilityHasPopup,
  } = props;

  // Apply variants for size, disabled, gradient
  buttonStyles.useVariants({
    size,
    disabled,
    gradient,
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Only stop propagation if we have an onPress handler
    // Otherwise, let clicks bubble up to parent handlers (e.g., Menu triggers)
    if (!disabled && onPress) {
      e.stopPropagation();
      onPress();
    }
  };

  // Generate unique ID for accessibility
  const buttonId = useMemo(() => id || generateAccessibilityId('button'), [id]);

  // Generate ARIA props - especially important for icon-only buttons
  const ariaProps = useMemo(() => {
    // For icon-only buttons, accessibilityLabel is critical
    const buttonContent = children || title;
    const isIconOnly = !buttonContent && (leftIcon || rightIcon);
    const computedLabel = accessibilityLabel ?? (isIconOnly && typeof leftIcon === 'string' ? leftIcon : undefined);

    return getWebInteractiveAriaProps({
      accessibilityLabel: computedLabel,
      accessibilityHint,
      accessibilityDisabled: accessibilityDisabled ?? disabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'button',
      accessibilityLabelledBy,
      accessibilityDescribedBy,
      accessibilityControls,
      accessibilityExpanded,
      accessibilityPressed,
      accessibilityOwns,
      accessibilityHasPopup,
    });
  }, [
    accessibilityLabel,
    children,
    title,
    leftIcon,
    rightIcon,
    accessibilityHint,
    accessibilityDisabled,
    disabled,
    accessibilityHidden,
    accessibilityRole,
    accessibilityLabelledBy,
    accessibilityDescribedBy,
    accessibilityControls,
    accessibilityExpanded,
    accessibilityPressed,
    accessibilityOwns,
    accessibilityHasPopup,
  ]);

  // Compute dynamic styles with all props for full flexibility
  const dynamicProps = { intent, type, size, disabled, gradient };
  const buttonStyleArray = [
    (buttonStyles.button as any)(dynamicProps),
    (buttonStyles.text as any)(dynamicProps),
    style as any,
  ];

  // Use getWebProps to generate className and ref for web
  const webProps = getWebProps(buttonStyleArray);

  // Icon container styles
  const iconContainerProps = getWebProps([(buttonStyles.iconContainer as any)(dynamicProps)]);

  // Icon styles with dynamic function
  const iconStyleArray = [(buttonStyles.icon as any)(dynamicProps)];
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
      {...ariaProps}
      ref={mergedRef}
      id={buttonId}
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