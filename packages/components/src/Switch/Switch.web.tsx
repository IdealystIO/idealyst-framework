import React, { isValidElement, forwardRef, useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { switchStyles } from './Switch.styles';
import type { SwitchProps } from './types';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { isIconName } from '../Icon/icon-resolver';
import useMergeRefs from '../hooks/useMergeRefs';
import { getWebSelectionAriaProps, generateAccessibilityId } from '../utils/accessibility';
import type { IdealystElement } from '../utils/refTypes';
import { flattenStyle } from '../utils/flattenStyle';

/**
 * Toggle switch for binary on/off states with optional label and icons.
 * Supports custom enabled/disabled icons and multiple sizes.
 */
const Switch = forwardRef<IdealystElement, SwitchProps>(({
  checked = false,
  onChange,
  disabled = false,
  error,
  helperText,
  label,
  labelPosition = 'right',
  intent = 'primary',
  size = 'md',
  onIcon,
  offIcon,
  // Spacing variants from FormInputStyleProps
  margin,
  marginVertical,
  marginHorizontal,
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
  accessibilityChecked,
}, ref) => {
  // Derive hasError from error prop
  const hasError = Boolean(error);
  // Determine if we need a wrapper (when error or helperText is present)
  const needsWrapper = Boolean(error) || Boolean(helperText);
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  // Generate unique ID for accessibility
  const switchId = useMemo(() => id || generateAccessibilityId('switch'), [id]);

  // Generate ARIA props
  const ariaProps = useMemo(() => {
    const computedLabel = accessibilityLabel ?? label;
    const computedChecked = accessibilityChecked ?? checked;

    return getWebSelectionAriaProps({
      accessibilityLabel: computedLabel,
      accessibilityHint,
      accessibilityDisabled: accessibilityDisabled ?? disabled,
      accessibilityHidden,
      accessibilityRole: accessibilityRole ?? 'switch',
      accessibilityLabelledBy,
      accessibilityDescribedBy,
      accessibilityChecked: computedChecked,
    });
  }, [
    accessibilityLabel,
    label,
    accessibilityHint,
    accessibilityDisabled,
    disabled,
    accessibilityHidden,
    accessibilityRole,
    accessibilityLabelledBy,
    accessibilityDescribedBy,
    accessibilityChecked,
    checked,
  ]);

  
  // Apply variants using the correct Unistyles v3 pattern
  switchStyles.useVariants({
    size,
    checked,
    disabled: disabled as boolean,
    hasError,
    labelPosition,
    margin,
    intent,
    marginVertical,
    marginHorizontal,
  });

  const trackProps = getWebProps([switchStyles.switchTrack as any]);
  const thumbProps = getWebProps([switchStyles.switchThumb as any]);
  const thumbIconProps = getWebProps([switchStyles.thumbIcon as any]);
  const labelProps = getWebProps([switchStyles.label as any]);

  // Wrapper and helperText styles
  const wrapperStyleComputed = (switchStyles.wrapper as any)({});
  const helperTextStyleComputed = (switchStyles.helperText as any)({ hasError });
  const wrapperProps = getWebProps([wrapperStyleComputed, flattenStyle(style)]);
  const helperTextProps = getWebProps([helperTextStyleComputed]);

  const showFooter = Boolean(error) || Boolean(helperText);

  // Helper to render icon
  const renderIcon = () => {
    const iconToRender = checked ? onIcon : offIcon;
    if (!iconToRender) return null;

    if (isIconName(iconToRender)) {
      return (
        <IconSvg
          name={iconToRender}
          {...thumbIconProps}
          aria-label={iconToRender}
        />
      );
    } else if (isValidElement(iconToRender)) {
      return iconToRender;
    }

    return null;
  };

  // Computed button props with static style references
  const computedButtonProps = getWebProps([switchStyles.switchContainer as any]);

  // Computed container props (for when label exists)
  const computedContainerProps = getWebProps([switchStyles.container as any, !needsWrapper && flattenStyle(style)].filter(Boolean));

  const mergedButtonRef = useMergeRefs(ref as React.Ref<HTMLButtonElement>, computedButtonProps.ref);
  const mergedContainerRef = useMergeRefs(ref as React.Ref<HTMLDivElement>, computedContainerProps.ref);

  const switchElement = (
    <button
      {...computedButtonProps}
      {...ariaProps}
      style={!label && !needsWrapper ? flattenStyle(style) : undefined}
      ref={!label && !needsWrapper ? mergedButtonRef : undefined}
      onClick={handleClick}
      disabled={disabled}
      id={switchId}
      data-testid={!label && !needsWrapper ? testID : undefined}
    >
      <div {...trackProps}>
        <div {...thumbProps}>
          {renderIcon()}
        </div>
      </div>
    </button>
  );

  // The switch + label row
  const switchWithLabel = label ? (
    <div
      {...computedContainerProps}
      ref={!needsWrapper ? mergedContainerRef : undefined}
      id={!needsWrapper ? id : undefined}
      data-testid={!needsWrapper ? testID : undefined}
    >
      {labelPosition === 'left' && (
        <span {...labelProps}>{label}</span>
      )}
      {switchElement}
      {labelPosition === 'right' && (
        <span {...labelProps}>{label}</span>
      )}
    </div>
  ) : switchElement;

  // If wrapper needed for error/helperText
  if (needsWrapper) {
    return (
      <div {...wrapperProps} id={id} data-testid={testID}>
        {switchWithLabel}
        {showFooter && (
          <div style={{ flex: 1 }}>
            {error && (
              <span {...helperTextProps} role="alert">
                {error}
              </span>
            )}
            {!error && helperText && (
              <span {...helperTextProps}>
                {helperText}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  return switchWithLabel;
});

Switch.displayName = 'Switch';

export default Switch;