import React from 'react';
import { View, Text } from '@idealyst/components';
import { getWebProps } from 'react-native-unistyles/web';
import { DateRangePickerProps, DateRange } from './types';
import { RangeCalendar } from './RangeCalendar.web';
import { dateRangePickerStyles } from './DateRangePicker.styles';

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  allowSameDay = true,
  maxDays,
  style,
  testID,
}) => {

  const handleRangeChange = (newRange: DateRange) => {
    onChange(newRange.startDate || newRange.endDate ? newRange : null);
  };


  return (
    <RangeCalendar
      value={value || {}}
      onChange={handleRangeChange}
      minDate={minDate}
      maxDate={maxDate}
      disabled={disabled}
      allowSameDay={allowSameDay}
      maxDays={maxDays}
      style={style}
      testID={testID}
    />
  );
};

export default DateRangePicker;