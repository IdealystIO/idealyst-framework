import React from 'react';
import { Input } from '@idealyst/components';
import { timePickerStyles } from '../TimePicker.styles';

interface TimeInputProps {
  type: 'hour' | 'minute';
  value: string;
  onChangeText: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  isActive: boolean;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  type,
  value,
  onChangeText,
  onFocus,
  onBlur,
  isActive,
  disabled,
  inputRef,
}) => {
  const handleChange = (inputValue: string) => {
    onChangeText(inputValue);
    
    // Smart focus switching for web
    if (type === 'hour') {
      const num = parseInt(inputValue);
      if (!isNaN(num) && num >= 2) {
        // Wait a moment then focus minutes
        setTimeout(() => {
          const minuteInput = document.querySelector('input[data-time-input="minute"]') as HTMLInputElement;
          minuteInput?.focus();
        }, 100);
      }
    }
  };

  const handleFocus = () => {
    onFocus();
    // For web, sync the displayed value on focus
    if (type === 'minute' && value.length === 1) {
      onChangeText(value.padStart(2, '0'));
    }
  };

  return (
    <Input
      ref={inputRef}
      variant="bare"
      value={value}
      onChangeText={handleChange}
      onFocus={handleFocus}
      onBlur={onBlur}
      style={[
        timePickerStyles.timeInput,
        isActive ? timePickerStyles.activeInput : {}
      ]}
      disabled={disabled}
      data-time-input={type}
    />
  );
};