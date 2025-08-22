import React from 'react';
import { DatePickerProps } from './types';
import { Calendar } from './Calendar.web';

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  style,
  testID,
}) => {
  const handleDateSelect = (date: Date) => {
    onChange(date);
  };

  return (
    <Calendar
      value={value}
      onChange={handleDateSelect}
      minDate={minDate}
      maxDate={maxDate}
      disabled={disabled}
      style={style}
      testID={testID}
    />
  );
};

export default DatePicker;