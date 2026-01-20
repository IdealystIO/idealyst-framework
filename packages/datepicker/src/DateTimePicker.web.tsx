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
    console.log('[DateTimePicker] handleDateChange received:', date?.toISOString());
    console.log('[DateTimePicker] Current value:', value?.toISOString());
    if (!date) {
      onChange(null);
      return;
    }
    // Preserve time from current value, or use noon as default
    const hours = value?.getHours() ?? 12;
    const minutes = value?.getMinutes() ?? 0;
    console.log('[DateTimePicker] Preserving hours:', hours, 'minutes:', minutes);
    const updated = new Date(date);
    console.log('[DateTimePicker] After new Date(date):', updated.toISOString());
    updated.setHours(hours, minutes, 0, 0);
    console.log('[DateTimePicker] After setHours:', updated.toISOString());
    console.log('[DateTimePicker] Calling onChange with:', updated.toISOString());
    onChange(updated);
  };

  const handleTimeChange = (time: Date | null) => {
    console.log('[DateTimePicker] handleTimeChange received:', time?.toISOString());
    console.log('[DateTimePicker] Current value:', value?.toISOString());
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
    console.log('[DateTimePicker] Time change - calling onChange with:', updated.toISOString());
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
