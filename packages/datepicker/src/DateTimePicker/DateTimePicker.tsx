import React from 'react';
import { View } from '@idealyst/components';
import { DateTimePickerProps } from './types';
import { Calendar } from '../DatePicker/Calendar';
import { TimePicker } from './TimePicker';

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  timeMode = '12h',
  showSeconds = false,
  timeStep = 1,
  style,
  testID,
}) => {

  const handleDateChange = (newDate: Date) => {
    if (value) {
      // Preserve the time from current value
      const updatedDate = new Date(newDate);
      updatedDate.setHours(value.getHours(), value.getMinutes(), value.getSeconds());
      onChange(updatedDate);
    } else {
      onChange(newDate);
    }
  };

  const handleTimeChange = (newTime: Date) => {
    if (value) {
      // Update time while preserving the date
      const updatedDate = new Date(value);
      updatedDate.setHours(newTime.getHours(), newTime.getMinutes(), newTime.getSeconds());
      onChange(updatedDate);
    } else {
      // If no date is selected, use today's date with the new time
      const today = new Date();
      today.setHours(newTime.getHours(), newTime.getMinutes(), newTime.getSeconds());
      onChange(today);
    }
  };

  const containerStyle = {
    flexDirection: 'row' as const,
    gap: 16,
    alignItems: 'flex-start',
    
    _web: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
    }
  };

  return (
    <View style={[containerStyle, style]} data-testid={testID}>
      <Calendar
        value={value}
        onChange={handleDateChange}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
      />
      
      <TimePicker
        value={value || new Date()}
        onChange={handleTimeChange}
        disabled={disabled}
        mode={timeMode}
        showSeconds={showSeconds}
        step={timeStep}
      />
    </View>
  );
};

export default DateTimePicker;