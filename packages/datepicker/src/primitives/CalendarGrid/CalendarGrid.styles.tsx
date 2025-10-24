import { Theme } from '@/theme';
import { StyleSheet } from 'react-native-unistyles';

type CalendarGridVariants = {
  isCurrentMonth: boolean;
  isSelected: boolean;
};

export const calendarGridStyles = StyleSheet.create((theme: Theme) => ({
  weekdayHeader: {
    marginBottom: 8,
  },
  weekdayCell: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  calendarGrid: {
    marginBottom: 8,
    height: 192,
  },
  dayCell: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 0,
    
    _web: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  },
  dayButton: ({ isCurrentMonth, isSelected }: CalendarGridVariants) => ({
    width: '100%',
    height: '100%',
    maxWidth: 36,
    minWidth: 24,
    minHeight: 24,
    padding: 0,
    borderRadius: 4,
    fontSize: 13,
    opacity: isCurrentMonth ? 1 : 0.4,
    backgroundColor: isSelected ? undefined : 'transparent',
    color: isSelected ? undefined : theme.colors.text.primary,
  }),
}));