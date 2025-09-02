import { StyleSheet } from 'react-native-unistyles';

export const calendarOverlayStyles = StyleSheet.create((theme) => ({
  container: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: theme.colors?.surface?.primary || 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors?.border?.primary || '#e5e7eb',
    zIndex: 10,
    
    _web: {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    }
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    margin: 0,
    color: theme.colors?.text?.secondary || '#6b7280',
  },
  closeButton: {
    minWidth: 24,
    minHeight: 24,
    padding: 2,
    fontSize: 12,
  },
  monthGrid: {
    gap: 6,
    
    _web: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
    }
  },
  yearContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  yearNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yearGrid: {
    gap: 6,
    
    _web: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
    }
  },
  yearNavButton: {
    minWidth: 32,
    minHeight: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
  },
  yearRangeText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors?.text?.primary || '#374151',
  },
  gridButton: {
    minHeight: 28,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
  },
}));