import React, { useState } from 'react';
import { Button, View, Text } from '@idealyst/components';
import { calendarOverlayStyles } from './CalendarOverlay.styles';

type OverlayMode = 'month' | 'year';

interface CalendarOverlayProps {
  mode: OverlayMode;
  currentMonth: number;
  currentYear: number;
  onMonthSelect: (month: number) => void;
  onYearSelect: (year: number) => void;
  onClose: () => void;
  disabled?: boolean;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];


export const CalendarOverlay: React.FC<CalendarOverlayProps> = ({
  mode,
  currentMonth,
  currentYear,
  onMonthSelect,
  onYearSelect,
  onClose,
  disabled = false,
}) => {
  const [yearRangeStart, setYearRangeStart] = useState(currentYear - 10);
  const years = Array.from({ length: 20 }, (_, i) => yearRangeStart + i);


  const handleMonthSelect = (monthIndex: number) => {
    onMonthSelect(monthIndex);
    onClose();
  };

  const handleYearSelect = (year: number) => {
    onYearSelect(year);
    onClose();
  };

  const goToPreviousYearRange = () => {
    setYearRangeStart(yearRangeStart - 20);
  };

  const goToNextYearRange = () => {
    setYearRangeStart(yearRangeStart + 20);
  };

  return (
    <View style={calendarOverlayStyles.container}>
      <View style={calendarOverlayStyles.header}>
        <Text style={calendarOverlayStyles.title}>
          Select {mode === 'month' ? 'Month' : 'Year'}
        </Text>
        <Button
          type="text"
          size="sm"
          onPress={onClose}
          style={calendarOverlayStyles.closeButton}
        >
          ✕
        </Button>
      </View>

      {mode === 'month' ? (
        <View style={calendarOverlayStyles.monthGrid}>
          {months.map((month, index) => {
            const isSelected = index === currentMonth;
            return (
              <Button
                key={month}
                type={isSelected ? 'contained' : 'text'}
                intent={isSelected ? 'primary' : undefined}
                size="sm"
                onPress={() => handleMonthSelect(index)}
                disabled={disabled}
                style={calendarOverlayStyles.gridButton({ isSelected })}
              >
                {month.slice(0, 3)}
              </Button>
            );
          })}
        </View>
      ) : (
        <View style={calendarOverlayStyles.yearContainer}>
          <View style={calendarOverlayStyles.yearNavigation}>
            <Button
              type="text"
              size="sm"
              onPress={goToPreviousYearRange}
              disabled={disabled}
              style={calendarOverlayStyles.yearNavButton}
            >
              ←
            </Button>
            <Text style={calendarOverlayStyles.yearRangeText}>
              {yearRangeStart} - {yearRangeStart + 19}
            </Text>
            <Button
              type="text"
              size="sm"
              onPress={goToNextYearRange}
              disabled={disabled}
              style={calendarOverlayStyles.yearNavButton}
            >
              →
            </Button>
          </View>
          <View style={calendarOverlayStyles.yearGrid}>
            {years.map((year) => {
              const isSelected = year === currentYear;
              return (
                <Button
                  key={year}
                  type={isSelected ? 'contained' : 'text'}
                  intent={isSelected ? 'primary' : undefined}
                  size="sm"
                  onPress={() => handleYearSelect(year)}
                  disabled={disabled}
                  style={calendarOverlayStyles.gridButton({ isSelected })}
                >
                  {year}
                </Button>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};