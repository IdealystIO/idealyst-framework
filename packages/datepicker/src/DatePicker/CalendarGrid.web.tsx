import React, { useMemo } from 'react';
import { Button } from '@idealyst/components';

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange?: (month: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

const gridStyles = {
  weekdayHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 2,
    marginBottom: 8,
  },
  weekdayCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#6b7280',
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 2,
    marginBottom: 8,
    height: 192, // Fixed height for consistency
  },
  dayCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 0, // Allow compression
  },
  dayButton: {
    width: '100%',
    height: '100%',
    maxWidth: 36,
    minWidth: 24, // Reduced min width for compression
    minHeight: 24, // Reduced min height for compression
    padding: 0,
    borderRadius: 4, // Slightly smaller border radius
    fontSize: 13,
  },
};

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  selectedDate,
  onDateSelect,
  onMonthChange,
  minDate,
  maxDate,
  disabled = false,
}) => {
  const { calendarDays, startingDayOfWeek, daysInMonth, weekCount } = useMemo(() => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysInMonth = monthEnd.getDate();
    const startingDayOfWeek = monthStart.getDay();
    
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
    
    // Add next month days only to complete partial weeks, never add full weeks of next month
    const currentLength = calendarDays.length;
    const weeksNeeded = Math.ceil(currentLength / 7);
    const maxDays = weeksNeeded * 7;
    
    // Only add next month days to fill partial week
    const remainingDays = maxDays - currentLength;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day);
      calendarDays.push({ date, isCurrentMonth: false });
    }
    
    const weekCount = Math.ceil(calendarDays.length / 7);
    return { calendarDays, startingDayOfWeek, daysInMonth, weekCount };
  }, [currentMonth]);

  const isDateDisabled = (date: Date): boolean => {
    if (disabled) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date): boolean => {
    return (
      date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear()
    );
  };

  const handleDateSelect = (date: Date) => {
    // If selecting a date from previous/next month, change the current month first
    if (!isCurrentMonth(date) && onMonthChange) {
      const newMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      onMonthChange(newMonth);
    }
    onDateSelect(date);
  };

  return (
    <>
      {/* Weekday headers */}
      <div style={gridStyles.weekdayHeader}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} style={gridStyles.weekdayCell}>
            <div style={gridStyles.weekdayText}>
              {day}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{
        ...gridStyles.calendarGrid,
        gridTemplateRows: `repeat(${weekCount}, 1fr)`
      }}>
        {calendarDays.map((dayData, index) => {
          const { date, isCurrentMonth } = dayData;
          const buttonStyle = {
            ...gridStyles.dayButton,
            opacity: isCurrentMonth ? 1 : 0.4,
          };

          return (
            <div key={index} style={gridStyles.dayCell}>
              <Button
                variant={isDateSelected(date) ? 'contained' : 'text'}
                intent={isDateSelected(date) ? 'primary' : 'neutral'}
                disabled={isDateDisabled(date)}
                onPress={() => handleDateSelect(date)}
                size="small"
                style={buttonStyle}
              >
                {date.getDate()}
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
};