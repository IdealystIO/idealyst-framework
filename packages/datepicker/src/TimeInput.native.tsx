import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
  style,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Get dynamic styles - call as functions for theme reactivity
  const styles = dateTimeInputStyles;
  const labelTextStyle = (styles.labelText as any)({});
  const inputContainerStyle = (styles.inputContainer as any)({ disabled, error: !!error });
  const textInputStyle = (styles.textInput as any)({ disabled });
  const iconButtonStyle = (styles.iconButton as any)({ disabled });
  const errorTextStyle = (styles.errorText as any)({});
  const modalBackdropStyle = (styles.modalBackdrop as any)({});
  const popoverContentStyle = (styles.popoverContent as any)({});
  const closeButtonStyle = (styles.closeButton as any)({ disabled: false });
  const closeButtonTextStyle = (styles.closeButtonText as any)({});
  const iconStyle = (styles.iconColor as any)({ disabled });

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
        <Text style={labelTextStyle}>
          {label}
        </Text>
      )}
      <View style={inputContainerStyle}>
        <TextInput
          value={inputValue}
          onChangeText={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          editable={!disabled}
          style={textInputStyle}
        />
        <TouchableOpacity
          style={iconButtonStyle}
          onPress={() => !disabled && setOpen(true)}
          disabled={disabled}
        >
          <MaterialCommunityIcons name="clock-outline" size={18} style={iconStyle} />
        </TouchableOpacity>
      </View>
      {error && (
        <Text style={errorTextStyle}>
          {error}
        </Text>
      )}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={modalBackdropStyle}>
          <View style={popoverContentStyle}>
            <TimePicker
              value={value ?? undefined}
              onChange={handleTimeChange}
              mode={mode}
              minuteStep={minuteStep}
              disabled={disabled}
            />
            <TouchableOpacity
              style={closeButtonStyle}
              onPress={() => setOpen(false)}
            >
              <Text style={closeButtonTextStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
