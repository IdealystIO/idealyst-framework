import { StyleSheet } from 'react-native-unistyles';

export const dateRangePickerStyles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing?.md || 16,
  },

  label: {
    fontSize: theme.typography?.fontSize?.sm || 14,
    fontWeight: '600',
    color: theme.colors?.text?.primary || '#111827',
    marginBottom: theme.spacing?.xs || 4,
  },

  picker: {
    gap: theme.spacing?.md || 16,
  },

  selectedRangeHeader: {
    padding: theme.spacing?.sm || 12,
    backgroundColor: theme.colors?.surface?.secondary || '#f9fafb',
    borderRadius: theme.borderRadius?.md || 8,
    borderWidth: 1,
    borderColor: theme.colors?.border?.primary || '#e5e7eb',
    gap: theme.spacing?.xs || 4,

    _web: {
      border: `1px solid ${theme.colors?.border?.primary || '#e5e7eb'}`,
    },
  },

  selectedRangeLabel: {
    fontSize: theme.typography?.fontSize?.sm || 12,
    fontWeight: '500',
    color: theme.colors?.text?.secondary || '#6b7280',
  },

  selectedRangeValue: {
    fontSize: theme.typography?.fontSize?.md || 16,
    fontWeight: '600',
    color: theme.colors?.text?.primary || '#111827',
  },

  rangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing?.sm || 12,
  },

  rangeInput: {
    flex: 1,
    padding: theme.spacing?.sm || 12,
    borderWidth: 1,
    borderColor: theme.colors?.border?.primary || '#e5e7eb',
    borderRadius: theme.borderRadius?.md || 8,
    backgroundColor: theme.colors?.surface?.primary || '#ffffff',
    fontSize: theme.typography?.fontSize?.md || 16,
    textAlign: 'center',

    _web: {
      border: `1px solid ${theme.colors?.border?.primary || '#e5e7eb'}`,
      outline: 'none',
    },
  },

  rangeSeparator: {
    fontSize: theme.typography?.fontSize?.md || 16,
    fontWeight: '500',
    color: theme.colors?.text?.secondary || '#6b7280',
  },

  errorText: {
    fontSize: theme.typography?.fontSize?.sm || 12,
    color: theme.colors?.semantic?.error || '#dc2626',
    marginTop: theme.spacing?.xs || 4,
  },

  helperText: {
    fontSize: theme.typography?.fontSize?.sm || 12,
    color: theme.colors?.text?.secondary || '#6b7280',
    marginTop: theme.spacing?.xs || 4,
  },
}));