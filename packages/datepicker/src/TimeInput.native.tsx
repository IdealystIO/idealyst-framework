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

  return (
    <View style={style}>
      {label && (
        <Text typography="body2" weight="medium" style={{ marginBottom: 4 }}>
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: error ? '#ef4444' : '#d1d5db',
          borderRadius: 6,
          backgroundColor: disabled ? '#f3f4f6' : 'white',
          overflow: 'hidden',
        }}
      >
        <RNTextInput
          value={inputValue}
          onChangeText={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          editable={!disabled}
          style={{
            flex: 1,
            padding: 8,
            paddingHorizontal: 12,
            fontSize: 14,
            backgroundColor: 'transparent',
            color: disabled ? '#9ca3af' : '#111827',
          }}
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
        <Text typography="caption" style={{ marginTop: 4, color: '#ef4444' }}>
          {error}
        </Text>
      )}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
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
