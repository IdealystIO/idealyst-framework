import React, { useState, useRef, useEffect } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { mdiCalendar } from '@mdi/js';
import { PositionedPortal } from '@idealyst/components/internal';
import { IconSvg } from './IconSvg.web';
import { DatePicker } from './DatePicker';
import { dateTimeInputStyles } from './InputStyles';
import type { DateInputProps } from './types';

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  label,
  placeholder = 'MM/DD/YYYY',
  minDate,
  maxDate,
  disabled = false,
  error,
  style,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const triggerRef = useRef<HTMLDivElement>(null);

  const styles = dateTimeInputStyles;

  // Get dynamic styles
  const labelTextStyle = (styles.labelText as any)({});
  const inputContainerStyle = (styles.inputContainer as any)({ disabled, error: !!error });
  const textInputStyle = (styles.textInput as any)({ disabled });
  const iconButtonStyle = (styles.iconButton as any)({ disabled });
  const errorTextStyle = (styles.errorText as any)({});
  const popoverContentStyle = (styles.popoverContent as any)({});
  const iconColorStyle = (styles.iconColor as any)({ disabled });

  // Format date to string
  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Parse string to date
  const parseDate = (str: string): Date | null => {
    const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) return null;
    const [, month, day, year] = match;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (isNaN(date.getTime())) return null;
    return date;
  };

  // Sync input value with prop value
  useEffect(() => {
    setInputValue(formatDate(value ?? undefined));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Try to parse and update if valid
    const parsed = parseDate(newValue);
    if (parsed) {
      onChange(parsed);
    }
  };

  const handleInputBlur = () => {
    // On blur, reset to formatted value if invalid
    const parsed = parseDate(inputValue);
    if (!parsed && value) {
      setInputValue(formatDate(value));
    } else if (!parsed) {
      setInputValue('');
      onChange(null);
    }
  };

  const handleDateSelect = (date: Date) => {
    onChange(date);
    setOpen(false);
  };

  // Get web props
  const containerProps = getWebProps([inputContainerStyle]);

  return (
    <div style={style as React.CSSProperties}>
      {label && (
        <span style={labelTextStyle}>{label}</span>
      )}
      <div {...containerProps} ref={triggerRef}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          style={textInputStyle}
        />
        <button
          style={iconButtonStyle}
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
        >
          <IconSvg path={mdiCalendar} size={18} color={iconColorStyle.color} />
        </button>
      </div>
      {error && (
        <span style={errorTextStyle}>{error}</span>
      )}

      <PositionedPortal
        open={open}
        anchor={triggerRef}
        placement="bottom-start"
        offset={4}
        onClickOutside={() => setOpen(false)}
        onEscapeKey={() => setOpen(false)}
        zIndex={9999}
      >
        <div style={popoverContentStyle}>
          <DatePicker
            value={value ?? undefined}
            onChange={handleDateSelect}
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
          />
        </div>
      </PositionedPortal>
    </div>
  );
};
