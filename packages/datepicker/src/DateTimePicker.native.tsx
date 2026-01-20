import React from 'react';
import { View, Text } from 'react-native';
import { DateInput } from './DateInput';
import { TimeInput } from './TimeInput';
import { dateTimePickerStyles } from './DateTimePicker.styles';
import type { DateTimePickerProps } from './types';

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  label,
  minDate,
  maxDate,
  timeMode = '12h',
  minuteStep = 1,
  disabled = false,
  error,
  style,
}) => {
  // Get dynamic styles - call as functions for theme reactivity
  const styles = dateTimePickerStyles;
  const inputRowStyle = (styles.inputRow as any)({});
  const labelTextStyle = (styles.labelText as any)({});
  const inputColumnStyle = (styles.inputColumn as any)({});

  const handleDateChange = (date: Date | null) => {
    if (!date) {
      onChange(null);
      return;
    }
    // Preserve time from current value, or use noon as default
    const hours = value?.getHours() ?? 12;
    const minutes = value?.getMinutes() ?? 0;
    const updated = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
      0,
      0
    );
    onChange(updated);
  };

  const handleTimeChange = (time: Date | null) => {
    if (!time) {
      // Only clear time component, keep date if it exists
      if (value) {
        const updated = new Date(
          value.getFullYear(),
          value.getMonth(),
          value.getDate(),
          12,
          0,
          0,
          0
        );
        onChange(updated);
      }
      return;
    }
    // Preserve date from current value, or use today
    const baseDate = value || new Date();
    const updated = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      time.getHours(),
      time.getMinutes(),
      0,
      0
    );
    onChange(updated);
  };

  return (
    <View style={style}>
      {label && (
        <Text style={labelTextStyle}>
          {label}
        </Text>
      )}
      <View style={inputRowStyle}>
        <View style={inputColumnStyle}>
          <DateInput
            value={value ?? undefined}
            onChange={handleDateChange}
            placeholder="MM/DD/YYYY"
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
            error={error}
          />
        </View>
        <View style={inputColumnStyle}>
          <TimeInput
            value={value ?? undefined}
            onChange={handleTimeChange}
            placeholder={timeMode === '24h' ? '14:30' : '2:30 PM'}
            mode={timeMode}
            minuteStep={minuteStep}
            disabled={disabled}
          />
        </View>
      </View>
    </View>
  );
};
