import React, { useMemo, useState } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { IconSvg } from './IconSvg.web';
import { datePickerCalendarStyles } from './DatePicker.styles';
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

  const styles = datePickerCalendarStyles;

  const { days, monthShort, year } = useMemo(() => {
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

  // Get dynamic styles
  const calendarStyle = (styles.calendar as any)({ disabled });
  const headerStyle = (styles.calendarHeader as any)({});
  const weekdayRowStyle = (styles.weekdayRow as any)({});
  const weekdayCellStyle = (styles.weekdayCell as any)({});
  const gridStyle = (styles.calendarGrid as any)({});
  const monthGridStyle = (styles.monthGrid as any)({});
  const yearGridStyle = (styles.yearGrid as any)({});
  const navButtonStyle = (styles.navButton as any)({ disabled });
  const titleButtonStyle = (styles.titleButton as any)({ disabled });
  const titleTextStyle = (styles.titleText as any)({});
  const weekdayTextStyle = (styles.weekdayText as any)({});
  const selectorItemStyle = (styles.selectorItem as any)({ disabled });
  const selectorItemSelectedStyle = (styles.selectorItemSelected as any)({});
  const selectorItemTextStyle = (styles.selectorItemText as any)({});
  const selectorItemTextSelectedStyle = (styles.selectorItemTextSelected as any)({});
  const iconColorStyle = (styles.iconColor as any)({});

  // Get web props
  const calendarProps = getWebProps([calendarStyle, style as any]);
  const headerProps = getWebProps([headerStyle]);
  const weekdayRowProps = getWebProps([weekdayRowStyle]);
  const gridProps = getWebProps([gridStyle]);
  const monthGridProps = getWebProps([monthGridStyle]);
  const yearGridProps = getWebProps([yearGridStyle]);

  // Render month selector
  if (viewMode === 'months') {
    return (
      <div {...calendarProps}>
        <div {...headerProps}>
          <button
            style={navButtonStyle}
            onClick={() => setViewMode('calendar')}
            disabled={disabled}
          >
            <IconSvg path={mdiChevronLeft} size={16} color={iconColorStyle.color} />
          </button>
          <button
            style={titleButtonStyle}
            onClick={() => setViewMode('years')}
            disabled={disabled}
          >
            <span style={titleTextStyle}>{year}</span>
          </button>
          <div style={{ width: 28 }} />
        </div>
        <div {...monthGridProps}>
          {MONTHS.map((month, index) => {
            const isCurrentMonth = index === currentMonth.getMonth();
            return (
              <button
                key={month}
                style={{
                  ...selectorItemStyle,
                  ...(isCurrentMonth ? selectorItemSelectedStyle : {}),
                }}
                onClick={() => handleMonthSelect(index)}
                disabled={disabled}
              >
                <span
                  style={{
                    ...selectorItemTextStyle,
                    ...(isCurrentMonth ? selectorItemTextSelectedStyle : {}),
                  }}
                >
                  {month}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Render year selector
  if (viewMode === 'years') {
    return (
      <div {...calendarProps}>
        <div {...headerProps}>
          <button
            style={navButtonStyle}
            onClick={goToPrevYearRange}
            disabled={disabled}
          >
            <IconSvg path={mdiChevronLeft} size={16} color={iconColorStyle.color} />
          </button>
          <span style={titleTextStyle}>
            {yearRange[0]} - {yearRange[yearRange.length - 1]}
          </span>
          <button
            style={navButtonStyle}
            onClick={goToNextYearRange}
            disabled={disabled}
          >
            <IconSvg path={mdiChevronRight} size={16} color={iconColorStyle.color} />
          </button>
        </div>
        <div {...yearGridProps}>
          {yearRange.map((yr) => {
            const isCurrentYear = yr === currentMonth.getFullYear();
            return (
              <button
                key={yr}
                style={{
                  ...selectorItemStyle,
                  ...(isCurrentYear ? selectorItemSelectedStyle : {}),
                }}
                onClick={() => handleYearSelect(yr)}
                disabled={disabled}
              >
                <span
                  style={{
                    ...selectorItemTextStyle,
                    ...(isCurrentYear ? selectorItemTextSelectedStyle : {}),
                  }}
                >
                  {yr}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Render calendar (default)
  return (
    <div {...calendarProps}>
      {/* Header */}
      <div {...headerProps}>
        <button
          style={navButtonStyle}
          onClick={goToPrevMonth}
          disabled={disabled}
        >
          <IconSvg path={mdiChevronLeft} size={16} color={iconColorStyle.color} />
        </button>
        <button
          style={titleButtonStyle}
          onClick={() => setViewMode('months')}
          disabled={disabled}
        >
          <span style={titleTextStyle}>
            {monthShort} {year}
          </span>
        </button>
        <button
          style={navButtonStyle}
          onClick={goToNextMonth}
          disabled={disabled}
        >
          <IconSvg path={mdiChevronRight} size={16} color={iconColorStyle.color} />
        </button>
      </div>

      {/* Weekday headers */}
      <div {...weekdayRowProps}>
        {WEEKDAYS.map((day, i) => (
          <div key={i} style={weekdayCellStyle}>
            <span style={weekdayTextStyle}>{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div {...gridProps}>
        {days.map(({ date, isCurrentMonth }, index) => {
          const selected = isSelected(date);
          const today = isToday(date);
          const dayDisabled = isDisabled(date);

          const dayCellStyle = (styles.dayCell as any)({});
          const selectedDayStyle = (styles.selectedDay as any)({});
          const todayDayStyle = (styles.todayDay as any)({});
          const dayButtonStyle = (styles.dayButton as any)({ disabled: dayDisabled });
          const dayTextStyle = (styles.dayText as any)({});
          const selectedDayTextStyle = (styles.selectedDayText as any)({});

          return (
            <div
              key={index}
              style={{
                ...dayCellStyle,
                ...(selected ? selectedDayStyle : {}),
                ...(today && !selected ? todayDayStyle : {}),
                opacity: (!isCurrentMonth || dayDisabled) ? 0.3 : 1,
              }}
            >
              <button
                style={dayButtonStyle}
                onClick={() => handleDayPress(date)}
                disabled={dayDisabled}
              >
                <span
                  style={{
                    ...dayTextStyle,
                    ...(selected ? selectedDayTextStyle : {}),
                  }}
                >
                  {date.getDate()}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
