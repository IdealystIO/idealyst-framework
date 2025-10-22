import { StyleSheet } from 'react-native-unistyles';

export const calendarStyles = StyleSheet.create((theme) => ({
  container: {
    width: 256,
    position: 'relative',
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
    borderWidth: 1,
    borderColor: theme.colors?.border?.primary || '#e5e7eb',
    
    // Web specific styles
    _web: {
      border: `1px solid ${theme.colors?.border?.primary || '#e5e7eb'}`,
      borderWidth: undefined,
      borderColor: undefined,
    },
  },

  monthPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    
    // Web specific styles
    _web: {
      display: 'flex',
      gap: 6,
    },
  },

  yearPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    maxHeight: 200,
    width: '100%',
    
    // Web specific styles
    _web: {
      display: 'flex',
      gap: 4,
      overflowY: 'auto',
    },
  },

  pickerButton: {
    fontSize: theme.typography?.fontSize?.sm || 12,
    paddingHorizontal: theme.spacing?.xs || 6,
    paddingVertical: theme.spacing?.xs || 4,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
    marginBottom: 4,
    
    // Month buttons: 3 per row with equal spacing
    variants: {
      monthButton: {
        true: {
          _web: {
            flex: '1 0 30%',
            maxWidth: 'calc(33.333% - 4px)',
            width: undefined,
          },
        },
      },
      yearButton: {
        true: {
          _web: {
            flex: '1 0 22%',
            maxWidth: 'calc(25% - 3px)',
            width: undefined,
          },
        },
      },
    },
    
    // Web specific styles
    _web: {
      display: 'flex',
      width: undefined,
      marginBottom: undefined,
    },
  },

  weekdayHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing?.xs || 8,
    
    // Web specific styles
    _web: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 2,
      flexDirection: undefined,
    },
  },

  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing?.xs || 4,
    
    // Web specific styles
    _web: {
      display: 'flex',
      flex: undefined,
    },
  },

  weekdayText: {
    fontSize: theme.typography?.fontSize?.sm || 12,
    fontWeight: '500',
    color: theme.colors?.text?.secondary || '#6b7280',
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing?.xs || 8,
    
    // Web specific styles
    _web: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 2,
      flexDirection: undefined,
      flexWrap: undefined,
    },
  },

  dayCell: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
    
    // Web specific styles
    _web: {
      display: 'flex',
      width: undefined,
    },
  },

  dayButton: {
    width: 28,
    height: 28,
    minWidth: 28,
    minHeight: 28,
    padding: 0,
    borderRadius: theme.borderRadius?.sm || 6,
    fontSize: theme.typography?.fontSize?.sm || 13,
    alignItems: 'center',
    justifyContent: 'center',
    
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
    
    // Web specific styling
    _web: {
      width: '100%',
      height: '100%',
      maxWidth: 36,
      maxHeight: 36,
      display: 'flex',
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