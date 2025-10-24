import React, { isValidElement, forwardRef } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { switchStyles } from './Switch.styles';
import type { SwitchProps } from './types';
import { IconSvg } from '../Icon/IconSvg/IconSvg.web';
import { resolveIconPath, isIconName } from '../Icon/icon-resolver';
import useMergeRefs from '../hooks/useMergeRefs';

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
  style,
  testID,
}, ref) => {
  const handleClick = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  // Apply variants using the correct Unistyles v3 pattern
  switchStyles.useVariants({
    size: size as 'sm' | 'md' | 'lg',
    checked: checked as boolean,
    intent: intent as 'primary' | 'success' | 'error' | 'warning' | 'neutral',
    disabled: disabled as boolean,
    position: labelPosition as 'left' | 'right',
  });

  const trackProps = getWebProps([switchStyles.switchTrack({ checked, intent, disabled })]);
  const thumbProps = getWebProps([switchStyles.switchThumb({ size, checked })]);
  const thumbIconProps = getWebProps([switchStyles.thumbIcon({ checked, intent })]);
  const labelProps = getWebProps([switchStyles.label]);

  // Helper to render icon
  const renderIcon = () => {
    const iconToRender = checked ? enabledIcon : disabledIcon;
    if (!iconToRender) return null;

    if (isIconName(iconToRender)) {
      const iconPath = resolveIconPath(iconToRender);
      return (
        <IconSvg
          path={iconPath}
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
    switchStyles.switchContainer,
    {
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex',
    }
  ]);

  // Computed container props with dynamic styles (for when label exists)
  const computedContainerProps = getWebProps([
    switchStyles.container,
    style,
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
      ref={mergedButtonRef}
      onClick={handleClick}
      disabled={disabled}
      data-testid={testID}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
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