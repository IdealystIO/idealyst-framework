import React, { isValidElement, forwardRef, useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { IconButtonProps } from './types';
import { iconButtonStyles } from './IconButton.styles';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import useMergeRefs from '../hooks/useMergeRefs';
import { getWebInteractiveAriaProps, generateAccessibilityId } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';

/**
 * Circular icon button component with multiple visual variants and sizes.
 * Supports contained, outlined, and text styles with customizable intent colors.
 */
const IconButton = forwardRef<IdealystElement, IconButtonProps>((props, ref) => {
  const {
    icon,
    onPress,
    onClick,
    disabled = false,
    loading = false,
    type = 'contained',
    intent = 'primary',
    size = 'md',
    gradient,
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

  // Button is effectively disabled when loading
  const isDisabled = disabled || loading;

  // Apply variants for size, disabled, gradient
  iconButtonStyles.useVariants({
    size,
    disabled: isDisabled,
    gradient,
  });

  // Determine the handler to use - onPress takes precedence
  const pressHandler = onPress ?? onClick;

  // Warn about deprecated onClick usage in development
  if (process.env.NODE_ENV !== 'production' && onClick && !onPress) {
    console.warn(
      'IconButton: onClick prop is deprecated. Use onPress instead for cross-platform compatibility.'
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isDisabled && pressHandler) {
      e.stopPropagation();
      pressHandler();
    }
  };

  // Generate unique ID for accessibility
  const buttonId = useMemo(() => id || generateAccessibilityId('icon-button'), [id]);

  // Generate ARIA props - accessibilityLabel is critical for icon-only buttons
  const ariaProps = useMemo(() => {
    const computedLabel = accessibilityLabel ?? (typeof icon === 'string' ? icon : undefined);

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
    icon,
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
    (iconButtonStyles.button as any)(dynamicProps),
    style as any,
  ];

  // Use getWebProps to generate className and ref for web
  const webProps = getWebProps(buttonStyleArray);

  // Icon styles with dynamic function
  const iconStyleArray = [(iconButtonStyles.icon as any)(dynamicProps)];
  const iconProps = getWebProps(iconStyleArray);

  // Spinner styles that match the icon color
  const spinnerStyleArray = [(iconButtonStyles.spinner as any)(dynamicProps)];
  const spinnerProps = getWebProps(spinnerStyleArray);

  // Helper to render icon
  const renderIcon = () => {
    if (typeof icon === 'string') {
      return (
        <IconSvg
          name={icon}
          {...iconProps}
          aria-label={icon}
        />
      );
    } else if (isValidElement(icon)) {
      return icon;
    }
    return null;
  };

  // Render spinner with inline CSS animation (absolutely centered)
  const renderSpinner = () => (
    <>
      <style>
        {`
          @keyframes icon-button-spin {
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
          animation: 'icon-button-spin 0.8s linear infinite',
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
      <span style={contentStyle}>{renderIcon()}</span>
    </button>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
