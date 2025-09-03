import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Button } from '@idealyst/components';
import { TimePickerProps } from './types';
import { timePickerStyles } from './TimePicker.styles';

interface TimePickerBaseProps extends TimePickerProps {
  renderClock: (props: {
    activeSelection: 'hour' | 'minute';
    hours: number;
    minutes: number;
    displayHours: number;
    mode: '12h' | '24h';
    disabled: boolean;
    onHourClick: (hour: number) => void;
    onMinuteClick: (minute: number) => void;
  }) => React.ReactNode;
  renderTimeInput: (props: {
    type: 'hour' | 'minute';
    value: string;
    onChangeText: (value: string) => void;
    onFocus: () => void;
    onBlur: () => void;
    isActive: boolean;
    disabled: boolean;
    inputRef: React.RefObject<any>;
  }) => React.ReactNode;
}

export const TimePickerBase: React.FC<TimePickerBaseProps> = ({
  value = new Date(),
  onChange,
  disabled = false,
  mode = '12h',
  step = 1,
  style,
  testID,
  renderClock,
  renderTimeInput,
}) => {
  const [activeSelection, setActiveSelection] = useState<'hour' | 'minute'>('hour');
  const [hourInputValue, setHourInputValue] = useState(String(value.getHours() > 12 && mode === '12h' ? value.getHours() - 12 : value.getHours()));
  const [minuteInputValue, setMinuteInputValue] = useState(String(value.getMinutes()).padStart(2, '0'));
  const [hourInputFocused, setHourInputFocused] = useState(false);
  const [minuteInputFocused, setMinuteInputFocused] = useState(false);
  const hourInputRef = useRef<any>(null);
  const minuteInputRef = useRef<any>(null);
  
  const hours = value.getHours();
  const minutes = value.getMinutes();

  const displayHours = mode === '12h' ? (hours === 0 ? 12 : hours > 12 ? hours - 12 : hours) : hours;
  const ampm = mode === '12h' ? (hours >= 12 ? 'PM' : 'AM') : null;

  // Sync input values when time changes from external sources (like clock clicks)
  // Only update if the input is not currently focused
  useEffect(() => {
    if (!hourInputFocused) {
      setHourInputValue(String(displayHours));
    }
    if (!minuteInputFocused) {
      setMinuteInputValue(String(minutes).padStart(2, '0'));
    }
  }, [displayHours, minutes, hourInputFocused, minuteInputFocused]);

  const updateTime = useCallback((newHours: number, newMinutes: number) => {
    const newDate = new Date(value);
    newDate.setHours(newHours, newMinutes, 0);
    onChange(newDate);
  }, [value, onChange]);

  const handleHourClick = useCallback((hour: number) => {
    // Dismiss keyboard when interacting with clock
    hourInputRef.current?.blur?.();
    minuteInputRef.current?.blur?.();
    
    let hour24 = hour;
    if (mode === '12h') {
      const isPM = hours >= 12;
      if (hour === 12) hour24 = isPM ? 12 : 0;
      else hour24 = isPM ? hour + 12 : hour;
    }
    updateTime(hour24, minutes);
    setActiveSelection('minute');
  }, [mode, hours, minutes, updateTime]);

  const handleMinuteClick = useCallback((minute: number) => {
    // Dismiss keyboard when interacting with clock
    hourInputRef.current?.blur?.();
    minuteInputRef.current?.blur?.();
    
    updateTime(hours, minute);
  }, [hours, updateTime]);

  const toggleAmPm = useCallback(() => {
    if (mode === '12h') {
      const newHours = hours >= 12 ? hours - 12 : hours + 12;
      updateTime(newHours, minutes);
    }
  }, [mode, hours, minutes, updateTime]);

  const handleHourInputChange = useCallback((inputValue: string) => {
    setHourInputValue(inputValue);
    
    // Smart focus switching: if user types 2 or higher, focus on minutes
    if (mode === '12h' && parseInt(inputValue) >= 2 && inputValue.length >= 1) {
      minuteInputRef.current?.focus?.();
      setActiveSelection('minute');
    } else if (mode === '24h' && parseInt(inputValue) >= 3 && inputValue.length >= 1) {
      minuteInputRef.current?.focus?.();
      setActiveSelection('minute');
    }
    
    // Try to update time if value is valid
    const hour = parseInt(inputValue);
    if (!isNaN(hour) && hour >= 0) {
      let hour24 = hour;
      if (mode === '12h' && hour <= 12) {
        const isPM = hours >= 12;
        if (hour === 12) hour24 = isPM ? 12 : 0;
        else hour24 = isPM ? hour + 12 : hour;
      }
      if (hour24 <= 23) {
        updateTime(hour24, minutes);
      }
    }
  }, [mode, hours, minutes, updateTime]);

  const handleHourInputFocus = useCallback(() => {
    setHourInputFocused(true);
    setActiveSelection('hour');
  }, []);

  const handleHourInputBlur = useCallback(() => {
    setHourInputFocused(false);
    // Handle 0 -> 12 conversion for 12h mode
    const hour = parseInt(hourInputValue);
    if (!isNaN(hour)) {
      let hour24 = hour;
      if (mode === '12h') {
        const isPM = hours >= 12;
        if (hour === 0) hour24 = isPM ? 12 : 0;
        else if (hour <= 12) hour24 = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);
      }
      if (hour24 <= 23) {
        updateTime(hour24, minutes);
      }
    }
    setHourInputValue(String(displayHours));
  }, [hourInputValue, mode, hours, minutes, displayHours, updateTime]);

  const handleMinuteInputChange = useCallback((inputValue: string) => {
    setMinuteInputValue(inputValue);
    
    // Try to update time if value is valid
    const minute = parseInt(inputValue);
    if (!isNaN(minute) && minute >= 0 && minute <= 59) {
      updateTime(hours, minute);
    }
    
    // Auto-focus hour input if user deletes and field becomes empty
    if (inputValue === '') {
      hourInputRef.current?.focus?.();
      setActiveSelection('hour');
    }
  }, [hours, updateTime]);

  const handleMinuteInputFocus = useCallback(() => {
    setMinuteInputFocused(true);
    setActiveSelection('minute');
  }, []);

  const handleMinuteInputBlur = useCallback(() => {
    setMinuteInputFocused(false);
    setMinuteInputValue(String(minutes).padStart(2, '0'));
  }, [minutes]);

  return (
    <View style={[timePickerStyles.container, style]} testID={testID} data-testid={testID}>
      {/* Clock face */}
      {renderClock({
        activeSelection,
        hours,
        minutes,
        displayHours,
        mode,
        disabled,
        onHourClick: handleHourClick,
        onMinuteClick: handleMinuteClick,
      })}

      {/* Digital time display */}
      <View style={timePickerStyles.timeInputRow}>
        {renderTimeInput({
          type: 'hour',
          value: hourInputValue,
          onChangeText: handleHourInputChange,
          onFocus: handleHourInputFocus,
          onBlur: handleHourInputBlur,
          isActive: activeSelection === 'hour',
          disabled,
          inputRef: hourInputRef,
        })}
        
        <Text style={timePickerStyles.timeSeparator}>:</Text>
        
        {renderTimeInput({
          type: 'minute',
          value: minuteInputValue,
          onChangeText: handleMinuteInputChange,
          onFocus: handleMinuteInputFocus,
          onBlur: handleMinuteInputBlur,
          isActive: activeSelection === 'minute',
          disabled,
          inputRef: minuteInputRef,
        })}


        {mode === '12h' && ampm && (
          <Button
            variant="outlined"
            size="small"
            onPress={toggleAmPm}
            disabled={disabled}
            style={timePickerStyles.ampmButton}
          >
            {ampm}
          </Button>
        )}
      </View>
    </View>
  );
};