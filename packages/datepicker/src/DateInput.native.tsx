import React, { useState, useEffect } from 'react';
import { Modal, TextInput as RNTextInput } from 'react-native';
import { View, Text, Button, Icon } from '@idealyst/components';
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

  const handleInputChange = (newValue: string) => {
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
          <Icon name="calendar" size={18} />
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
            <DatePicker
              value={value ?? undefined}
              onChange={handleDateSelect}
              minDate={minDate}
              maxDate={maxDate}
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
