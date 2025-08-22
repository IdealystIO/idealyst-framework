import React, { useState } from 'react';
import { Button } from '@idealyst/components';

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

const overlayStyles = {
  container: {
    position: 'absolute' as const,
    top: '32px',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e5e7eb',
    zIndex: 10,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600' as const,
    margin: 0,
    color: '#6b7280',
  },
  closeButton: {
    minWidth: 24,
    minHeight: 24,
    padding: 2,
    fontSize: 12,
  },
  monthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 6,
  },
  yearContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  },
  yearNavigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yearRange: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#6b7280',
  },
  navButton: {
    minWidth: 28,
    minHeight: 28,
    padding: 4,
    fontSize: 12,
  },
  yearGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 4,
  },
  gridButton: {
    minHeight: 32,
    fontSize: 13,
    padding: '4px 8px',
  },
};

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
    <div style={overlayStyles.container}>
      <div style={overlayStyles.header}>
        <h3 style={overlayStyles.title}>
          Select {mode === 'month' ? 'Month' : 'Year'}
        </h3>
        <Button
          variant="text"
          size="small"
          onPress={onClose}
          style={overlayStyles.closeButton}
        >
          ✕
        </Button>
      </div>

      {mode === 'month' ? (
        <div style={overlayStyles.monthGrid}>
          {months.map((month, index) => (
            <Button
              key={month}
              variant={index === currentMonth ? 'contained' : 'outlined'}
              intent={index === currentMonth ? 'primary' : 'neutral'}
              size="small"
              onPress={() => handleMonthSelect(index)}
              disabled={disabled}
              style={overlayStyles.gridButton}
            >
              {month.slice(0, 3)}
            </Button>
          ))}
        </div>
      ) : (
        <div style={overlayStyles.yearContainer}>
          <div style={overlayStyles.yearNavigation}>
            <Button
              variant="text"
              size="small"
              onPress={goToPreviousYearRange}
              disabled={disabled}
              style={overlayStyles.navButton}
            >
              ←
            </Button>
            <span style={overlayStyles.yearRange}>
              {yearRangeStart} - {yearRangeStart + 19}
            </span>
            <Button
              variant="text"
              size="small"
              onPress={goToNextYearRange}
              disabled={disabled}
              style={overlayStyles.navButton}
            >
              →
            </Button>
          </div>
          <div style={overlayStyles.yearGrid}>
            {years.map((year) => (
              <Button
                key={year}
                variant={year === currentYear ? 'contained' : 'outlined'}
                intent={year === currentYear ? 'primary' : 'neutral'}
                size="small"
                onPress={() => handleYearSelect(year)}
                disabled={disabled}
                style={overlayStyles.gridButton}
              >
                {year}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};