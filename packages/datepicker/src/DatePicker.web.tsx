import React, { useMemo, useState } from 'react';
import { getWebProps } from 'react-native-unistyles/web';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { IconSvg } from './IconSvg.web';
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

  const styles = datePickerCalendarStyles;

  // Apply variants for disabled state
  styles.useVariants({
    disabled,
  });

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
    // Normalize the date to start of day for comparison
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
  const indicatorRowStyle = (styles.indicatorRow as any)({});
  const indicatorStyle = (styles.indicator as any)({});

  // Get web props for all elements
  const calendarProps = getWebProps([calendarStyle, style as any]);
  const headerProps = getWebProps([headerStyle]);
  const weekdayRowProps = getWebProps([weekdayRowStyle]);
  const weekdayCellProps = getWebProps([weekdayCellStyle]);
  const gridProps = getWebProps([gridStyle]);
  const monthGridProps = getWebProps([monthGridStyle]);
  const yearGridProps = getWebProps([yearGridStyle]);
  const navButtonProps = getWebProps([navButtonStyle]);
  const titleButtonProps = getWebProps([titleButtonStyle]);
  const titleTextProps = getWebProps([titleTextStyle]);
  const weekdayTextProps = getWebProps([weekdayTextStyle]);
  const selectorItemProps = getWebProps([selectorItemStyle]);
  const selectorItemSelectedProps = getWebProps([selectorItemStyle, selectorItemSelectedStyle]);
  const selectorItemTextProps = getWebProps([selectorItemTextStyle]);
  const selectorItemTextSelectedProps = getWebProps([selectorItemTextStyle, selectorItemTextSelectedStyle]);
  const indicatorRowProps = getWebProps([indicatorRowStyle]);

  // Helper to get indicators for a date
  const getIndicators = (date: Date): DayIndicator[] => {
    if (!indicators) return [];
    const key = formatDateKey(date);
    return indicators[key] || [];
  };

  // Render month selector
  if (viewMode === 'months') {
    return (
      <div {...calendarProps}>
        <div {...headerProps}>
          <button
            type="button"
            {...navButtonProps}
            onClick={() => setViewMode('calendar')}
            disabled={disabled}
          >
            <IconSvg path={mdiChevronLeft} size={16} color={iconColorStyle.color} />
          </button>
          <button
            type="button"
            {...titleButtonProps}
            onClick={() => setViewMode('years')}
            disabled={disabled}
          >
            <span {...titleTextProps}>{year}</span>
          </button>
          <div style={{ width: 32 }} />
        </div>
        <div {...monthGridProps}>
          {MONTHS.map((month, index) => {
            const isCurrentMonth = index === currentMonth.getMonth();
            return (
              <button
                type="button"
                key={month}
                {...(isCurrentMonth ? selectorItemSelectedProps : selectorItemProps)}
                onClick={() => handleMonthSelect(index)}
                disabled={disabled}
              >
                <span {...(isCurrentMonth ? selectorItemTextSelectedProps : selectorItemTextProps)}>
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
            type="button"
            {...navButtonProps}
            onClick={goToPrevYearRange}
            disabled={disabled}
          >
            <IconSvg path={mdiChevronLeft} size={16} color={iconColorStyle.color} />
          </button>
          <span {...titleTextProps}>
            {yearRange[0]} - {yearRange[yearRange.length - 1]}
          </span>
          <button
            type="button"
            {...navButtonProps}
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
                type="button"
                key={yr}
                {...(isCurrentYear ? selectorItemSelectedProps : selectorItemProps)}
                onClick={() => handleYearSelect(yr)}
                disabled={disabled}
              >
                <span {...(isCurrentYear ? selectorItemTextSelectedProps : selectorItemTextProps)}>
                  {yr}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Get day cell props
  const dayCellStyle = (styles.dayCell as any)({});
  const selectedDayStyle = (styles.selectedDay as any)({});
  const todayDayStyle = (styles.todayDay as any)({});
  const dayButtonStyle = (styles.dayButton as any)({ disabled: false });
  const dayButtonDisabledStyle = (styles.dayButton as any)({ disabled: true });
  const dayTextStyle = (styles.dayText as any)({});
  const selectedDayTextStyle = (styles.selectedDayText as any)({});

  const dayCellProps = getWebProps([dayCellStyle]);
  const dayButtonProps = getWebProps([dayButtonStyle]);
  const dayButtonSelectedProps = getWebProps([dayButtonStyle, selectedDayStyle]);
  const dayButtonTodayProps = getWebProps([dayButtonStyle, todayDayStyle]);
  const dayButtonDisabledProps = getWebProps([dayButtonDisabledStyle]);
  const dayTextProps = getWebProps([dayTextStyle]);
  const selectedDayTextProps = getWebProps([dayTextStyle, selectedDayTextStyle]);

  // Render calendar (default)
  return (
    <div {...calendarProps}>
      {/* Header */}
      <div {...headerProps}>
        <button
          type="button"
          {...navButtonProps}
          onClick={goToPrevMonth}
          disabled={disabled}
        >
          <IconSvg path={mdiChevronLeft} size={16} color={iconColorStyle.color} />
        </button>
        <button
          type="button"
          {...titleButtonProps}
          onClick={() => setViewMode('months')}
          disabled={disabled}
        >
          <span {...titleTextProps}>
            {monthShort} {year}
          </span>
        </button>
        <button
          type="button"
          {...navButtonProps}
          onClick={goToNextMonth}
          disabled={disabled}
        >
          <IconSvg path={mdiChevronRight} size={16} color={iconColorStyle.color} />
        </button>
      </div>

      {/* Weekday headers */}
      <div {...weekdayRowProps}>
        {WEEKDAYS.map((day, i) => (
          <div key={i} {...weekdayCellProps}>
            <span {...weekdayTextProps}>{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div {...gridProps}>
        {days.map(({ date, isCurrentMonth: isCurrentMonthDay }, index) => {
          const selected = isSelected(date);
          const today = isToday(date);
          const dayDisabled = isDisabled(date);
          const dayIndicators = getIndicators(date);

          // Get appropriate button props (className and ref only)
          const buttonProps = dayDisabled
            ? dayButtonDisabledProps
            : selected
              ? dayButtonSelectedProps
              : today
                ? dayButtonTodayProps
                : dayButtonProps;

          return (
            <div key={index} {...dayCellProps}>
              <button
                type="button"
                className={buttonProps.className}
                style={{ opacity: (!isCurrentMonthDay || dayDisabled) ? 0.3 : 1 }}
                onClick={() => handleDayPress(date)}
                disabled={dayDisabled}
              >
                <span {...(selected ? selectedDayTextProps : dayTextProps)}>
                  {date.getDate()}
                </span>
              </button>
              <div {...indicatorRowProps}>
                {dayIndicators.slice(0, 3).map((ind, i) => (
                  <div
                    key={ind.key ?? i}
                    className={getWebProps([indicatorStyle]).className}
                    style={{ backgroundColor: ind.color }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
