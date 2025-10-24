import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, Button } from '@idealyst/components';
import { getWebProps } from 'react-native-unistyles/web';
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
  const containerRef = useRef<View>(null);

  const currentMonth = controlledCurrentMonth || internalCurrentMonth;

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOverlayMode(null);
      }
    };

    if (overlayMode) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [overlayMode]);

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
  
  const containerProps = getWebProps([rangeCalendarStyles.container, style]);
  const headerProps = getWebProps([rangeCalendarStyles.header]);
  const headerTitleProps = getWebProps([rangeCalendarStyles.headerTitle]);
  
  return (
    <div {...containerProps} data-testid={testID} ref={containerRef}>
      {/* Header */}
      <div {...headerProps}>
        <Button
          type="text"
          size="sm"
          onPress={goToPreviousMonth}
          disabled={disabled}
          style={getWebProps([rangeCalendarStyles.headerButton]).style}
        >
          ←
        </Button>

        <div {...headerTitleProps} style={{ display: 'flex', gap: '8px' }}>
          <Button
            type="text"
            size="sm"
            onPress={() => setOverlayMode('month')}
            disabled={disabled}
            style={{ padding: '4px 8px' }}
          >
            <Text weight="semibold">{currentMonth.toLocaleDateString('en-US', { month: 'long' })}</Text>
          </Button>
          <Button
            type="text"
            size="sm"
            onPress={() => setOverlayMode('year')}
            disabled={disabled}
            style={{ padding: '4px 8px' }}
          >
            <Text weight="semibold">{currentMonth.getFullYear()}</Text>
          </Button>
        </div>

        <Button
          type="text"
          size="sm"
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
        {calendarDays.map((dayInfo, index) => (
          <div key={index} {...getWebProps([rangeCalendarStyles.dayCell])}>
            {dayInfo && (
              <Button
                type="text"
                disabled={isDateDisabled(dayInfo.date)}
                onPress={() => handleDateClick(dayInfo.date)}
                size="sm"
                style={{
                  ...getWebProps([rangeCalendarStyles.dayButton]).style,
                  backgroundColor: isDateSelected(dayInfo.date) 
                    ? '#3b82f6'
                    : isDateInRange(dayInfo.date)
                    ? '#3b82f620'
                    : 'transparent',
                  color: isDateSelected(dayInfo.date) ? 'white' : dayInfo.isCurrentMonth ? 'black' : '#9ca3af',
                  fontWeight: isDateSelected(dayInfo.date) ? '600' : '400',
                  borderRadius: isDateRangeStart(dayInfo.date)
                    ? '6px 0 0 6px'
                    : isDateRangeEnd(dayInfo.date)
                    ? '0 6px 6px 0'
                    : isDateInRange(dayInfo.date)
                    ? '0'
                    : '6px',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  minWidth: '36px',
                  minHeight: '36px',
                  opacity: dayInfo.isCurrentMonth ? 1 : 0.5,
                }}
              >
                <div style={{ textAlign: 'center', fontSize: '13px' }}>
                  {dayInfo.date.getDate()}
                </div>
                {(() => {
                  const timeInfo = getDateTimeInfo(dayInfo.date);
                  if (timeInfo) {
                    return (
                      <div
                        style={{ 
                          color: isDateSelected(dayInfo.date) ? 'white' : '#666',
                          fontSize: '7px',
                          fontWeight: '500',
                          textAlign: 'center',
                          lineHeight: '1',
                          marginTop: '1px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {timeInfo.time}
                      </div>
                    );
                  }
                  return null;
                })()}
              </Button>
            )}
          </div>
        ))}
      </div>

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

    </div>
  );
};