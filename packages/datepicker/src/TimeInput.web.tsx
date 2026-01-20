import React, { useState, useRef, useEffect } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { useUnistyles } from 'react-native-unistyles';
import { mdiClockOutline } from '@mdi/js';
import { PositionedPortal } from '@idealyst/components/internal';
import { IconSvg } from './IconSvg.web';
import { TimePicker } from './TimePicker';
import { dateTimeInputStyles } from './InputStyles';
import type { TimeInputProps } from './types';

export const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  label,
  placeholder = '12:00 PM',
  mode = '12h',
  minuteStep = 1,
  disabled = false,
  error,
  size = 'md',
  style,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const triggerRef = useRef<HTMLDivElement>(null);

  const styles = dateTimeInputStyles;

  // Apply variants for disabled, error, and size states
  styles.useVariants({
    disabled,
    error: !!error,
    size,
  });

  // Get theme for icon size and color
  const { theme } = useUnistyles();
  const iconSize = theme.sizes.input[size].iconSize;
  const iconColor = theme.colors.text.secondary;

  // Get dynamic styles with size variant
  const labelTextStyle = (styles.labelText as any)({});
  const inputContainerStyle = (styles.inputContainer as any)({ disabled, error: !!error, size });
  const textInputStyle = (styles.textInput as any)({ disabled, size });
  const iconButtonStyle = (styles.iconButton as any)({ disabled, size });
  const iconStyle = (styles.icon as any)({ size });
  const errorTextStyle = (styles.errorText as any)({});
  const popoverContentStyle = (styles.popoverContent as any)({});

  // Format time to string
  const formatTime = (date: Date | undefined): string => {
    if (!date) return '';
    const hours = date.getHours();
    const minutes = date.getMinutes();

    if (mode === '24h') {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  // Parse string to date (time only)
  const parseTime = (str: string): Date | null => {
    // Try 12h format: "1:30 PM" or "12:00 AM"
    const match12h = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match12h) {
      let [, hours, minutes, period] = match12h;
      let h = parseInt(hours);
      const m = parseInt(minutes);
      if (h < 1 || h > 12 || m > 59) return null;
      if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
      if (period.toUpperCase() === 'AM' && h === 12) h = 0;
      const date = new Date();
      date.setHours(h, m, 0, 0);
      return date;
    }

    // Try 24h format: "13:30"
    const match24h = str.match(/^(\d{1,2}):(\d{2})$/);
    if (match24h) {
      const [, hours, minutes] = match24h;
      const h = parseInt(hours);
      const m = parseInt(minutes);
      if (h > 23 || m > 59) return null;
      const date = new Date();
      date.setHours(h, m, 0, 0);
      return date;
    }

    return null;
  };

  // Sync input value with prop value
  useEffect(() => {
    setInputValue(formatTime(value ?? undefined));
  }, [value, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Try to parse and update if valid
    const parsed = parseTime(newValue);
    if (parsed) {
      onChange(parsed);
    }
  };

  const handleInputBlur = () => {
    const parsed = parseTime(inputValue);
    if (!parsed && value) {
      setInputValue(formatTime(value));
    } else if (!parsed) {
      setInputValue('');
      onChange(null);
    }
  };

  const handleTimeChange = (date: Date) => {
    onChange(date);
  };

  // Get web props for all elements
  const containerProps = getWebProps([inputContainerStyle]);
  const labelProps = getWebProps([labelTextStyle]);
  const inputProps = getWebProps([textInputStyle]);
  const iconButtonProps = getWebProps([iconButtonStyle]);
  const errorProps = getWebProps([errorTextStyle]);
  const popoverProps = getWebProps([popoverContentStyle]);

  return (
    <div style={style as React.CSSProperties}>
      {label && (
        <span {...labelProps}>{label}</span>
      )}
      <div {...containerProps} ref={triggerRef}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          {...inputProps}
        />
        <button
          type="button"
          {...iconButtonProps}
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
        >
          <IconSvg path={mdiClockOutline} size={iconSize} color={iconColor} />
        </button>
      </div>
      {error && (
        <span {...errorProps}>{error}</span>
      )}

      <PositionedPortal
        open={open}
        anchor={triggerRef as React.RefObject<HTMLElement>}
        placement="bottom-start"
        offset={4}
        onClickOutside={() => setOpen(false)}
        onEscapeKey={() => setOpen(false)}
        zIndex={9999}
      >
        <div {...popoverProps}>
          <TimePicker
            value={value ?? undefined}
            onChange={handleTimeChange}
            mode={mode}
            minuteStep={minuteStep}
            disabled={disabled}
          />
        </div>
      </PositionedPortal>
    </div>
  );
};
