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
 * Uses $iterator pattern to support size variants (xs, sm, md, lg, xl).
 */
export const dateTimeInputStyles = defineStyle('DateTimeInput', (theme: Theme) => ({
  // Input container for DateInput/TimeInput
  inputContainer: (_props: InputDynamicProps) => ({
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderStyle: 'solid' as const,
    borderRadius: theme.radii.md,
    overflow: 'hidden' as const,
    borderColor: theme.colors.border.primary,
    backgroundColor: theme.colors.surface.primary,
    // Default padding/height for when size variant isn't specified
    height: theme.sizes.input.md.height,
    paddingHorizontal: theme.sizes.input.md.paddingHorizontal,
    _web: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    variants: {
      disabled: {
        true: { backgroundColor: theme.colors.surface.secondary },
        false: { backgroundColor: theme.colors.surface.primary },
      },
      error: {
        true: { borderColor: theme.intents.danger.primary },
        false: { borderColor: theme.colors.border.primary },
      },
      // $iterator expands for each input size (xs, sm, md, lg, xl)
      size: {
        height: theme.sizes.$input.height,
        paddingHorizontal: theme.sizes.$input.paddingHorizontal,
      },
    },
  }),

  // Text input inside the input container
  textInput: (_props: InputDynamicProps) => ({
    flex: 1,
    minWidth: 0,
    backgroundColor: 'transparent',
    color: theme.colors.text.primary,
    fontWeight: '400' as const,
    // Default font size for when size variant isn't specified
    fontSize: theme.sizes.input.md.fontSize,
    _web: {
      outline: 'none',
      border: 'none',
      fontFamily: 'inherit',
    },
    variants: {
      disabled: {
        true: { color: theme.colors.text.tertiary },
        false: { color: theme.colors.text.primary },
      },
      // $iterator expands for each input size
      size: {
        fontSize: theme.sizes.$input.fontSize,
      },
    },
  }),

  // Icon button inside input
  iconButton: (_props: InputDynamicProps) => ({
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: 4,
    backgroundColor: 'transparent',
    borderWidth: 0,
    flexShrink: 0,
    // Default icon sizing for when size variant isn't specified
    width: theme.sizes.input.md.iconSize,
    height: theme.sizes.input.md.iconSize,
    marginLeft: theme.sizes.input.md.iconMargin,
    _web: {
      display: 'flex',
      background: 'none',
      border: 'none',
      padding: 0,
    },
    variants: {
      disabled: {
        true: { opacity: 0.4, _web: { cursor: 'not-allowed' } },
        false: { opacity: 1, _web: { cursor: 'pointer' } },
      },
      // $iterator expands for each input size
      size: {
        width: theme.sizes.$input.iconSize,
        height: theme.sizes.$input.iconSize,
        marginLeft: theme.sizes.$input.iconMargin,
      },
    },
  }),

  // Icon inside button - sized based on input size
  icon: (_props: InputDynamicProps) => ({
    color: theme.colors.text.secondary,
    // Default icon sizing for when size variant isn't specified
    width: theme.sizes.input.md.iconSize,
    height: theme.sizes.input.md.iconSize,
    variants: {
      // $iterator expands for each input size
      size: {
        width: theme.sizes.$input.iconSize,
        height: theme.sizes.$input.iconSize,
      },
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
  closeButton: (_props: InputDynamicProps) => ({
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: 4,
    _web: {
      display: 'flex',
    },
    variants: {
      disabled: {
        true: { opacity: 0.4, _web: { cursor: 'not-allowed' } },
        false: { opacity: 1, _web: { cursor: 'pointer' } },
      },
    },
  }),

  closeButtonText: (_props: InputDynamicProps) => ({
    fontSize: 14,
    color: theme.intents.primary.primary,
  }),

  // Icon color helper
  iconColor: (_props: InputDynamicProps) => ({
    color: theme.colors.text.secondary,
  }),
}));
