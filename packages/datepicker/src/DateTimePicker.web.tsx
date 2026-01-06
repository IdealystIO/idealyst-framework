import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { Text } from '@idealyst/components';
import { DateInput } from './DateInput';
import { TimeInput } from './TimeInput';
import { datePickerStyles } from './styles';
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
  const handleDateChange = (date: Date | null) => {
    if (!date) {
      onChange(null);
      return;
    }
    // Preserve time from current value, or use noon as default
    const hours = value?.getHours() ?? 12;
    const minutes = value?.getMinutes() ?? 0;
    const updated = new Date(date);
    updated.setHours(hours, minutes, 0, 0);
    onChange(updated);
  };

  const handleTimeChange = (time: Date | null) => {
    if (!time) {
      // Only clear time component, keep date if it exists
      if (value) {
        const updated = new Date(value);
        updated.setHours(12, 0, 0, 0);
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

  // Get web props for styled elements
  const inputRowProps = getWebProps([datePickerStyles.inputRow]);

  return (
    <div style={style as React.CSSProperties}>
      {label && (
        <Text typography="body2" weight="medium" style={{ marginBottom: 4 }}>
          {label}
        </Text>
      )}
      <div {...inputRowProps}>
        <div style={{ flex: 1 }}>
          <DateInput
            value={value ?? undefined}
            onChange={handleDateChange}
            placeholder="MM/DD/YYYY"
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
            error={error}
          />
        </div>
        <div style={{ flex: 1 }}>
          <TimeInput
            value={value ?? undefined}
            onChange={handleTimeChange}
            placeholder={timeMode === '24h' ? '14:30' : '2:30 PM'}
            mode={timeMode}
            minuteStep={minuteStep}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};
