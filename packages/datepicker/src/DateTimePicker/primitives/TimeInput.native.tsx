import React from 'react';
import { TextInput } from 'react-native';
import { timePickerStyles } from '../TimePicker.styles';

interface TimeInputProps {
  type: 'hour' | 'minute';
  value: string;
  onChangeText: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  isActive: boolean;
  disabled: boolean;
  inputRef: React.RefObject<TextInput>;
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
  const maxLength = type === 'hour' ? 2 : 2;

  return (
    <TextInput
      ref={inputRef}
      value={value}
      onChangeText={onChangeText}
      onFocus={onFocus}
      onBlur={onBlur}
      keyboardType="numeric"
      maxLength={maxLength}
      selectTextOnFocus
      editable={!disabled}
      style={[
        timePickerStyles.timeInput,
        isActive && timePickerStyles.activeInput,
        {
          fontSize: 16,
          fontWeight: '600',
          color: isActive ? '#3b82f6' : '#111827',
          textAlign: 'center',
          paddingHorizontal: 2,
          paddingVertical: 2,
        }
      ]}
    />
  );
};