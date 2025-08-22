import { StyleSheet } from 'react-native-unistyles';

export const rangeCalendarStyles = StyleSheet.create((theme) => ({
  container: {
    width: 256,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing?.md || 16,
  },

  headerButton: {
    minWidth: 32,
    minHeight: 32,
    paddingHorizontal: theme.spacing?.xs || 8,
    paddingVertical: theme.spacing?.xs || 4,
  },

  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing?.xs || 8,
  },

  monthYearButton: {
    paddingHorizontal: theme.spacing?.sm || 8,
    paddingVertical: theme.spacing?.xs || 4,
  },

  weekdayHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 2,
    marginBottom: theme.spacing?.xs || 8,
    
    // Native fallback
    _native: {
      flexDirection: 'row',
    },
  },

  weekdayCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing?.xs || 4,
    
    // Native fallback
    _native: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: theme.spacing?.xs || 4,
    },
  },

  weekdayText: {
    fontSize: theme.typography?.sizes?.small || 12,
    fontWeight: '500',
    color: theme.colors?.text?.secondary || '#6b7280',
  },

  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 2,
    marginBottom: theme.spacing?.xs || 8,
    
    // Native fallback
    _native: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  },

  dayCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: '1',
    minHeight: 32,
    
    // Native specific sizing
    _native: {
      width: '14.28%', // 100% / 7 days
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  },

  dayButton: {
    width: '100%',
    height: '100%',
    maxWidth: 36,
    maxHeight: 36,
    minWidth: 28,
    minHeight: 28,
    padding: 0,
    borderRadius: theme.borderRadius?.sm || 6,
    fontSize: theme.typography?.sizes?.small || 13,
    
    variants: {
      inRange: {
        true: {
          backgroundColor: theme.colors?.accent?.primary + '20' || '#3b82f620',
          borderRadius: 0,
        },
        false: {},
      },
      isStart: {
        true: {
          backgroundColor: theme.colors?.accent?.primary || '#3b82f6',
          borderTopLeftRadius: theme.borderRadius?.sm || 6,
          borderBottomLeftRadius: theme.borderRadius?.sm || 6,
        },
        false: {},
      },
      isEnd: {
        true: {
          backgroundColor: theme.colors?.accent?.primary || '#3b82f6',
          borderTopRightRadius: theme.borderRadius?.sm || 6,
          borderBottomRightRadius: theme.borderRadius?.sm || 6,
        },
        false: {},
      },
      isSelected: {
        true: {
          backgroundColor: theme.colors?.accent?.primary || '#3b82f6',
          fontWeight: '600',
        },
        false: {
          fontWeight: '400',
        },
      },
    },
    
    // Native specific styling
    _native: {
      width: 28,
      height: 28,
      minWidth: 28,
      minHeight: 28,
      borderRadius: theme.borderRadius?.sm || 6,
    },
  },

  rangePresets: {
    paddingTop: theme.spacing?.sm || 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors?.border?.secondary || '#f3f4f6',
    gap: theme.spacing?.xs || 8,
    
    // Web specific border
    _web: {
      borderTop: `1px solid ${theme.colors?.border?.secondary || '#f3f4f6'}`,
    },
  },

  presetButton: {
    width: '100%',
    justifyContent: 'flex-start',
  },

  clearButton: {
    width: '100%',
  },
}));