import React, { useState, useRef, useEffect } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { useUnistyles } from 'react-native-unistyles';
import { mdiCalendar } from '@mdi/js';
import { PositionedPortal } from '@idealyst/components/internal';
import { IconSvg } from './IconSvg.web';
import { DatePicker } from './DatePicker';
import { dateTimeInputStyles } from './InputStyles';
import type { DateInputProps } from './types';
import { flattenStyle } from './flattenStyle';

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  label,
  placeholder = 'MM/DD/YYYY',
  minDate,
  maxDate,
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

  // Format date to string
  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Parse string to date (use noon to avoid timezone issues)
  const parseDate = (str: string): Date | null => {
    const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) return null;
    const [, month, day, year] = match;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0, 0);
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

  // Get web props for all elements
  const containerProps = getWebProps([inputContainerStyle]);
  const labelProps = getWebProps([labelTextStyle]);
  const inputProps = getWebProps([textInputStyle]);
  const iconButtonProps = getWebProps([iconButtonStyle]);
  const errorProps = getWebProps([errorTextStyle]);
  const popoverProps = getWebProps([popoverContentStyle]);

  return (
    <div style={flattenStyle(style)}>
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
          <IconSvg path={mdiCalendar} size={iconSize} color={iconColor} />
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
