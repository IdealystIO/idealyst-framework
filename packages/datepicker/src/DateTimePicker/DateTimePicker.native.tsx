import React from 'react';
import { View, Text } from '@idealyst/components';
import { DateTimePickerProps } from './types';
import { Calendar } from '../DatePicker/Calendar.native';
import { TimePicker } from './TimePicker.native';
import { dateTimePickerStyles } from './DateTimePicker.styles';

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

  dateTimePickerStyles.useVariants({});

  return (
    <View style={[dateTimePickerStyles.container, style]} testID={testID}>
      {/* Date Section */}
      <View style={dateTimePickerStyles.section}>
        <Text style={dateTimePickerStyles.sectionLabel}>Date</Text>
        <View style={dateTimePickerStyles.sectionContent}>
          <Calendar
            value={value}
            onChange={handleDateChange}
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
          />
        </View>
      </View>
      
      {/* Time Section */}
      <View style={dateTimePickerStyles.section}>
        <Text style={dateTimePickerStyles.sectionLabel}>Time</Text>
        <View style={dateTimePickerStyles.sectionContent}>
          <TimePicker
            value={value || new Date()}
            onChange={handleTimeChange}
            disabled={disabled}
            mode={timeMode}
            showSeconds={showSeconds}
            step={timeStep}
          />
        </View>
      </View>
    </View>
  );
};

export default DateTimePicker;