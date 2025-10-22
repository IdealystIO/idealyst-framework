import React, { useMemo } from 'react';
import { Text, Button, View } from '@idealyst/components';
import { calendarGridStyles } from './CalendarGrid.styles';

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange?: (month: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}


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
      <View style={calendarGridStyles.weekdayHeader}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <View key={day} style={calendarGridStyles.weekdayCell}>
            <Text style={calendarGridStyles.weekdayText}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View 
        style={[calendarGridStyles.calendarGrid, { gridTemplateRows: `repeat(${weekCount}, 1fr)` }]}
      >
        {calendarDays.map((dayData, index) => {
          const { date, isCurrentMonth } = dayData;
          const buttonStyle = [
            calendarGridStyles.dayButton,
            { opacity: isCurrentMonth ? 1 : 0.4 }
          ];

          return (
            <View key={index} style={calendarGridStyles.dayCell}>
              <Button
                variant={isDateSelected(date) ? 'contained' : 'text'}
                intent={isDateSelected(date) ? 'primary' : 'neutral'}
                disabled={isDateDisabled(date)}
                onPress={() => handleDateSelect(date)}
                size="sm"
                style={buttonStyle}
              >
                {date.getDate()}
              </Button>
            </View>
          );
        })}
      </View>
    </>
  );
};