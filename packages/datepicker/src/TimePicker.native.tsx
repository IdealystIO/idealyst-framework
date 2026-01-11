import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { timePickerStyles } from './TimePicker.styles';
import type { TimePickerProps } from './types';

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  mode = '12h',
  minuteStep = 1,
  disabled = false,
  style,
}) => {
  // Get dynamic styles - call as functions for theme reactivity
  const styles = timePickerStyles;
  const timePickerStyle = (styles.timePicker as any)({ disabled });
  const timeColumnsStyle = (styles.timeColumns as any)({});
  const timeColumnStyle = (styles.timeColumn as any)({});
  const timeSeparatorStyle = (styles.timeSeparator as any)({});
  const separatorTextStyle = (styles.separatorText as any)({});
  const timeValueStyle = (styles.timeValue as any)({});
  const arrowButtonStyle = (styles.arrowButton as any)({ disabled });
  const periodButtonStyle = (styles.periodButton as any)({ disabled });
  const periodButtonTextStyle = (styles.periodButtonText as any)({});
  const iconStyle = (styles.iconColor as any)({});

  const currentDate = value || new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const is12Hour = mode === '12h';
  const isPM = hours >= 12;
  const displayHours = is12Hour ? (hours % 12 || 12) : hours;

  const updateTime = (newHours: number, newMinutes: number) => {
    const updated = new Date(currentDate);
    updated.setHours(newHours, newMinutes, 0, 0);
    onChange(updated);
  };

  const incrementHours = () => {
    const newHours = (hours + 1) % 24;
    updateTime(newHours, minutes);
  };

  const decrementHours = () => {
    const newHours = (hours - 1 + 24) % 24;
    updateTime(newHours, minutes);
  };

  const incrementMinutes = () => {
    const newMinutes = (minutes + minuteStep) % 60;
    const hourChange = minutes + minuteStep >= 60 ? 1 : 0;
    updateTime((hours + hourChange) % 24, newMinutes);
  };

  const decrementMinutes = () => {
    const newMinutes = (minutes - minuteStep + 60) % 60;
    const hourChange = minutes - minuteStep < 0 ? -1 : 0;
    updateTime((hours + hourChange + 24) % 24, newMinutes);
  };

  const togglePeriod = () => {
    const newHours = isPM ? hours - 12 : hours + 12;
    updateTime(newHours, minutes);
  };

  return (
    <View style={[timePickerStyle, style]}>
      <View style={timeColumnsStyle}>
        {/* Hours column */}
        <View style={timeColumnStyle}>
          <TouchableOpacity
            style={arrowButtonStyle}
            onPress={incrementHours}
            disabled={disabled}
          >
            <MaterialDesignIcons name="chevron-up" size={20} style={iconStyle} />
          </TouchableOpacity>
          <Text style={timeValueStyle}>
            {String(displayHours).padStart(2, '0')}
          </Text>
          <TouchableOpacity
            style={arrowButtonStyle}
            onPress={decrementHours}
            disabled={disabled}
          >
            <MaterialDesignIcons name="chevron-down" size={20} style={iconStyle} />
          </TouchableOpacity>
        </View>

        {/* Separator */}
        <View style={timeSeparatorStyle}>
          <Text style={separatorTextStyle}>:</Text>
        </View>

        {/* Minutes column */}
        <View style={timeColumnStyle}>
          <TouchableOpacity
            style={arrowButtonStyle}
            onPress={incrementMinutes}
            disabled={disabled}
          >
            <MaterialDesignIcons name="chevron-up" size={20} style={iconStyle} />
          </TouchableOpacity>
          <Text style={timeValueStyle}>
            {String(minutes).padStart(2, '0')}
          </Text>
          <TouchableOpacity
            style={arrowButtonStyle}
            onPress={decrementMinutes}
            disabled={disabled}
          >
            <MaterialDesignIcons name="chevron-down" size={20} style={iconStyle} />
          </TouchableOpacity>
        </View>

        {/* AM/PM toggle for 12-hour mode */}
        {is12Hour && (
          <View style={timeColumnStyle}>
            <TouchableOpacity
              style={periodButtonStyle}
              onPress={togglePeriod}
              disabled={disabled}
            >
              <Text style={periodButtonTextStyle}>
                {isPM ? 'PM' : 'AM'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
