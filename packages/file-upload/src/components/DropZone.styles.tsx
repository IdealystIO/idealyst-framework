/**
 * DropZone styles using defineStyle.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type DropZoneVariants = {
  active: boolean;
  reject: boolean;
  disabled: boolean;
};

export type DropZoneDynamicProps = {
  active?: boolean;
  reject?: boolean;
  disabled?: boolean;
  intent?: Intent;
};

export const dropZoneStyles = defineStyle('DropZone', (theme: Theme) => ({
  container: ({ active = false, reject = false, disabled = false }: DropZoneDynamicProps) => ({
    borderWidth: 2,
    borderStyle: 'dashed' as const,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: active
      ? theme.intents.primary.surface
      : reject
        ? theme.intents.error.surface
        : theme.colors.surface.secondary,
    borderColor: active
      ? theme.intents.primary.primary
      : reject
        ? theme.intents.error.primary
        : theme.colors.border.secondary,
    opacity: disabled ? 0.6 : 1,
    _web: {
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
    },
    variants: {
      active: {
        true: {
          backgroundColor: theme.intents.primary.surface,
          borderColor: theme.intents.primary.primary,
        },
        false: {},
      },
      reject: {
        true: {
          backgroundColor: theme.intents.error.surface,
          borderColor: theme.intents.error.primary,
        },
        false: {},
      },
      disabled: {
        true: { opacity: 0.6, _web: { cursor: 'not-allowed' } },
        false: { opacity: 1, _web: { cursor: 'pointer' } },
      },
    },
  }),
  content: (_props: DropZoneDynamicProps) => ({
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  }),
  icon: ({ active = false, reject = false }: DropZoneDynamicProps) => ({
    fontSize: 48,
    color: active
      ? theme.intents.primary.primary
      : reject
        ? theme.intents.error.primary
        : theme.colors.text.secondary,
  }),
  text: ({ active = false, reject = false }: DropZoneDynamicProps) => ({
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: active
      ? theme.intents.primary.primary
      : reject
        ? theme.intents.error.primary
        : theme.colors.text.primary,
  }),
  hint: (_props: DropZoneDynamicProps) => ({
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  }),
}));
