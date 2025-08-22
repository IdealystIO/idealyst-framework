import { StyleSheet } from 'react-native-unistyles';

export const calendarStyles = StyleSheet.create((theme) => ({
  container: {
    width: 256,
  },

  header: {
    display: 'flex',
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing?.xs || 8,
  },

  monthYearButton: {
    paddingHorizontal: theme.spacing?.sm || 8,
    paddingVertical: theme.spacing?.xs || 4,
  },

  pickerContainer: {
    marginBottom: theme.spacing?.md || 16,
    padding: theme.spacing?.sm || 12,
    backgroundColor: theme.colors?.surface?.secondary || '#f9fafb',
    borderRadius: theme.borderRadius?.md || 8,
    border: `1px solid ${theme.colors?.border?.primary || '#e5e7eb'}`,
    
    // Native specific styles
    _native: {
      borderWidth: 1,
      borderColor: theme.colors?.border?.primary || '#e5e7eb',
    },
  },

  monthPickerGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    width: '100%',
    justifyContent: 'space-between',
    
    // Native fallback
    _native: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
  },

  yearPickerGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    maxHeight: 200,
    overflowY: 'auto',
    width: '100%',
    justifyContent: 'space-between',
    
    // Native fallback
    _native: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      maxHeight: 200,
    },
  },

  pickerButton: {
    fontSize: theme.typography?.sizes?.small || 12,
    paddingHorizontal: theme.spacing?.xs || 6,
    paddingVertical: theme.spacing?.xs || 4,
    minHeight: 32,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    
    // Month buttons: 3 per row with equal spacing
    variants: {
      monthButton: {
        true: {
          flex: '1 0 30%',
          maxWidth: 'calc(33.333% - 4px)',
        },
      },
      yearButton: {
        true: {
          flex: '1 0 22%',
          maxWidth: 'calc(25% - 3px)',
        },
      },
    },
    
    // Native specific sizing
    _native: {
      width: '30%',
      marginBottom: 4,
    },
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
      selected: {
        true: {
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

  todaySection: {
    paddingTop: theme.spacing?.sm || 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors?.border?.secondary || '#f3f4f6',
    
    // Web specific border
    _web: {
      borderTop: `1px solid ${theme.colors?.border?.secondary || '#f3f4f6'}`,
    },
  },

  todayButton: {
    width: '100%',
  },
}));