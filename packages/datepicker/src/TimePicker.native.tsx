import React from 'react';
import { View } from 'react-native';
import { Text, Button, Icon } from '@idealyst/components';
import { datePickerStyles } from './styles';
import type { TimePickerProps } from './types';

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  mode = '12h',
  minuteStep = 1,
  disabled = false,
  style,
}) => {
  datePickerStyles.useVariants({ disabled });

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
    <View style={[datePickerStyles.timePicker, style]}>
      <View style={datePickerStyles.timeColumns}>
        {/* Hours column */}
        <View style={datePickerStyles.timeColumn}>
          <Button type="text" size="sm" onPress={incrementHours} disabled={disabled}>
            <Icon name="chevron-up" size={20} />
          </Button>
          <Text typography="h3" weight="semibold">
            {String(displayHours).padStart(2, '0')}
          </Text>
          <Button type="text" size="sm" onPress={decrementHours} disabled={disabled}>
            <Icon name="chevron-down" size={20} />
          </Button>
        </View>

        {/* Separator */}
        <View style={datePickerStyles.timeSeparator}>
          <Text typography="h3" weight="semibold">:</Text>
        </View>

        {/* Minutes column */}
        <View style={datePickerStyles.timeColumn}>
          <Button type="text" size="sm" onPress={incrementMinutes} disabled={disabled}>
            <Icon name="chevron-up" size={20} />
          </Button>
          <Text typography="h3" weight="semibold">
            {String(minutes).padStart(2, '0')}
          </Text>
          <Button type="text" size="sm" onPress={decrementMinutes} disabled={disabled}>
            <Icon name="chevron-down" size={20} />
          </Button>
        </View>

        {/* AM/PM toggle for 12-hour mode */}
        {is12Hour && (
          <View style={datePickerStyles.timeColumn}>
            <Button
              type="outlined"
              size="sm"
              onPress={togglePeriod}
              disabled={disabled}
            >
              {isPM ? 'PM' : 'AM'}
            </Button>
          </View>
        )}
      </View>
    </View>
  );
};
