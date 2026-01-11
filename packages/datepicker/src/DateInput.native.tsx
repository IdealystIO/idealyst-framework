import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
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
          <MaterialDesignIcons name="calendar" size={18} style={iconStyle} />
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
            <DatePicker
              value={value ?? undefined}
              onChange={handleDateSelect}
              minDate={minDate}
              maxDate={maxDate}
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
