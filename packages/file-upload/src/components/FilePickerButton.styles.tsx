/**
 * FilePickerButton styles using defineStyle.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type ButtonType = 'solid' | 'outline' | 'ghost';

export type FilePickerButtonVariants = {
  size: Size;
  intent: Intent;
  variant: ButtonType;
  disabled: boolean;
};

export type FilePickerButtonDynamicProps = {
  intent?: Intent;
  variant?: ButtonType;
  size?: Size;
  disabled?: boolean;
};

export const filePickerButtonStyles = defineStyle('FilePickerButton', (theme: Theme) => ({
  button: ({ intent = 'primary', variant = 'solid' }: FilePickerButtonDynamicProps) => ({
    boxSizing: 'border-box',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    fontWeight: '600',
    textAlign: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: variant === 'solid'
      ? theme.intents[intent].primary
      : variant === 'outline'
        ? theme.colors.surface.primary
        : 'transparent',
    borderColor: variant === 'outline'
      ? theme.intents[intent].primary
      : 'transparent',
    borderWidth: variant === 'outline' ? 1 : 0,
    borderStyle: variant === 'outline' ? 'solid' as const : undefined,
    _web: {
      display: 'flex',
      transition: 'all 0.1s ease',
      cursor: 'pointer',
    },
    variants: {
      size: {
        paddingVertical: theme.sizes.$button.paddingVertical,
        paddingHorizontal: theme.sizes.$button.paddingHorizontal,
        minHeight: theme.sizes.$button.minHeight,
      },
      disabled: {
        true: { opacity: 0.6, _web: { cursor: 'not-allowed' } },
        false: { opacity: 1, _web: { cursor: 'pointer', _hover: { opacity: 0.90 }, _active: { opacity: 0.75 } } },
      },
    },
  }),
  text: ({ intent = 'primary', variant = 'solid' }: FilePickerButtonDynamicProps) => ({
    fontWeight: '600',
    textAlign: 'center',
    color: variant === 'solid'
      ? theme.intents[intent].contrast
      : theme.intents[intent].primary,
    variants: {
      size: {
        fontSize: theme.sizes.$button.fontSize,
        lineHeight: theme.sizes.$button.fontSize,
      },
      disabled: {
        true: { opacity: 0.6 },
        false: { opacity: 1 },
      },
    },
  }),
  icon: ({ intent = 'primary', variant = 'solid' }: FilePickerButtonDynamicProps) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: variant === 'solid'
      ? theme.intents[intent].contrast
      : theme.intents[intent].primary,
    variants: {
      size: {
        width: theme.sizes.$button.iconSize,
        height: theme.sizes.$button.iconSize,
      },
    },
  }),
  spinner: ({ intent = 'primary', variant = 'solid' }: FilePickerButtonDynamicProps) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: variant === 'solid'
      ? theme.intents[intent].contrast
      : theme.intents[intent].primary,
    variants: {
      size: {
        width: theme.sizes.$button.iconSize,
        height: theme.sizes.$button.iconSize,
      },
    },
  }),
}));
