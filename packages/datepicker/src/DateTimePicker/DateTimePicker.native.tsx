import React from 'react';
import { DateTimePickerProps } from './types';
import { DateTimePickerBase } from './DateTimePickerBase';
import { Calendar } from '../DatePicker/Calendar.native';
import { TimePicker } from './TimePicker.native';
import { dateTimePickerStyles } from './DateTimePicker.styles';

const DateTimePicker: React.FC<DateTimePickerProps> = (props) => {
  dateTimePickerStyles.useVariants({});

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