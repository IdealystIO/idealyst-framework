import React, { isValidElement, forwardRef, useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { ButtonProps } from './types';
import { buttonStyles } from './Button.styles';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import useMergeRefs from '../hooks/useMergeRefs';
import { getWebInteractiveAriaProps, generateAccessibilityId } from '../utils/accessibility';

/**
 * Interactive button component with multiple visual variants, sizes, and icon support.
 * Supports contained, outlined, and text styles with customizable intent colors.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    title,
    children,
    onPress,
    disabled = false,
    loading = false,
    type: typeProp,
    variant,
    intent = 'primary',
    size = 'md',
    gradient,
    leftIcon,
    rightIcon,
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

  // variant is an alias for type - variant takes precedence if both are set
  const type = variant ?? typeProp ?? 'contained';

  // Button is effectively disabled when loading
  const isDisabled = disabled || loading;

  // Apply variants for size, disabled, gradient
  buttonStyles.useVariants({
    size,
    disabled: isDisabled,
    gradient,
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Only stop propagation if we have an onPress handler
    // Otherwise, let clicks bubble up to parent handlers (e.g., Menu triggers)
    if (!isDisabled && onPress) {
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
      accessibilityDisabled: accessibilityDisabled ?? isDisabled,
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
    isDisabled,
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
  const dynamicProps = { intent, type, size, disabled: isDisabled, gradient };
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

  // Spinner styles that match the text color
  const spinnerStyleArray = [(buttonStyles.spinner as any)(dynamicProps)];
  const spinnerProps = getWebProps(spinnerStyleArray);

  // Helper to render icon - now uses icon name directly
  const renderIcon = (icon: string | React.ReactNode) => {
    if (typeof icon === 'string') {
      // Render IconSvg with the icon name - registry lookup happens inside
      return (
        <IconSvg
          name={icon}
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

  // Render spinner with inline CSS animation (absolutely centered)
  const renderSpinner = () => (
    <>
      <style>
        {`
          @keyframes button-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <span
        {...spinnerProps}
        style={{
          position: 'absolute',
          display: 'inline-block',
          width: '1em',
          height: '1em',
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'button-spin 0.8s linear infinite',
        }}
        role="status"
        aria-label="Loading"
      />
    </>
  );

  // Merge unistyles web ref with forwarded ref
  const mergedRef = useMergeRefs(ref, webProps.ref);

  // Content opacity - hide when loading but keep for sizing
  const contentStyle = loading ? { opacity: 0 } : undefined;

  return (
    <button
      {...webProps}
      {...ariaProps}
      ref={mergedRef}
      id={buttonId}
      onClick={handleClick}
      disabled={isDisabled}
      data-testid={testID}
      aria-busy={loading ? 'true' : undefined}
      style={{ position: 'relative' }}
    >
      {loading && renderSpinner()}
      {hasIcons ? (
        <div {...iconContainerProps} style={contentStyle}>
          {leftIcon && renderIcon(leftIcon)}
          {buttonContent}
          {rightIcon && renderIcon(rightIcon)}
        </div>
      ) : (
        <span style={contentStyle}>{buttonContent}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
