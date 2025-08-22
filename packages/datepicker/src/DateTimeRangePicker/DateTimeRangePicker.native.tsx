import React from 'react';
import { View, Text } from '@idealyst/components';
import { DateTimeRangePickerProps, DateTimeRange } from './types';
import { RangeCalendar } from '../DateRangePicker/RangeCalendar.native';
import { TimePicker } from '../DateTimePicker/TimePicker.native';
import { dateTimeRangePickerStyles } from './DateTimeRangePicker.styles';

const DateTimeRangePicker: React.FC<DateTimeRangePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  placeholder = 'Select date/time range',
  label,
  error,
  helperText,
  format = 'MM/dd/yyyy HH:mm',
  locale,
  size = 'medium',
  variant = 'outlined',
  timeMode = '12h',
  showSeconds = false,
  timeStep = 1,
  allowSameDay = true,
  maxDays,
  style,
  testID,
}) => {
  const formatDateTime = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    let timeString = '';
    if (timeMode === '12h') {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      timeString = showSeconds 
        ? `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`
        : `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    } else {
      timeString = showSeconds 
        ? `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`
        : `${String(hours).padStart(2, '0')}:${minutes}`;
    }
    
    return `${month}/${day}/${year} ${timeString}`;
  };

  const formatRange = (range: DateTimeRange): string => {
    if (!range.startDate) return '';
    if (!range.endDate) return `${formatDateTime(range.startDate)} - ...`;
    return `${formatDateTime(range.startDate)} - ${formatDateTime(range.endDate)}`;
  };

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

  const daysDifference = (range: DateTimeRange): number => {
    if (!range.startDate || !range.endDate) return 0;
    const diffTime = range.endDate.getTime() - range.startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const hoursDifference = (range: DateTimeRange): number => {
    if (!range.startDate || !range.endDate) return 0;
    const diffTime = range.endDate.getTime() - range.startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60));
  };

  dateTimeRangePickerStyles.useVariants({});

  return (
    <View style={[dateTimeRangePickerStyles.container, style]} testID={testID}>
      {label && (
        <Text style={dateTimeRangePickerStyles.label}>
          {label}
        </Text>
      )}
      
      <View style={dateTimeRangePickerStyles.picker}>
        {/* Selected Range Summary */}
        {value?.startDate && value?.endDate && (
          <View style={dateTimeRangePickerStyles.selectedRangeHeader}>
            <Text style={dateTimeRangePickerStyles.selectedRangeLabel}>
              Selected Range ({daysDifference(value)} days, {hoursDifference(value)} hours):
            </Text>
            <Text style={dateTimeRangePickerStyles.selectedRangeValue}>
              {formatRange(value)}
            </Text>
          </View>
        )}
        
        {/* Date Section */}
        <View style={dateTimeRangePickerStyles.section}>
          <Text style={dateTimeRangePickerStyles.sectionLabel}>Date Range</Text>
          <View style={dateTimeRangePickerStyles.sectionContent}>
            <RangeCalendar
              value={value || {}}
              onChange={handleDateRangeChange}
              minDate={minDate}
              maxDate={maxDate}
              disabled={disabled}
              allowSameDay={allowSameDay}
              maxDays={maxDays}
            />
          </View>
        </View>
        
        {/* Time Section */}
        {(value?.startDate || value?.endDate) && (
          <View style={dateTimeRangePickerStyles.section}>
            <Text style={dateTimeRangePickerStyles.sectionLabel}>Time Selection</Text>
            <View style={dateTimeRangePickerStyles.sectionContent}>
              <View style={dateTimeRangePickerStyles.timeSection}>
                {/* Start Time */}
                {value?.startDate && (
                  <View style={dateTimeRangePickerStyles.timeGroup}>
                    <Text style={dateTimeRangePickerStyles.timeGroupLabel}>Start Time</Text>
                    <TimePicker
                      value={value.startDate}
                      onChange={handleStartTimeChange}
                      disabled={disabled}
                      mode={timeMode}
                      showSeconds={showSeconds}
                      step={timeStep}
                    />
                  </View>
                )}
                
                {/* End Time */}
                {value?.endDate && (
                  <View style={dateTimeRangePickerStyles.timeGroup}>
                    <Text style={dateTimeRangePickerStyles.timeGroupLabel}>End Time</Text>
                    <TimePicker
                      value={value.endDate}
                      onChange={handleEndTimeChange}
                      disabled={disabled}
                      mode={timeMode}
                      showSeconds={showSeconds}
                      step={timeStep}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      </View>

      {error && (
        <Text style={dateTimeRangePickerStyles.errorText}>
          {error}
        </Text>
      )}
      
      {helperText && !error && (
        <Text style={dateTimeRangePickerStyles.helperText}>
          {helperText}
        </Text>
      )}
    </View>
  );
};

export default DateTimeRangePicker;