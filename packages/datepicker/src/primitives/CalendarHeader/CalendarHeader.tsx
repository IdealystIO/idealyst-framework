import React from 'react';
import { Text, Button, View } from '@idealyst/components';
import { calendarHeaderStyles } from './CalendarHeader.styles';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onMonthClick: () => void;
  onYearClick: () => void;
  disabled?: boolean;
}


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
    <View style={calendarHeaderStyles.container}>
      <Button 
        variant="text" 
        size="small" 
        onPress={onPreviousMonth} 
        disabled={disabled}
        style={calendarHeaderStyles.navButton}
      >
        ←
      </Button>
      
      <View style={calendarHeaderStyles.centerSection}>
        <Button 
          variant="text" 
          onPress={onMonthClick}
          disabled={disabled}
          style={calendarHeaderStyles.titleButton}
        >
          <Text weight="semibold">{monthName}</Text>
        </Button>
        
        <Button 
          variant="text" 
          onPress={onYearClick}
          disabled={disabled}
          style={calendarHeaderStyles.titleButton}
        >
          <Text weight="semibold">{year}</Text>
        </Button>
      </View>
      
      <Button 
        variant="text" 
        size="small" 
        onPress={onNextMonth} 
        disabled={disabled}
        style={calendarHeaderStyles.navButton}
      >
        →
      </Button>
    </View>
  );
};