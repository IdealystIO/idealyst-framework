import React from 'react';
import { DateTimePickerProps } from './types';
import { DateTimePickerBase } from './DateTimePickerBase';
import { Calendar } from '../DatePicker/Calendar.web';
import { TimePicker } from './TimePicker';

const DateTimePicker: React.FC<DateTimePickerProps> = (props) => {
  return (
    <DateTimePickerBase
      {...props}
      renderCalendar={(calendarProps) => (
        <Calendar {...calendarProps} />
      )}
      renderTimePicker={(timePickerProps) => (
        <TimePicker {...timePickerProps} />
      )}
    />
  );
};

export default DateTimePicker;