import { StyleSheet } from 'react-native-unistyles';

export const dateTimePickerStyles = StyleSheet.create((theme) => ({
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

  selectedDateTimeHeader: {
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

  selectedDateTimeLabel: {
    fontSize: theme.typography?.fontSize?.sm || 12,
    fontWeight: '500',
    color: theme.colors?.text?.secondary || '#6b7280',
  },

  selectedDateTimeValue: {
    fontSize: theme.typography?.fontSize?.md || 16,
    fontWeight: '600',
    color: theme.colors?.text?.primary || '#111827',
  },

  section: {
    gap: theme.spacing?.xs || 8,
  },

  sectionLabel: {
    fontSize: theme.typography?.fontSize?.sm || 14,
    fontWeight: '600',
    color: theme.colors?.text?.primary || '#111827',
  },

  sectionContent: {
    padding: theme.spacing?.sm || 12,
    borderWidth: 1,
    borderColor: theme.colors?.border?.primary || '#e5e7eb',
    borderRadius: theme.borderRadius?.md || 8,
    backgroundColor: theme.colors?.surface?.primary || '#ffffff',

    _web: {
      border: `1px solid ${theme.colors?.border?.primary || '#e5e7eb'}`,
    },
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