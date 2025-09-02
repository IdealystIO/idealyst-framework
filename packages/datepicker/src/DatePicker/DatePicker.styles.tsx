import { StyleSheet } from 'react-native-unistyles';

export const datePickerStyles = StyleSheet.create((theme) => ({
  container: {
    // Base container styles
  },
  
  label: {
    marginBottom: theme.spacing?.sm || 8,
    fontSize: theme.typography?.sizes?.small || 14,
    fontWeight: '500',
    color: theme.colors?.text?.primary || '#1f2937',
  },

  picker: {
    borderRadius: theme.borderRadius?.md || 8,
    borderWidth: 1,
    borderColor: theme.colors?.border?.primary || '#e5e7eb',
    backgroundColor: theme.colors?.surface?.primary || '#ffffff',
    padding: theme.spacing?.md || 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    
    // Web specific styles
    _web: {
      border: `1px solid ${theme.colors?.border?.primary || '#e5e7eb'}`,
      borderWidth: undefined,
      borderColor: undefined,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      shadowColor: undefined,
      shadowOffset: undefined,
      shadowOpacity: undefined,
      shadowRadius: undefined,
      elevation: undefined,
    },
  },

  selectedDateHeader: {
    marginBottom: theme.spacing?.sm || 12,
    paddingBottom: theme.spacing?.sm || 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors?.border?.secondary || '#f3f4f6',
    
    // Web specific border
    _web: {
      borderBottom: `1px solid ${theme.colors?.border?.secondary || '#f3f4f6'}`,
    },
  },

  selectedDateLabel: {
    fontSize: theme.typography?.sizes?.small || 12,
    color: theme.colors?.text?.secondary || '#6b7280',
    marginBottom: 4,
  },

  selectedDateValue: {
    fontSize: theme.typography?.sizes?.medium || 16,
    fontWeight: '600',
    color: theme.colors?.text?.primary || '#1f2937',
  },

  errorText: {
    marginTop: 4,
    fontSize: theme.typography?.sizes?.small || 12,
    color: theme.colors?.text?.error || '#dc2626',
  },

  helperText: {
    marginTop: 4,
    fontSize: theme.typography?.sizes?.small || 12,
    color: theme.colors?.text?.secondary || '#6b7280',
  },
}));