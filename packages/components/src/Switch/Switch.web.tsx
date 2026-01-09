import React, { isValidElement, forwardRef, useMemo } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { switchStyles } from './Switch.styles';
import type { SwitchProps } from './types';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { isIconName } from '../Icon/icon-resolver';
import useMergeRefs from '../hooks/useMergeRefs';
import { getWebSelectionAriaProps, generateAccessibilityId } from '../utils/accessibility';

const Switch = forwardRef<HTMLDivElement | HTMLButtonElement, SwitchProps>(({
  checked = false,
  onCheckedChange,
  disabled = false,
  label,
  labelPosition = 'right',
  intent = 'primary',
  size = 'md',
  enabledIcon,
  disabledIcon,
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
  const handleClick = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
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
    size: size as 'sm' | 'md' | 'lg',
    disabled: disabled as boolean,
    position: labelPosition as 'left' | 'right',
    margin,
    marginVertical,
    marginHorizontal,
  });

  const trackProps = getWebProps([(switchStyles.switchTrack as any)({ checked, intent, disabled })]);
  const thumbProps = getWebProps([(switchStyles.switchThumb as any)({ size, checked })]);
  const thumbIconProps = getWebProps([(switchStyles.thumbIcon as any)({ checked, intent })]);
  const labelProps = getWebProps([(switchStyles.label as any)({ disabled, labelPosition })]);

  // Helper to render icon
  const renderIcon = () => {
    const iconToRender = checked ? enabledIcon : disabledIcon;
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

  // Computed button props with dynamic styles
  const computedButtonProps = getWebProps([
    (switchStyles.switchContainer as any)({})
  ]);

  // Computed container props with dynamic styles (for when label exists)
  const computedContainerProps = getWebProps([
    (switchStyles.container as any)({}),
    style as any,
    {
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
    }
  ]);

  const mergedButtonRef = useMergeRefs(ref as React.Ref<HTMLButtonElement>, computedButtonProps.ref);
  const mergedContainerRef = useMergeRefs(ref as React.Ref<HTMLDivElement>, computedContainerProps.ref);

  const switchElement = (
    <button
      {...computedButtonProps}
      {...ariaProps}
      ref={mergedButtonRef}
      onClick={handleClick}
      disabled={disabled}
      id={switchId}
      data-testid={testID}
    >
      <div {...trackProps}>
        <div {...thumbProps}>
          {renderIcon()}
        </div>
      </div>
    </button>
  );

  if (label) {
    return (
      <div
        {...computedContainerProps}
        ref={mergedContainerRef}
      >
        {labelPosition === 'left' && (
          <span {...labelProps}>{label}</span>
        )}
        {switchElement}
        {labelPosition === 'right' && (
          <span {...labelProps}>{label}</span>
        )}
      </div>
    );
  }

  return switchElement;
});

Switch.displayName = 'Switch';

export default Switch;