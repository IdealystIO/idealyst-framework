import React, { useCallback, memo, useRef } from 'react';
import { View, Text } from '@idealyst/components';
import { DatePickerProps } from './types';
import { Calendar } from './Calendar.native';
import { datePickerStyles } from './DatePicker.styles';

const DatePicker: React.FC<DatePickerProps> = memo(({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  style,
  testID,
}) => {
  // Store the latest onChange function in a ref to avoid recreating handleDateSelect
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  
  // Stable callback that uses the latest onChange function
  const handleDateSelect = useCallback((date: Date) => {
    onChangeRef.current(date);
  }, []); // Empty dependency array - this function never changes

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
}, (prevProps, nextProps) => {
  // Custom comparison to reduce unnecessary re-renders
  // Skip checking onChange since we handle it with a ref
  return (
    prevProps.value?.getTime() === nextProps.value?.getTime() &&
    prevProps.minDate?.getTime() === nextProps.minDate?.getTime() &&
    prevProps.maxDate?.getTime() === nextProps.maxDate?.getTime() &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.style === nextProps.style &&
    prevProps.testID === nextProps.testID
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;