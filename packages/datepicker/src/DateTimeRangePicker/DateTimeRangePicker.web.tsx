import React from 'react';
import { View, Text } from '@idealyst/components';
import { getWebProps } from 'react-native-unistyles/web';
import { DateTimeRangePickerProps, DateTimeRange } from './types';
import { RangeCalendar } from '../DateRangePicker/RangeCalendar.web';
import { TimePicker } from '../DateTimePicker/TimePicker.web';
import { dateTimeRangePickerStyles } from './DateTimeRangePicker.styles';

const DateTimeRangePicker: React.FC<DateTimeRangePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  timeMode = '12h',
  showSeconds = false,
  timeStep = 1,
  allowSameDay = true,
  maxDays,
  style,
  testID,
}) => {

  const handleDateRangeChange = (newRange: { startDate?: Date; endDate?: Date }) => {
    // Preserve existing times when date changes
    const updatedRange: DateTimeRange = {};
    
    if (newRange.startDate) {
      updatedRange.startDate = new Date(newRange.startDate);
      if (value?.startDate) {
        updatedRange.startDate.setHours(
          value.startDate.getHours(),
          value.startDate.getMinutes(),
          value.startDate.getSeconds()
        );
      }
    }
    
    if (newRange.endDate) {
      updatedRange.endDate = new Date(newRange.endDate);
      if (value?.endDate) {
        updatedRange.endDate.setHours(
          value.endDate.getHours(),
          value.endDate.getMinutes(),
          value.endDate.getSeconds()
        );
      }
    }

    onChange(updatedRange.startDate || updatedRange.endDate ? updatedRange : null);
  };

  const handleStartTimeChange = (newTime: Date) => {
    if (value?.startDate) {
      const updatedDate = new Date(value.startDate);
      updatedDate.setHours(newTime.getHours(), newTime.getMinutes(), newTime.getSeconds());
      onChange({ ...value, startDate: updatedDate });
    }
  };

  const handleEndTimeChange = (newTime: Date) => {
    if (value?.endDate) {
      const updatedDate = new Date(value.endDate);
      updatedDate.setHours(newTime.getHours(), newTime.getMinutes(), newTime.getSeconds());
      onChange({ ...value, endDate: updatedDate });
    }
  };


  dateTimeRangePickerStyles.useVariants({});
  
  const containerProps = getWebProps([dateTimeRangePickerStyles.container, style]);
  const sectionProps = getWebProps([dateTimeRangePickerStyles.section]);
  const sectionLabelProps = getWebProps([dateTimeRangePickerStyles.sectionLabel]);
  const sectionContentProps = getWebProps([dateTimeRangePickerStyles.sectionContent]);
  const timeSectionProps = getWebProps([dateTimeRangePickerStyles.timeSection]);
  const timeGroupProps = getWebProps([dateTimeRangePickerStyles.timeGroup]);
  const timeGroupLabelProps = getWebProps([dateTimeRangePickerStyles.timeGroupLabel]);

  return (
    <div {...containerProps} data-testid={testID}>
      {/* Date Section */}
      <div {...sectionProps}>
        <div {...sectionLabelProps}>Date Range</div>
        <div {...sectionContentProps}>
          <RangeCalendar
            value={value || {}}
            onChange={handleDateRangeChange}
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
            allowSameDay={allowSameDay}
            maxDays={maxDays}
          />
        </div>
      </div>
      
      {/* Time Section */}
      {(value?.startDate || value?.endDate) && (
        <div {...sectionProps}>
          <div {...sectionLabelProps}>Time Selection</div>
          <div {...sectionContentProps}>
            <div {...timeSectionProps}>
              {/* Start Time */}
              {value?.startDate && (
                <div {...timeGroupProps}>
                  <div {...timeGroupLabelProps}>Start Time</div>
                  <TimePicker
                    value={value.startDate}
                    onChange={handleStartTimeChange}
                    disabled={disabled}
                    mode={timeMode}
                    showSeconds={showSeconds}
                    step={timeStep}
                  />
                </div>
              )}
              
              {/* End Time */}
              {value?.endDate && (
                <div {...timeGroupProps}>
                  <div {...timeGroupLabelProps}>End Time</div>
                  <TimePicker
                    value={value.endDate}
                    onChange={handleEndTimeChange}
                    disabled={disabled}
                    mode={timeMode}
                    showSeconds={showSeconds}
                    step={timeStep}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimeRangePicker;