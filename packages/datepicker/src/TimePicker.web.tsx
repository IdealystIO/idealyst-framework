import React from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { mdiChevronUp, mdiChevronDown } from '@mdi/js';
import { IconSvg } from './IconSvg.web';
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
  const styles = timePickerStyles;

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

  // Get dynamic styles
  const timePickerStyle = (styles.timePicker as any)({ disabled });
  const timeColumnsStyle = (styles.timeColumns as any)({});
  const timeColumnStyle = (styles.timeColumn as any)({});
  const timeSeparatorStyle = (styles.timeSeparator as any)({});
  const separatorTextStyle = (styles.separatorText as any)({});
  const timeValueStyle = (styles.timeValue as any)({});
  const arrowButtonStyle = (styles.arrowButton as any)({ disabled });
  const periodButtonStyle = (styles.periodButton as any)({ disabled });
  const periodButtonTextStyle = (styles.periodButtonText as any)({});
  const iconColorStyle = (styles.iconColor as any)({});

  // Get web props
  const timePickerProps = getWebProps([timePickerStyle, style as any]);
  const timeColumnsProps = getWebProps([timeColumnsStyle]);
  const timeColumnProps = getWebProps([timeColumnStyle]);

  return (
    <div {...timePickerProps}>
      <div {...timeColumnsProps}>
        {/* Hours column */}
        <div {...timeColumnProps}>
          <button
            style={arrowButtonStyle}
            onClick={incrementHours}
            disabled={disabled}
          >
            <IconSvg path={mdiChevronUp} size={20} color={iconColorStyle.color} />
          </button>
          <span style={timeValueStyle}>
            {String(displayHours).padStart(2, '0')}
          </span>
          <button
            style={arrowButtonStyle}
            onClick={decrementHours}
            disabled={disabled}
          >
            <IconSvg path={mdiChevronDown} size={20} color={iconColorStyle.color} />
          </button>
        </div>

        {/* Separator */}
        <div style={timeSeparatorStyle}>
          <span style={separatorTextStyle}>:</span>
        </div>

        {/* Minutes column */}
        <div {...timeColumnProps}>
          <button
            style={arrowButtonStyle}
            onClick={incrementMinutes}
            disabled={disabled}
          >
            <IconSvg path={mdiChevronUp} size={20} color={iconColorStyle.color} />
          </button>
          <span style={timeValueStyle}>
            {String(minutes).padStart(2, '0')}
          </span>
          <button
            style={arrowButtonStyle}
            onClick={decrementMinutes}
            disabled={disabled}
          >
            <IconSvg path={mdiChevronDown} size={20} color={iconColorStyle.color} />
          </button>
        </div>

        {/* AM/PM toggle for 12-hour mode */}
        {is12Hour && (
          <div {...timeColumnProps}>
            <button
              style={periodButtonStyle}
              onClick={togglePeriod}
              disabled={disabled}
            >
              <span style={periodButtonTextStyle}>
                {isPM ? 'PM' : 'AM'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
