import { StyleSheet } from 'react-native-unistyles';

export const calendarGridStyles = StyleSheet.create((theme) => ({
  weekdayHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 2,
    marginBottom: 8,
    
    _web: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
    }
  },
  weekdayCell: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    
    _web: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors?.text?.secondary || '#6b7280',
  },
  calendarGrid: {
    gap: 2,
    marginBottom: 8,
    height: 192,
    
    _web: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
    }
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
  dayButton: {
    width: '100%',
    height: '100%',
    maxWidth: 36,
    minWidth: 24,
    minHeight: 24,
    padding: 0,
    borderRadius: 4,
    fontSize: 13,
  },
}));