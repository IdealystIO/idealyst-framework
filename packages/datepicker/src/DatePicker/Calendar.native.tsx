import React, { useState, useMemo } from 'react';
import { View, Text, Button } from '@idealyst/components';
import { TouchableOpacity } from 'react-native';
import { CalendarProps } from './types';
import { calendarStyles } from './Calendar.styles';

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

  const isDateSelected = (date: Date): boolean => {
    if (!value) return false;
    return (
      date.getDate() === value.getDate() &&
      date.getMonth() === value.getMonth() &&
      date.getFullYear() === value.getFullYear()
    );
  };

  const handleDateClick = (date: Date) => {
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

  // Use Unistyles
  calendarStyles.useVariants({});

  return (
    <View style={[calendarStyles.container, style]} testID={testID}>
      {/* Header */}
      <View style={calendarStyles.header}>
        <Button 
          variant="text" 
          size="small" 
          onPress={goToPreviousMonth} 
          disabled={disabled}
          style={calendarStyles.headerButton}
        >
          ←
        </Button>
        <Text weight="semibold">{monthName}</Text>
        <Button 
          variant="text" 
          size="small" 
          onPress={goToNextMonth} 
          disabled={disabled}
          style={calendarStyles.headerButton}
        >
          →
        </Button>
      </View>

      {/* Weekday headers */}
      <View style={calendarStyles.weekdayHeader}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <View key={day} style={calendarStyles.weekdayCell}>
            <Text style={calendarStyles.weekdayText}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={calendarStyles.calendarGrid}>
        {calendarDays.map((date, index) => (
          <View key={index} style={calendarStyles.dayCell}>
            {date && (
              <TouchableOpacity
                onPress={() => handleDateClick(date)}
                disabled={isDateDisabled(date)}
                style={[
                  calendarStyles.dayButton,
                  {
                    backgroundColor: isDateSelected(date) ? '#3b82f6' : 'transparent',
                    opacity: isDateDisabled(date) ? 0.5 : 1,
                  }
                ]}
              >
                <Text 
                  style={{ 
                    color: isDateSelected(date) ? 'white' : 'black',
                    fontSize: 13,
                  }}
                >
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};