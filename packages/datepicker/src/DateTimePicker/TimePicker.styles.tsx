import { StyleSheet } from 'react-native-unistyles';

export const timePickerStyles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    width: 170,
  },
  clockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    
    _web: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  },
  clockSvg: {
    cursor: 'pointer',
    
    _web: {
      cursor: 'pointer',
    }
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    
    _web: {
      display: 'flex',
      alignItems: 'center',
    }
  },
  timeInput: {
    width: 44,
    height: 40,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors?.text?.primary || '#111827',
    borderWidth: 0,
    borderBottomWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    
    _web: {
      border: 'none',
      borderBottom: 'none',
      outline: 'none',
      cursor: 'pointer',
    }
  },
  activeInput: {
    color: theme.colors?.accent?.primary || '#3b82f6',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors?.accent?.primary || '#3b82f6',
    borderRadius: 0,
  },
  timeSeparator: {
    fontSize: 16,
    fontWeight: '300',
    color: theme.colors?.text?.secondary || '#6b7280',
  },
  ampmButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 36,
    fontSize: 12,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
    padding: 2,
    backgroundColor: theme.colors?.surface?.secondary || '#f3f4f6',
    borderRadius: 6,
    
    _web: {
      display: 'flex',
    }
  },
  tabButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: '500',
    borderRadius: 4,
    borderWidth: 0,
    cursor: 'pointer',
    
    _web: {
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }
  },
  activeTab: {
    backgroundColor: theme.colors?.surface?.primary || '#ffffff',
    color: theme.colors?.accent?.primary || '#3b82f6',
    
    _web: {
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    }
  },
  inactiveTab: {
    backgroundColor: 'transparent',
    color: theme.colors?.text?.secondary || '#6b7280',
  },
}));