import React from 'react';
import { Text, Button } from '@idealyst/components';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onMonthClick: () => void;
  onYearClick: () => void;
  disabled?: boolean;
}

const headerStyles = {
  container: {
    display: 'flex',
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  centerSection: {
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 8,
  },
  navButton: {
    minWidth: 32,
    minHeight: 32,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  titleButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
};

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  onMonthClick,
  onYearClick,
  disabled = false,
}) => {
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long' });
  const year = currentMonth.getFullYear();

  return (
    <div style={headerStyles.container}>
      <Button 
        variant="text" 
        size="small" 
        onPress={onPreviousMonth} 
        disabled={disabled}
        style={headerStyles.navButton}
      >
        ←
      </Button>
      
      <div style={headerStyles.centerSection}>
        <Button 
          variant="text" 
          onPress={onMonthClick}
          disabled={disabled}
          style={headerStyles.titleButton}
        >
          <Text weight="semibold">{monthName}</Text>
        </Button>
        
        <Button 
          variant="text" 
          onPress={onYearClick}
          disabled={disabled}
          style={headerStyles.titleButton}
        >
          <Text weight="semibold">{year}</Text>
        </Button>
      </div>
      
      <Button 
        variant="text" 
        size="small" 
        onPress={onNextMonth} 
        disabled={disabled}
        style={headerStyles.navButton}
      >
        →
      </Button>
    </div>
  );
};