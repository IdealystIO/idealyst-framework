import React from 'react';
import { View, Text, Button } from '@idealyst/components';
import { TimePickerProps } from './types';
import { timePickerStyles } from './TimePicker.styles';

export const TimePicker: React.FC<TimePickerProps> = ({
  value = new Date(),
  onChange,
  disabled = false,
  mode = '12h',
  showSeconds = false,
  step = 1,
  style,
  testID,
}) => {
  const hours = value.getHours();
  const minutes = value.getMinutes();
  const seconds = value.getSeconds();

  const displayHours = mode === '12h' ? (hours === 0 ? 12 : hours > 12 ? hours - 12 : hours) : hours;
  const ampm = mode === '12h' ? (hours >= 12 ? 'PM' : 'AM') : null;

  const updateTime = (newHours: number, newMinutes: number, newSeconds?: number) => {
    const newDate = new Date(value);
    newDate.setHours(newHours, newMinutes, newSeconds || 0);
    onChange(newDate);
  };

  const handleHourChange = (delta: number) => {
    let newHours = hours + delta;
    if (mode === '12h') {
      if (newHours < 0) newHours = 23;
      if (newHours > 23) newHours = 0;
    } else {
      if (newHours < 0) newHours = 23;
      if (newHours > 23) newHours = 0;
    }
    updateTime(newHours, minutes, seconds);
  };

  const handleMinuteChange = (delta: number) => {
    let newMinutes = minutes + (delta * step);
    let newHours = hours;
    
    if (newMinutes < 0) {
      newMinutes = 60 + newMinutes;
      newHours = hours - 1;
      if (newHours < 0) newHours = 23;
    } else if (newMinutes >= 60) {
      newMinutes = newMinutes - 60;
      newHours = hours + 1;
      if (newHours > 23) newHours = 0;
    }
    
    updateTime(newHours, newMinutes, seconds);
  };

  const handleSecondChange = (delta: number) => {
    let newSeconds = seconds + delta;
    let newMinutes = minutes;
    let newHours = hours;
    
    if (newSeconds < 0) {
      newSeconds = 59;
      newMinutes = minutes - 1;
      if (newMinutes < 0) {
        newMinutes = 59;
        newHours = hours - 1;
        if (newHours < 0) newHours = 23;
      }
    } else if (newSeconds >= 60) {
      newSeconds = 0;
      newMinutes = minutes + 1;
      if (newMinutes >= 60) {
        newMinutes = 0;
        newHours = hours + 1;
        if (newHours > 23) newHours = 0;
      }
    }
    
    updateTime(newHours, newMinutes, newSeconds);
  };

  const toggleAmPm = () => {
    if (mode === '12h') {
      const newHours = hours >= 12 ? hours - 12 : hours + 12;
      updateTime(newHours, minutes, seconds);
    }
  };

  timePickerStyles.useVariants({});

  return (
    <View style={[timePickerStyles.container, style]} testID={testID}>
      {/* Hours */}
      <View style={timePickerStyles.timeSection}>
        <View style={timePickerStyles.stepperContainer}>
          <Button
            variant="text"
            size="small"
            onPress={() => handleHourChange(1)}
            disabled={disabled}
            style={timePickerStyles.stepperButton}
          >
            <Text style={timePickerStyles.stepperText}>▲</Text>
          </Button>
          <View style={timePickerStyles.timeInput}>
            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600' }}>
              {String(displayHours).padStart(2, '0')}
            </Text>
          </View>
          <Button
            variant="text"
            size="small"
            onPress={() => handleHourChange(-1)}
            disabled={disabled}
            style={timePickerStyles.stepperButton}
          >
            <Text style={timePickerStyles.stepperText}>▼</Text>
          </Button>
        </View>
      </View>

      {/* Separator */}
      <Text style={timePickerStyles.timeSeparator}>:</Text>

      {/* Minutes */}
      <View style={timePickerStyles.timeSection}>
        <View style={timePickerStyles.stepperContainer}>
          <Button
            variant="text"
            size="small"
            onPress={() => handleMinuteChange(1)}
            disabled={disabled}
            style={timePickerStyles.stepperButton}
          >
            <Text style={timePickerStyles.stepperText}>▲</Text>
          </Button>
          <View style={timePickerStyles.timeInput}>
            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600' }}>
              {String(minutes).padStart(2, '0')}
            </Text>
          </View>
          <Button
            variant="text"
            size="small"
            onPress={() => handleMinuteChange(-1)}
            disabled={disabled}
            style={timePickerStyles.stepperButton}
          >
            <Text style={timePickerStyles.stepperText}>▼</Text>
          </Button>
        </View>
      </View>

      {/* Seconds */}
      {showSeconds && (
        <>
          <Text style={timePickerStyles.timeSeparator}>:</Text>
          <View style={timePickerStyles.timeSection}>
            <View style={timePickerStyles.stepperContainer}>
              <Button
                variant="text"
                size="small"
                onPress={() => handleSecondChange(1)}
                disabled={disabled}
                style={timePickerStyles.stepperButton}
              >
                <Text style={timePickerStyles.stepperText}>▲</Text>
              </Button>
              <View style={timePickerStyles.timeInput}>
                <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600' }}>
                  {String(seconds).padStart(2, '0')}
                </Text>
              </View>
              <Button
                variant="text"
                size="small"
                onPress={() => handleSecondChange(-1)}
                disabled={disabled}
                style={timePickerStyles.stepperButton}
              >
                <Text style={timePickerStyles.stepperText}>▼</Text>
              </Button>
            </View>
          </View>
        </>
      )}

      {/* AM/PM */}
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
  );
};