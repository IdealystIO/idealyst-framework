import { StyleSheet } from 'react-native-unistyles';

export const rangeCalendarStyles = StyleSheet.create((theme) => ({
  container: {
    width: 256,
    position: 'relative',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing?.md || 16,

    _web: {
      display: 'flex',
    },
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
    width: 36,
    minWidth: 36,
    maxWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing?.xs || 4,
    
    // Web specific styles
    _web: {
      display: 'flex',
      flex: undefined,
      width: '36px',
      minWidth: '36px',
      maxWidth: '36px',
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
    minWidth: 36,
    maxWidth: 36,
    aspectRatio: 1,
    alignItems: 'stretch',
    justifyContent: 'stretch',
    height: 36,
    maxHeight: 36,
    
    // Web specific styles
    _web: {
      display: 'flex',
      width: '36px',
      minWidth: '36px',
      maxWidth: '36px',
      height: '36px',
      maxHeight: '36px',
    },
  },

  dayButton: {
    flex: 1,
    width: '100%',
    height: '100%',
    minWidth: 36,
    maxWidth: 36,
    minHeight: 36,
    maxHeight: 36,
    padding: 0,
    margin: 0,
    borderRadius: theme.borderRadius?.sm || 6,
    fontSize: theme.typography?.fontSize?.sm || 13,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    
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
    
    // Web specific styling
    _web: {
      width: '36px',
      height: '36px',
      minWidth: '36px',
      maxWidth: '36px',
      minHeight: '36px',
      maxHeight: '36px',
      display: 'flex',
      overflow: 'hidden',
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

  compactButton: {
    padding: 4,
  },
}));