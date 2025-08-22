import React, { useState, useMemo } from 'react';
import { View, Text, Button } from '@idealyst/components';
import { getWebProps } from 'react-native-unistyles/web';
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
  
  const containerProps = getWebProps([rangeCalendarStyles.container, style]);
  const headerProps = getWebProps([rangeCalendarStyles.header]);
  const headerTitleProps = getWebProps([rangeCalendarStyles.headerTitle]);
  
  return (
    <div {...containerProps} data-testid={testID}>
      {/* Header */}
      <div {...headerProps}>
        <Button 
          variant="text" 
          size="small" 
          onPress={goToPreviousMonth} 
          disabled={disabled}
          style={getWebProps([rangeCalendarStyles.headerButton]).style}
        >
          ←
        </Button>
        
        <div {...headerTitleProps}>
          <Text weight="semibold">{monthName}</Text>
        </div>
        
        <Button 
          variant="text" 
          size="small" 
          onPress={goToNextMonth} 
          disabled={disabled}
          style={getWebProps([rangeCalendarStyles.headerButton]).style}
        >
          →
        </Button>
      </div>

      {/* Weekday headers */}
      <div {...getWebProps([rangeCalendarStyles.weekdayHeader])}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} {...getWebProps([rangeCalendarStyles.weekdayCell])}>
            <div {...getWebProps([rangeCalendarStyles.weekdayText])}>
              {day}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div {...getWebProps([rangeCalendarStyles.calendarGrid])}>
        {calendarDays.map((date, index) => (
          <div key={index} {...getWebProps([rangeCalendarStyles.dayCell])}>
            {date && (
              <Button
                variant="text"
                disabled={isDateDisabled(date)}
                onPress={() => handleDateClick(date)}
                size="small"
                style={{
                  ...getWebProps([rangeCalendarStyles.dayButton]).style,
                  backgroundColor: isDateSelected(date) 
                    ? '#3b82f6'
                    : isDateInRange(date)
                    ? '#3b82f620'
                    : 'transparent',
                  color: isDateSelected(date) ? 'white' : 'black',
                  fontWeight: isDateSelected(date) ? '600' : '400',
                  borderRadius: isDateRangeStart(date)
                    ? '6px 0 0 6px'
                    : isDateRangeEnd(date)
                    ? '0 6px 6px 0'
                    : isDateInRange(date)
                    ? '0'
                    : '6px',
                }}
              >
                {date.getDate()}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Range presets */}
      <div {...getWebProps([rangeCalendarStyles.rangePresets])}>
        <Button
          variant="text"
          size="small"
          onPress={() => handlePresetRange(7)}
          disabled={disabled}
          style={getWebProps([rangeCalendarStyles.presetButton]).style}
        >
          Next 7 days
        </Button>
        <Button
          variant="text"
          size="small"
          onPress={() => handlePresetRange(30)}
          disabled={disabled}
          style={getWebProps([rangeCalendarStyles.presetButton]).style}
        >
          Next 30 days
        </Button>
        <Button
          variant="outlined"
          size="small"
          onPress={clearRange}
          disabled={disabled}
          style={getWebProps([rangeCalendarStyles.clearButton]).style}
        >
          Clear Range
        </Button>
      </div>
    </div>
  );
};