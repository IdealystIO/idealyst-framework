import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { switchStyles } from './Switch.styles';
import type { SwitchProps } from './types';

const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onCheckedChange,
  disabled = false,
  label,
  labelPosition = 'right',
  intent = 'primary',
  size = 'medium',
  style,
  testID,
}) => {
  const handleClick = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  // Apply variants using the correct Unistyles v3 pattern
  switchStyles.useVariants({
    size: size as 'small' | 'medium' | 'large',
    checked: checked as boolean,
    intent: intent as 'primary' | 'success' | 'error' | 'warning' | 'neutral',
    disabled: disabled as boolean,
    position: labelPosition as 'left' | 'right',
  });

  const containerProps = getWebProps([switchStyles.container, style]);
  const switchContainerProps = getWebProps([switchStyles.switchContainer]);
  const trackProps = getWebProps([switchStyles.switchTrack]);
  const thumbProps = getWebProps([switchStyles.switchThumb]);
  const labelProps = getWebProps([switchStyles.label]);

  const switchElement = (
    <button
      onClick={handleClick}
      disabled={disabled}
      data-testid={testID}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      style={{
        ...switchContainerProps.style,
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
      }}
      className={switchContainerProps.className}
    >
      <div className={trackProps.className} style={trackProps.style}>
        <div className={thumbProps.className} style={thumbProps.style} />
      </div>
    </button>
  );

  if (label) {
    return (
      <div
        {...containerProps}
        style={{
          ...containerProps.style,
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
        }}
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
};

export default Switch;