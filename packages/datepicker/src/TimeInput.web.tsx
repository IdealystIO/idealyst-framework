import React, { useState, useRef, useEffect } from 'react';
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

  return (
    <View style={style}>
      {label && (
        <Text typography="body2" weight="medium" style={{ marginBottom: 4 }}>
          {label}
        </Text>
      )}
      <div
        ref={triggerRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
          borderRadius: 6,
          backgroundColor: disabled ? '#f3f4f6' : 'white',
          overflow: 'hidden',
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: 14,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            color: disabled ? '#9ca3af' : '#111827',
          }}
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
        <Text typography="caption" style={{ marginTop: 4, color: '#ef4444' }}>
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
