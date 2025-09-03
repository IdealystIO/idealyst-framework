import React from 'react';
import { DateTimeRangePickerProps } from './types';
import { DateTimeRangePickerBase } from './DateTimeRangePickerBase';
import { RangeCalendar } from '../DateRangePicker/RangeCalendar.native';
import { TimePicker } from '../DateTimePicker/TimePicker.native';
import { dateTimeRangePickerStyles } from './DateTimeRangePicker.styles';

const DateTimeRangePicker: React.FC<DateTimeRangePickerProps> = (props) => {
  dateTimeRangePickerStyles.useVariants({});

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