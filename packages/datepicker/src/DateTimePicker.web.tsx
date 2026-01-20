import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
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
  size = 'md',
  style,
}) => {
  const styles = dateTimePickerStyles;

  // Get dynamic styles
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

  // Get web props for all elements
  const inputRowProps = getWebProps([inputRowStyle]);
  const labelProps = getWebProps([labelTextStyle]);
  const inputColumnProps = getWebProps([inputColumnStyle]);

  return (
    <div style={style as React.CSSProperties}>
      {label && (
        <span {...labelProps}>{label}</span>
      )}
      <div {...inputRowProps}>
        <div {...inputColumnProps}>
          <DateInput
            value={value ?? undefined}
            onChange={handleDateChange}
            placeholder="MM/DD/YYYY"
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
            error={error}
            size={size}
          />
        </div>
        <div {...inputColumnProps}>
          <TimeInput
            value={value ?? undefined}
            onChange={handleTimeChange}
            placeholder={timeMode === '24h' ? '14:30' : '2:30 PM'}
            mode={timeMode}
            minuteStep={minuteStep}
            disabled={disabled}
            size={size}
          />
        </div>
      </div>
    </div>
  );
};
