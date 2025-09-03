import React from 'react';
import { DateTimeRangePickerProps } from './types';
import { DateTimeRangePickerBase } from './DateTimeRangePickerBase';
import { RangeCalendar } from '../DateRangePicker/RangeCalendar.web';
import { TimePicker } from '../DateTimePicker/TimePicker';

const DateTimeRangePicker: React.FC<DateTimeRangePickerProps> = (props) => {
  return (
    <DateTimeRangePickerBase
      {...props}
      renderRangeCalendar={(rangeCalendarProps) => (
        <RangeCalendar {...rangeCalendarProps} />
      )}
      renderTimePicker={(timePickerProps) => (
        <TimePicker {...timePickerProps} />
      )}
    />
  );
};

export default DateTimeRangePicker;