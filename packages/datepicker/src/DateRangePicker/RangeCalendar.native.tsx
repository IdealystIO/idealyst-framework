import React, { useState, useMemo } from 'react';
import { View, Text, Button } from '@idealyst/components';
import { TouchableOpacity } from 'react-native';
import { RangeCalendarProps, DateRange } from './types';
import { rangeCalendarStyles } from './RangeCalendar.styles';

export const RangeCalendar: React.FC<RangeCalendarProps> = ({
  value = {},
  onChange,
  minDate,
  maxDate,
  disabled = false,
  currentMonth: controlledCurrentMonth,
  onMonthChange,
  allowSameDay = true,
  maxDays,
  style,
  testID,
}) => {
  const [internalCurrentMonth, setInternalCurrentMonth] = useState(
    controlledCurrentMonth || value?.startDate || new Date()
  );
  const [selectingEnd, setSelectingEnd] = useState(false);

  const currentMonth = controlledCurrentMonth || internalCurrentMonth;

  const handleMonthChange = (newMonth: Date) => {
    if (onMonthChange) {
      onMonthChange(newMonth);
    } else {
      setInternalCurrentMonth(newMonth);
    }
  };

  const { monthStart, monthEnd, daysInMonth, startingDayOfWeek } = useMemo(() => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysInMonth = monthEnd.getDate();
    const startingDayOfWeek = monthStart.getDay();
    
    return { monthStart, monthEnd, daysInMonth, startingDayOfWeek };
  }, [currentMonth]);

  const isDateDisabled = (date: Date): boolean => {
    if (disabled) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isDateInRange = (date: Date): boolean => {
    const { startDate, endDate } = value || {};
    if (!startDate || !endDate) return false;
    return date > startDate && date < endDate;
  };

  const isDateRangeStart = (date: Date): boolean => {
    const { startDate } = value || {};
    if (!startDate) return false;
    return (
      date.getDate() === startDate.getDate() &&
      date.getMonth() === startDate.getMonth() &&
      date.getFullYear() === startDate.getFullYear()
    );
  };

  const isDateRangeEnd = (date: Date): boolean => {
    const { endDate } = value || {};
    if (!endDate) return false;
    return (
      date.getDate() === endDate.getDate() &&
      date.getMonth() === endDate.getMonth() &&
      date.getFullYear() === endDate.getFullYear()
    );
  };

  const isDateSelected = (date: Date): boolean => {
    return isDateRangeStart(date) || isDateRangeEnd(date);
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    const { startDate, endDate } = value || {};

    // If no range is selected or we're starting fresh
    if (!startDate || (startDate && endDate)) {
      onChange({ startDate: date, endDate: undefined });
      setSelectingEnd(true);
      return;
    }

    // If we have a start date but no end date
    if (startDate && !endDate) {
      let newStartDate = startDate;
      let newEndDate = date;

      // Swap if end date is before start date
      if (date < startDate) {
        newStartDate = date;
        newEndDate = startDate;
      }

      // Check if same day selection is allowed
      if (!allowSameDay && newStartDate.getTime() === newEndDate.getTime()) {
        return;
      }

      // Check max days constraint
      if (maxDays) {
        const daysDiff = Math.ceil((newEndDate.getTime() - newStartDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff > maxDays) {
          return;
        }
      }

      onChange({ startDate: newStartDate, endDate: newEndDate });
      setSelectingEnd(false);
    }
  };

  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    handleMonthChange(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    handleMonthChange(newMonth);
  };

  const handlePresetRange = (days: number) => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days - 1);
    
    onChange({ startDate, endDate });
    setSelectingEnd(false);
  };

  const clearRange = () => {
    onChange({});
    setSelectingEnd(false);
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Create calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    calendarDays.push(date);
  }

  rangeCalendarStyles.useVariants({});

  return (
    <View style={[rangeCalendarStyles.container, style]} testID={testID}>
      {/* Header */}
      <View style={rangeCalendarStyles.header}>
        <Button 
          variant="text" 
          size="small" 
          onPress={goToPreviousMonth} 
          disabled={disabled}
          style={rangeCalendarStyles.headerButton}
        >
          ←
        </Button>
        <Text weight="semibold">{monthName}</Text>
        <Button 
          variant="text" 
          size="small" 
          onPress={goToNextMonth} 
          disabled={disabled}
          style={rangeCalendarStyles.headerButton}
        >
          →
        </Button>
      </View>

      {/* Weekday headers */}
      <View style={rangeCalendarStyles.weekdayHeader}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <View key={day} style={rangeCalendarStyles.weekdayCell}>
            <Text style={rangeCalendarStyles.weekdayText}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={rangeCalendarStyles.calendarGrid}>
        {calendarDays.map((date, index) => (
          <View key={index} style={rangeCalendarStyles.dayCell}>
            {date && (
              <TouchableOpacity
                onPress={() => handleDateClick(date)}
                disabled={isDateDisabled(date)}
                style={[
                  rangeCalendarStyles.dayButton,
                  {
                    backgroundColor: isDateSelected(date) 
                      ? '#3b82f6'
                      : isDateInRange(date)
                      ? '#3b82f620'
                      : 'transparent',
                    opacity: isDateDisabled(date) ? 0.5 : 1,
                  }
                ]}
              >
                <Text 
                  style={{ 
                    color: isDateSelected(date) ? 'white' : 'black',
                    fontSize: 13,
                    fontWeight: isDateSelected(date) ? '600' : '400',
                  }}
                >
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Range presets */}
      <View style={rangeCalendarStyles.rangePresets}>
        <Button
          variant="text"
          size="small"
          onPress={() => handlePresetRange(7)}
          disabled={disabled}
          style={rangeCalendarStyles.presetButton}
        >
          Next 7 days
        </Button>
        <Button
          variant="text"
          size="small"
          onPress={() => handlePresetRange(30)}
          disabled={disabled}
          style={rangeCalendarStyles.presetButton}
        >
          Next 30 days
        </Button>
        <Button
          variant="outlined"
          size="small"
          onPress={clearRange}
          disabled={disabled}
          style={rangeCalendarStyles.clearButton}
        >
          Clear Range
        </Button>
      </View>
    </View>
  );
};