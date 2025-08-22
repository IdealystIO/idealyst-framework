import { StyleSheet } from 'react-native-unistyles';

export const timePickerStyles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
  },

  timeSection: {
    alignItems: 'center',
    gap: 1,
  },

  timeInput: {
    minWidth: 36,
    minHeight: 32,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors?.text?.primary || '#111827',
    padding: 4,
    borderRadius: 4,
    backgroundColor: theme.colors?.surface?.secondary || '#f9fafb',
    borderWidth: 1,
    borderColor: theme.colors?.border?.primary || '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    _web: {
      border: `1px solid ${theme.colors?.border?.primary || '#e5e7eb'}`,
      outline: 'none',
    },
  },

  timeSeparator: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors?.text?.primary || '#111827',
    paddingHorizontal: 2,
  },

  ampmButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 40,
    minHeight: 32,
    marginLeft: 4,
  },

  stepperContainer: {
    alignItems: 'center',
    gap: 1,
  },

  stepperButton: {
    width: 20,
    height: 16,
    minWidth: 20,
    minHeight: 16,
    padding: 0,
    borderRadius: 2,
  },

  stepperText: {
    fontSize: 10,
    lineHeight: 12,
    color: theme.colors?.text?.secondary || '#6b7280',
  },
}));