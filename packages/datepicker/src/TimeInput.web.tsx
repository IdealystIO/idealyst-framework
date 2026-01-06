import React, { useState, useRef, useEffect } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { View, Text, Button, Icon } from '@idealyst/components';
import { PositionedPortal } from '@idealyst/components/internal';
import { TimePicker } from './TimePicker';
import { datePickerStyles } from './styles';
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
  style,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const triggerRef = useRef<HTMLDivElement>(null);

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
          <Icon name="clock-outline" size={18} />
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
          <TimePicker
            value={value ?? undefined}
            onChange={handleTimeChange}
            mode={mode}
            minuteStep={minuteStep}
            disabled={disabled}
          />
        </View>
      </PositionedPortal>
    </View>
  );
};
