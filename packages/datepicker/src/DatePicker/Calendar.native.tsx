import React, { useState, useMemo, useCallback, memo, useRef } from 'react';
import { View, Text, Button } from '@idealyst/components';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { CalendarProps } from './types';
import { calendarStyles } from './Calendar.styles';

// Memoized day cell component for better performance
const DayCell = memo(({ 
  date, 
  isSelected, 
  isDisabled, 
  onPress,
  dayButtonStyle,
  textColorSelected,
  textColorDefault
}: {
  date: Date | null;
  isSelected: boolean;
  isDisabled: boolean;
  onPress: (date: Date) => void;
  dayButtonStyle: any;
  textColorSelected: string;
  textColorDefault: string;
}) => {
  const handlePress = useCallback(() => {
    if (date && !isDisabled) {
      onPress(date);
    }
  }, [date, isDisabled, onPress]);

  if (!date) {
    return <View style={calendarStyles.dayCell} />;
  }

  return (
    <View style={calendarStyles.dayCell}>
      <TouchableOpacity
        onPressIn={handlePress}
        disabled={isDisabled}
        style={[
          dayButtonStyle,
          isSelected && styles.selectedButton,
          isDisabled && styles.disabledButton
        ]}
      >
        <Text 
          style={[
            styles.dayText,
            { color: isSelected ? textColorSelected : textColorDefault }
          ]}
        >
          {date.getDate()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  // Only re-render if the relevant props actually changed
  return (
    prevProps.date === nextProps.date &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isDisabled === nextProps.isDisabled &&
    prevProps.onPress === nextProps.onPress
  );
});

DayCell.displayName = 'DayCell';

export const Calendar: React.FC<CalendarProps> = memo(({
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

  // Store latest callbacks in refs to avoid recreating functions
  const onChangeRef = useRef(onChange);
  const onMonthChangeRef = useRef(onMonthChange);
  onChangeRef.current = onChange;
  onMonthChangeRef.current = onMonthChange;

  const handleMonthChange = useCallback((newMonth: Date) => {
    if (onMonthChangeRef.current) {
      onMonthChangeRef.current(newMonth);
    } else {
      setInternalCurrentMonth(newMonth);
    }
  }, []);

  // Memoize calendar data calculation with selection state
  const { calendarDays, monthName } = useMemo(() => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysInMonth = monthEnd.getDate();
    const startingDayOfWeek = monthStart.getDay();
    
    // Pre-calculate all calendar days with their states
    const days: Array<{
      date: Date | null;
      isSelected: boolean;
      isDisabled: boolean;
      key: string;
    }> = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({
        date: null,
        isSelected: false,
        isDisabled: false,
        key: `empty-${i}`
      });
    }
    
    // Add days of the month with pre-calculated states
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateTime = date.getTime();
      
      // Pre-calculate selection state
      const isSelected = value ? (
        date.getDate() === value.getDate() &&
        date.getMonth() === value.getMonth() &&
        date.getFullYear() === value.getFullYear()
      ) : false;
      
      // Pre-calculate disabled state
      const isDisabled = disabled ||
        (minDate && dateTime < minDate.getTime()) ||
        (maxDate && dateTime > maxDate.getTime());
      
      days.push({
        date,
        isSelected,
        isDisabled: !!isDisabled,
        key: `${date.getFullYear()}-${date.getMonth()}-${day}`
      });
    }

    const name = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    return { calendarDays: days, monthName: name };
  }, [currentMonth, value, disabled, minDate, maxDate]);


  const handleDateClick = useCallback((date: Date) => {
    onChangeRef.current(date);
  }, []);

  const goToPreviousMonth = useCallback(() => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    handleMonthChange(newMonth);
  }, [currentMonth, handleMonthChange]);

  const goToNextMonth = useCallback(() => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    handleMonthChange(newMonth);
  }, [currentMonth, handleMonthChange]);

  // Use Unistyles
  calendarStyles.useVariants({});

  // Pre-calculate styles to avoid inline objects
  const dayButtonStyle = calendarStyles.dayButton;

  return (
    <View style={[calendarStyles.container, style]} testID={testID}>
      {/* Header */}
      <View style={calendarStyles.header}>
        <Button 
          variant="text" 
          size="sm" 
          onPress={goToPreviousMonth} 
          disabled={disabled}
          style={calendarStyles.headerButton}
        >
          ←
        </Button>
        <Text weight="semibold">{monthName}</Text>
        <Button 
          variant="text" 
          size="sm" 
          onPress={goToNextMonth} 
          disabled={disabled}
          style={calendarStyles.headerButton}
        >
          →
        </Button>
      </View>

      {/* Weekday headers */}
      <View style={calendarStyles.weekdayHeader}>
        {weekdays.map((day) => (
          <View key={day} style={calendarStyles.weekdayCell}>
            <Text style={calendarStyles.weekdayText}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={calendarStyles.calendarGrid}>
        {calendarDays.map((dayInfo) => (
          <DayCell
            key={dayInfo.key}
            date={dayInfo.date}
            isSelected={dayInfo.isSelected}
            isDisabled={dayInfo.isDisabled}
            onPress={handleDateClick}
            dayButtonStyle={dayButtonStyle}
            textColorSelected="#ffffff"
            textColorDefault="#000000"
          />
        ))}
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  // Skip checking callbacks since we handle them with refs
  return (
    prevProps.value?.getTime() === nextProps.value?.getTime() &&
    prevProps.minDate?.getTime() === nextProps.minDate?.getTime() &&
    prevProps.maxDate?.getTime() === nextProps.maxDate?.getTime() &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.currentMonth?.getTime() === nextProps.currentMonth?.getTime() &&
    prevProps.style === nextProps.style &&
    prevProps.testID === nextProps.testID
  );
});

Calendar.displayName = 'Calendar';

// Static weekday labels
const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Pre-defined styles to avoid inline style objects
const styles = StyleSheet.create({
  selectedButton: {
    backgroundColor: '#3b82f6'
  },
  disabledButton: {
    opacity: 0.5
  },
  dayText: {
    fontSize: 13,
    textAlign: 'center'
  }
});