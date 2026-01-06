import React, { useState, useRef, useEffect } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { View, Text, Button, Icon } from '@idealyst/components';
import { PositionedPortal } from '@idealyst/components/internal';
import { DatePicker } from './DatePicker';
import { datePickerStyles } from './styles';
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

  // Apply variants for input container
  datePickerStyles.useVariants({
    disabled,
    error: !!error,
  });

  // Get web props for styled elements
  const containerProps = getWebProps([datePickerStyles.inputContainer]);
  const inputProps = getWebProps([datePickerStyles.textInput]);

  return (
    <View style={style}>
      {label && (
        <Text typography="body2" weight="medium" style={datePickerStyles.labelText}>
          {label}
        </Text>
      )}
      <div ref={triggerRef} {...containerProps}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          {...inputProps}
        />
        <Button
          type="text"
          size="sm"
          onPress={() => !disabled && setOpen(!open)}
          disabled={disabled}
          style={{ marginRight: 4 }}
        >
          <Icon name="calendar" size={18} />
        </Button>
      </div>
      {error && (
        <Text typography="caption" style={datePickerStyles.errorText}>
          {error}
        </Text>
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
        <View style={datePickerStyles.popoverContent}>
          <DatePicker
            value={value ?? undefined}
            onChange={handleDateSelect}
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
          />
        </View>
      </PositionedPortal>
    </View>
  );
};
