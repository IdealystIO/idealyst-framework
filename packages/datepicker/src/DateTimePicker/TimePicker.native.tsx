import React from 'react';
import { TimePickerProps } from './types';
import { TimePickerBase } from './TimePickerBase';
import { ClockFace, TimeInput } from './primitives';
import { timePickerStyles } from './TimePicker.styles';

export const TimePicker: React.FC<TimePickerProps> = (props) => {
  timePickerStyles.useVariants({});
  
  return (
    <TimePickerBase
      {...props}
      renderClock={(clockProps) => <ClockFace {...clockProps} />}
      renderTimeInput={(inputProps) => <TimeInput {...inputProps} />}
    />
  );
};