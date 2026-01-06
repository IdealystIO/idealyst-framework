import React, { useState, useEffect } from 'react';
import { Modal, TextInput as RNTextInput } from 'react-native';
import { View, Text, Button, Icon } from '@idealyst/components';
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

  useEffect(() => {
    setInputValue(formatTime(value ?? undefined));
  }, [value, mode]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
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

  return (
    <View style={style}>
      {label && (
        <Text typography="body2" weight="medium" style={datePickerStyles.labelText}>
          {label}
        </Text>
      )}
      <View style={datePickerStyles.inputContainer}>
        <RNTextInput
          value={inputValue}
          onChangeText={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          editable={!disabled}
          style={datePickerStyles.textInput}
        />
        <Button
          type="text"
          size="sm"
          onPress={() => !disabled && setOpen(true)}
          disabled={disabled}
          style={{ marginRight: 4 }}
        >
          <Icon name="clock-outline" size={18} />
        </Button>
      </View>
      {error && (
        <Text typography="caption" style={datePickerStyles.errorText}>
          {error}
        </Text>
      )}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={datePickerStyles.modalBackdrop}>
          <View style={datePickerStyles.popoverContent}>
            <TimePicker
              value={value ?? undefined}
              onChange={handleTimeChange}
              mode={mode}
              minuteStep={minuteStep}
              disabled={disabled}
            />
            <Button
              type="text"
              onPress={() => setOpen(false)}
              style={{ marginTop: 8 }}
            >
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};
