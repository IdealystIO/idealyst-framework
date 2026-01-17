/**
 * Shared input styles for DateInput and TimeInput.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type InputDynamicProps = {
  disabled?: boolean;
  error?: boolean;
};

/**
 * Shared input styles with theme reactivity.
 */
export const dateTimeInputStyles = defineStyle('DateTimeInput', (theme: Theme) => ({
  // Input container for DateInput/TimeInput
  inputContainer: ({ disabled = false, error = false }: InputDynamicProps) => ({
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden' as const,
    borderColor: error ? theme.intents.danger.primary : theme.colors.border.primary,
    backgroundColor: disabled ? theme.colors.surface.secondary : theme.colors.surface.primary,
    _web: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      border: `1px solid ${error ? theme.intents.danger.primary : theme.colors.border.primary}`,
    },
  }),

  // Text input inside the input container
  textInput: ({ disabled = false }: InputDynamicProps) => ({
    flex: 1,
    padding: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: 'transparent',
    color: disabled ? theme.colors.text.tertiary : theme.colors.text.primary,
    _web: {
      outline: 'none',
      border: 'none',
    },
  }),

  // Icon button inside input
  iconButton: ({ disabled = false }: InputDynamicProps) => ({
    width: 32,
    height: 32,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 4,
    borderRadius: 4,
    opacity: disabled ? 0.4 : 1,
    _web: {
      display: 'flex',
      cursor: disabled ? 'not-allowed' : 'pointer',
    },
  }),

  // Error text below input
  errorText: (_props: InputDynamicProps) => ({
    marginTop: 4,
    fontSize: 12,
    color: theme.intents.danger.primary,
  }),

  // Label text above input
  labelText: (_props: InputDynamicProps) => ({
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '500' as const,
    color: theme.colors.text.primary,
  }),

  // Modal backdrop
  modalBackdrop: (_props: InputDynamicProps) => ({
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(0,0,0,0.5)',
    _web: {
      display: 'flex',
    },
  }),

  // Popover content wrapper
  popoverContent: (_props: InputDynamicProps) => ({
    backgroundColor: theme.colors.surface.primary,
    borderRadius: 6,
    ...theme.shadows.lg,
    overflow: 'hidden' as const,
  }),

  // Close button
  closeButton: ({ disabled = false }: InputDynamicProps) => ({
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: 4,
    opacity: disabled ? 0.4 : 1,
    _web: {
      display: 'flex',
      cursor: disabled ? 'not-allowed' : 'pointer',
    },
  }),

  closeButtonText: (_props: InputDynamicProps) => ({
    fontSize: 14,
    color: theme.intents.primary.primary,
  }),

  // Icon color helper
  iconColor: ({ disabled = false }: InputDynamicProps) => ({
    color: theme.colors.text.primary,
  }),
}));
