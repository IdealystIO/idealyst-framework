import React, { useMemo, useState } from 'react';
import { View, Text, Button, Icon } from '@idealyst/components';
import { datePickerStyles } from './styles';
import type { DatePickerProps } from './types';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type ViewMode = 'calendar' | 'months' | 'years';

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  style,
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => value || new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');

  datePickerStyles.useVariants({ disabled });

  const { days, monthLabel, monthShort, year } = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    // Previous month padding
    const prevMonthEnd = new Date(year, month, 0);
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthEnd.getDate() - i),
        isCurrentMonth: false,
      });
    }

    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }

    // Next month padding (fill to complete last week)
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let day = 1; day <= remaining; day++) {
        days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
      }
    }

    const monthLabel = firstDay.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

    return { days, monthLabel, monthShort: MONTHS[month], year };
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
    if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) return true;
    if (maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999))) return true;
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
      onChange(date);
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

  // Render month selector
  if (viewMode === 'months') {
    return (
      <View style={[datePickerStyles.calendar, style]}>
        <View style={datePickerStyles.calendarHeader}>
          <Button type="text" size="sm" onPress={() => setViewMode('calendar')} disabled={disabled}>
            <Icon name="chevron-left" size={16} />
          </Button>
          <Button type="text" size="sm" onPress={() => setViewMode('years')} disabled={disabled}>
            <Text typography="body2" weight="semibold">{year}</Text>
          </Button>
          <View style={{ width: 28 }} />
        </View>
        <View style={datePickerStyles.monthGrid}>
          {MONTHS.map((month, index) => {
            const isCurrentMonth = index === currentMonth.getMonth();
            return (
              <Button
                key={month}
                type={isCurrentMonth ? 'contained' : 'text'}
                size="sm"
                onPress={() => handleMonthSelect(index)}
                disabled={disabled}
                style={{ minWidth: 48, margin: 2 }}
              >
                <Text typography="caption" color={isCurrentMonth ? 'inverse' : 'primary'}>
                  {month}
                </Text>
              </Button>
            );
          })}
        </View>
      </View>
    );
  }

  // Render year selector
  if (viewMode === 'years') {
    return (
      <View style={[datePickerStyles.calendar, style]}>
        <View style={datePickerStyles.calendarHeader}>
          <Button type="text" size="sm" onPress={goToPrevYearRange} disabled={disabled}>
            <Icon name="chevron-left" size={16} />
          </Button>
          <Text typography="body2" weight="semibold">
            {yearRange[0]} - {yearRange[yearRange.length - 1]}
          </Text>
          <Button type="text" size="sm" onPress={goToNextYearRange} disabled={disabled}>
            <Icon name="chevron-right" size={16} />
          </Button>
        </View>
        <View style={datePickerStyles.yearGrid}>
          {yearRange.map((yr) => {
            const isCurrentYear = yr === currentMonth.getFullYear();
            return (
              <Button
                key={yr}
                type={isCurrentYear ? 'contained' : 'text'}
                size="sm"
                onPress={() => handleYearSelect(yr)}
                disabled={disabled}
                style={{ minWidth: 48, margin: 2 }}
              >
                <Text typography="caption" color={isCurrentYear ? 'inverse' : 'primary'}>
                  {yr}
                </Text>
              </Button>
            );
          })}
        </View>
      </View>
    );
  }

  // Render calendar (default)
  return (
    <View style={[datePickerStyles.calendar, style]}>
      {/* Header */}
      <View style={datePickerStyles.calendarHeader}>
        <Button type="text" size="sm" onPress={goToPrevMonth} disabled={disabled}>
          <Icon name="chevron-left" size={16} />
        </Button>
        <Button type="text" size="sm" onPress={() => setViewMode('months')} disabled={disabled}>
          <Text typography="body2" weight="semibold">
            {monthShort} {year}
          </Text>
        </Button>
        <Button type="text" size="sm" onPress={goToNextMonth} disabled={disabled}>
          <Icon name="chevron-right" size={16} />
        </Button>
      </View>

      {/* Weekday headers */}
      <View style={datePickerStyles.weekdayRow}>
        {WEEKDAYS.map((day, i) => (
          <View key={i} style={datePickerStyles.weekdayCell}>
            <Text typography="caption" color="secondary">
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={datePickerStyles.calendarGrid}>
        {days.map(({ date, isCurrentMonth }, index) => {
          const selected = isSelected(date);
          const today = isToday(date);
          const dayDisabled = isDisabled(date);

          return (
            <View
              key={index}
              style={[
                datePickerStyles.dayCell,
                selected && {
                  backgroundColor: '#3b82f6',
                  borderRadius: 4,
                },
                !isCurrentMonth && { opacity: 0.3 },
                today && !selected && {
                  borderWidth: 1,
                  borderColor: '#3b82f6',
                  borderRadius: 4,
                },
                dayDisabled && { opacity: 0.3 },
              ]}
            >
              <Button
                type="text"
                size="sm"
                onPress={() => handleDayPress(date)}
                disabled={dayDisabled}
                style={{ minWidth: 24, minHeight: 24, padding: 0 }}
              >
                <Text
                  typography="caption"
                  color={selected ? 'inverse' : 'primary'}
                >
                  {date.getDate()}
                </Text>
              </Button>
            </View>
          );
        })}
      </View>
    </View>
  );
};
