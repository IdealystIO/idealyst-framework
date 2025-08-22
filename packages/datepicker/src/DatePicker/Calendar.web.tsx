import React, { useState, useEffect, useRef } from 'react';
import { CalendarProps } from './types';
import { CalendarHeader } from './CalendarHeader.web';
import { CalendarGrid } from './CalendarGrid.web';
import { CalendarOverlay } from './CalendarOverlay.web';

const calendarStyles = {
  container: {
    width: 256,
    position: 'relative' as const,
  },
};

export const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  currentMonth: controlledCurrentMonth,
  onMonthChange,
  style,
  testID,
}) => {
  const [internalCurrentMonth, setInternalCurrentMonth] = useState(
    controlledCurrentMonth || value || new Date()
  );
  const [overlayMode, setOverlayMode] = useState<'month' | 'year' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const isDateDisabled = (date: Date): boolean => {
    if (disabled) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const handleDateSelect = (date: Date) => {
    if (!isDateDisabled(date)) {
      onChange(date);
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
    
    // Update the selected date if one exists
    if (value) {
      const newDate = createDateWithDayAdjustment(
        currentMonth.getFullYear(),
        monthIndex,
        value.getDate()
      );
      if (!isDateDisabled(newDate)) {
        onChange(newDate);
      }
    }
  };

  const handleYearSelect = (year: number) => {
    const newMonth = new Date(year, currentMonth.getMonth(), 1);
    handleMonthChange(newMonth);
    
    // Update the selected date if one exists
    if (value) {
      const newDate = createDateWithDayAdjustment(
        year,
        currentMonth.getMonth(),
        value.getDate()
      );
      if (!isDateDisabled(newDate)) {
        onChange(newDate);
      }
    }
  };

  return (
    <div ref={containerRef} style={{ ...calendarStyles.container, ...style }} data-testid={testID}>
      <CalendarHeader
        currentMonth={currentMonth}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        onMonthClick={() => setOverlayMode('month')}
        onYearClick={() => setOverlayMode('year')}
        disabled={disabled}
      />

      <CalendarGrid
        currentMonth={currentMonth}
        selectedDate={value}
        onDateSelect={handleDateSelect}
        onMonthChange={handleMonthChange}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
      />

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