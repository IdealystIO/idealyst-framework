import React, { useState, useMemo } from 'react';
import { View, Text, Button } from '@idealyst/components';
import { TouchableOpacity } from 'react-native';
import { RangeCalendarProps, DateRange } from './types';
import { rangeCalendarStyles } from './RangeCalendar.styles';
import { CalendarOverlay } from '../primitives/CalendarOverlay';

export const RangeCalendar: React.FC<RangeCalendarProps> = ({
  value = {},
  onChange,
  onDateSelected,
  showTimes = false,
  timeMode = '12h',
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
  const [overlayMode, setOverlayMode] = useState<'month' | 'year' | null>(null);

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

  const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    if (timeMode === '12h') {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${hours}:${minutes}${ampm}`;
    } else {
      return `${String(hours).padStart(2, '0')}:${minutes}`;
    }
  };

  const getDateTimeInfo = (date: Date) => {
    if (!showTimes) return null;
    
    const isStart = isDateRangeStart(date);
    const isEnd = isDateRangeEnd(date);
    
    if (isStart && value?.startDate) {
      return { type: 'start', time: formatTime(value.startDate) };
    }
    if (isEnd && value?.endDate) {
      return { type: 'end', time: formatTime(value.endDate) };
    }
    return null;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    const { startDate, endDate } = value || {};

    // If no range is selected or we're starting fresh
    if (!startDate || (startDate && endDate)) {
      onChange({ startDate: date, endDate: undefined });
      setSelectingEnd(true);
      onDateSelected?.('start');
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
      onDateSelected?.('end');
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

  const createDateWithDayAdjustment = (year: number, month: number, day: number): Date => {
    // Get the last day of the target month
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    // Use the smaller of the requested day or the last day of the month
    const adjustedDay = Math.min(day, lastDayOfMonth);
    return new Date(year, month, adjustedDay);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newMonth = new Date(currentMonth.getFullYear(), monthIndex, 1);
    handleMonthChange(newMonth);
    setOverlayMode(null);
  };

  const handleYearSelect = (year: number) => {
    const newMonth = new Date(year, currentMonth.getMonth(), 1);
    handleMonthChange(newMonth);
    setOverlayMode(null);
  };


  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Create calendar grid
  const calendarDays = [];
  
  // Add previous month days to fill start of week
  const prevMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
  const prevMonthDaysToShow = startingDayOfWeek;
  for (let i = prevMonthDaysToShow - 1; i >= 0; i--) {
    const day = prevMonthEnd.getDate() - i;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, day);
    calendarDays.push({ date, isCurrentMonth: false });
  }
  
  // Add days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    calendarDays.push({ date, isCurrentMonth: true });
  }
  
  // Add next month days to complete partial weeks
  const currentLength = calendarDays.length;
  const weeksNeeded = Math.ceil(currentLength / 7);
  const totalCalendarDays = weeksNeeded * 7;
  
  const remainingDays = totalCalendarDays - currentLength;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day);
    calendarDays.push({ date, isCurrentMonth: false });
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
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button
            variant="text"
            size="small"
            onPress={() => setOverlayMode('month')}
            disabled={disabled}
            style={{ padding: 4 }}
          >
            <Text weight="semibold">{currentMonth.toLocaleDateString('en-US', { month: 'long' })}</Text>
          </Button>
          <Button
            variant="text"
            size="small"
            onPress={() => setOverlayMode('year')}
            disabled={disabled}
            style={{ padding: 4 }}
          >
            <Text weight="semibold">{currentMonth.getFullYear()}</Text>
          </Button>
        </View>
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
        {calendarDays.map((dayInfo, index) => (
          <View key={index} style={rangeCalendarStyles.dayCell}>
            {dayInfo && (
              <TouchableOpacity
                onPress={() => handleDateClick(dayInfo.date)}
                disabled={isDateDisabled(dayInfo.date)}
                style={[
                  rangeCalendarStyles.dayButton,
                  {
                    backgroundColor: isDateSelected(dayInfo.date) 
                      ? '#3b82f6'
                      : isDateInRange(dayInfo.date)
                      ? '#3b82f620'
                      : 'transparent',
                    opacity: isDateDisabled(dayInfo.date) ? 0.5 : dayInfo.isCurrentMonth ? 1 : 0.5,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    flex: 1,
                    aspectRatio: 1,
                  }
                ]}
              >
                <Text 
                  style={{ 
                    color: isDateSelected(dayInfo.date) ? 'white' : dayInfo.isCurrentMonth ? 'black' : '#9ca3af',
                    fontSize: 13,
                    fontWeight: isDateSelected(dayInfo.date) ? '600' : '400',
                    textAlign: 'center',
                  }}
                >
                  {dayInfo.date.getDate()}
                </Text>
                {(() => {
                  const timeInfo = getDateTimeInfo(dayInfo.date);
                  if (timeInfo) {
                    return (
                      <Text 
                        style={{ 
                          color: isDateSelected(dayInfo.date) ? 'white' : '#666',
                          fontSize: 7,
                          fontWeight: '500',
                          textAlign: 'center',
                          marginTop: 1,
                          width: '100%',
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {timeInfo.time}
                      </Text>
                    );
                  }
                  return null;
                })()}
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Overlay for month/year selection */}
      {overlayMode && (
        <CalendarOverlay
          mode={overlayMode}
          currentMonth={currentMonth.getMonth()}
          currentYear={currentMonth.getFullYear()}
          onMonthSelect={handleMonthSelect}
          onYearSelect={handleYearSelect}
          onClose={() => setOverlayMode(null)}
          disabled={disabled}
        />
      )}

    </View>
  );
};