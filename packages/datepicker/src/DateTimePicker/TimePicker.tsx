import React from 'react';
import { TimePickerProps } from './types';
import { TimePickerBase } from './TimePickerBase';
import { ClockFace, TimeInput } from './primitives';

export const TimePicker: React.FC<TimePickerProps> = (props) => {
  return (
    <TimePickerBase
      {...props}
      renderClock={(clockProps) => <ClockFace {...clockProps} />}
      renderTimeInput={(inputProps) => <TimeInput {...inputProps} />}
    />
  );
};