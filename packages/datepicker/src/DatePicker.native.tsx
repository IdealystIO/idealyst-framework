import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { datePickerCalendarStyles } from './DatePicker.styles';
import type { DatePickerProps, DayIndicator } from './types';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type ViewMode = 'calendar' | 'months' | 'years';

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  indicators,
  style,
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => value || new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');

  // Get dynamic styles - call as functions for theme reactivity
  const styles = datePickerCalendarStyles;
  const calendarStyle = (styles.calendar as any)({ disabled });
  const calendarHeaderStyle = (styles.calendarHeader as any)({});
  const weekdayRowStyle = (styles.weekdayRow as any)({});
  const weekdayCellStyle = (styles.weekdayCell as any)({});
  const calendarGridStyle = (styles.calendarGrid as any)({});
  const monthGridStyle = (styles.monthGrid as any)({});
  const yearGridStyle = (styles.yearGrid as any)({});
  const dayCellStyle = (styles.dayCell as any)({});
  const selectedDayStyle = (styles.selectedDay as any)({});
  const selectedDayTextStyle = (styles.selectedDayText as any)({});
  const todayDayStyle = (styles.todayDay as any)({});
  const navButtonStyle = (styles.navButton as any)({ disabled });
  const titleButtonStyle = (styles.titleButton as any)({ disabled });
  const titleTextStyle = (styles.titleText as any)({});
  const dayButtonStyle = (styles.dayButton as any)({ disabled: false });
  const dayTextStyle = (styles.dayText as any)({});
  const weekdayTextStyle = (styles.weekdayText as any)({});
  const selectorItemStyle = (styles.selectorItem as any)({ disabled });
  const selectorItemSelectedStyle = (styles.selectorItemSelected as any)({});
  const selectorItemTextStyle = (styles.selectorItemText as any)({});
  const selectorItemTextSelectedStyle = (styles.selectorItemTextSelected as any)({});
  const iconStyle = (styles.iconColor as any)({});
  const indicatorRowStyle = (styles.indicatorRow as any)({});
  const indicatorStyle = (styles.indicator as any)({});

  const { days, monthShort, year } = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    // Previous month padding
    // Use noon (12:00) to avoid timezone issues when date crosses day boundaries
    const prevMonthEnd = new Date(year, month, 0);
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthEnd.getDate() - i, 12, 0, 0, 0),
        isCurrentMonth: false,
      });
    }

    // Current month
    // Use noon (12:00) to avoid timezone issues when date crosses day boundaries
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day, 12, 0, 0, 0), isCurrentMonth: true });
    }

    // Next month padding (fill to complete last week)
    // Use noon (12:00) to avoid timezone issues when date crosses day boundaries
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let day = 1; day <= remaining; day++) {
        days.push({ date: new Date(year, month + 1, day, 12, 0, 0, 0), isCurrentMonth: false });
      }
    }

    return { days, monthShort: MONTHS[month], year };
  }, [currentMonth]);

  const isSelected = (date: Date): boolean => {
    if (!value) return false;
    return (
      date.getDate() === value.getDate() &&
      date.getMonth() === value.getMonth() &&
      date.getFullYear() === value.getFullYear()
    );
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isDisabled = (date: Date): boolean => {
    if (disabled) return true;
    // Normalize dates for comparison without mutating the original props
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (minDate) {
      const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
      if (normalizedDate < min) return true;
    }
    if (maxDate) {
      const max = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
      if (normalizedDate > max) return true;
    }
    return false;
  };

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDayPress = (date: Date) => {
    if (!isDisabled(date)) {
      // Create a new date with noon time to avoid timezone issues
      const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
      onChange(newDate);
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
    setViewMode('calendar');
  };

  const handleYearSelect = (selectedYear: number) => {
    setCurrentMonth(new Date(selectedYear, currentMonth.getMonth(), 1));
    setViewMode('months');
  };

  // Generate year range (10 years before and after current)
  const yearRange = useMemo(() => {
    const currentYear = currentMonth.getFullYear();
    const startYear = Math.floor(currentYear / 10) * 10 - 10;
    return Array.from({ length: 21 }, (_, i) => startYear + i);
  }, [currentMonth]);

  const goToPrevYearRange = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear() - 10, currentMonth.getMonth(), 1));
  };

  const goToNextYearRange = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear() + 10, currentMonth.getMonth(), 1));
  };

  // Helper to get indicators for a date
  const getIndicators = (date: Date): DayIndicator[] => {
    if (!indicators) return [];
    const key = formatDateKey(date);
    return indicators[key] || [];
  };

  // Render month selector
  if (viewMode === 'months') {
    return (
      <View style={[calendarStyle, style]}>
        <View style={calendarHeaderStyle}>
          <TouchableOpacity
            style={navButtonStyle}
            onPress={() => setViewMode('calendar')}
            disabled={disabled}
          >
            <MaterialDesignIcons name="chevron-left" size={16} style={iconStyle} />
          </TouchableOpacity>
          <TouchableOpacity
            style={titleButtonStyle}
            onPress={() => setViewMode('years')}
            disabled={disabled}
          >
            <Text style={titleTextStyle}>{year}</Text>
          </TouchableOpacity>
          <View style={{ width: 32 }} />
        </View>
        <View style={monthGridStyle}>
          {MONTHS.map((month, index) => {
            const isCurrentMonth = index === currentMonth.getMonth();
            return (
              <TouchableOpacity
                key={month}
                style={[
                  selectorItemStyle,
                  isCurrentMonth && selectorItemSelectedStyle,
                ]}
                onPress={() => handleMonthSelect(index)}
                disabled={disabled}
              >
                <Text
                  style={[
                    selectorItemTextStyle,
                    isCurrentMonth && selectorItemTextSelectedStyle,
                  ]}
                >
                  {month}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  // Render year selector
  if (viewMode === 'years') {
    return (
      <View style={[calendarStyle, style]}>
        <View style={calendarHeaderStyle}>
          <TouchableOpacity
            style={navButtonStyle}
            onPress={goToPrevYearRange}
            disabled={disabled}
          >
            <MaterialDesignIcons name="chevron-left" size={16} style={iconStyle} />
          </TouchableOpacity>
          <Text style={titleTextStyle}>
            {yearRange[0]} - {yearRange[yearRange.length - 1]}
          </Text>
          <TouchableOpacity
            style={navButtonStyle}
            onPress={goToNextYearRange}
            disabled={disabled}
          >
            <MaterialDesignIcons name="chevron-right" size={16} style={iconStyle} />
          </TouchableOpacity>
        </View>
        <View style={yearGridStyle}>
          {yearRange.map((yr) => {
            const isCurrentYear = yr === currentMonth.getFullYear();
            return (
              <TouchableOpacity
                key={yr}
                style={[
                  selectorItemStyle,
                  isCurrentYear && selectorItemSelectedStyle,
                ]}
                onPress={() => handleYearSelect(yr)}
                disabled={disabled}
              >
                <Text
                  style={[
                    selectorItemTextStyle,
                    isCurrentYear && selectorItemTextSelectedStyle,
                  ]}
                >
                  {yr}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  // Render calendar (default)
  return (
    <View style={[calendarStyle, style]}>
      {/* Header */}
      <View style={calendarHeaderStyle}>
        <TouchableOpacity
          style={navButtonStyle}
          onPress={goToPrevMonth}
          disabled={disabled}
        >
          <MaterialDesignIcons name="chevron-left" size={16} style={iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity
          style={titleButtonStyle}
          onPress={() => setViewMode('months')}
          disabled={disabled}
        >
          <Text style={titleTextStyle}>
            {monthShort} {year}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={navButtonStyle}
          onPress={goToNextMonth}
          disabled={disabled}
        >
          <MaterialDesignIcons name="chevron-right" size={16} style={iconStyle} />
        </TouchableOpacity>
      </View>

      {/* Weekday headers */}
      <View style={weekdayRowStyle}>
        {WEEKDAYS.map((day, i) => (
          <View key={i} style={weekdayCellStyle}>
            <Text style={weekdayTextStyle}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={calendarGridStyle}>
        {days.map(({ date, isCurrentMonth }, index) => {
          const selected = isSelected(date);
          const today = isToday(date);
          const dayDisabled = isDisabled(date);
          const disabledDayButtonStyle = (styles.dayButton as any)({ disabled: dayDisabled });
          const dayIndicators = getIndicators(date);

          return (
            <View
              key={index}
              style={[
                dayCellStyle,
                !isCurrentMonth && { opacity: 0.3 },
                dayDisabled && { opacity: 0.3 },
              ]}
            >
              <TouchableOpacity
                style={[
                  dayButtonStyle,
                  dayDisabled && disabledDayButtonStyle,
                  selected && selectedDayStyle,
                  today && !selected && todayDayStyle,
                ]}
                onPress={() => handleDayPress(date)}
                disabled={dayDisabled}
              >
                <Text
                  style={[
                    dayTextStyle,
                    selected && selectedDayTextStyle,
                  ]}
                >
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
              <View style={indicatorRowStyle}>
                {dayIndicators.slice(0, 3).map((ind, i) => (
                  <View
                    key={ind.key ?? i}
                    style={[indicatorStyle, { backgroundColor: ind.color }]}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};
