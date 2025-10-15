import { StyleSheet } from 'react-native-unistyles';

export const tabBarStyles = StyleSheet.create((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: 0,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: theme.colors.border.primary,
  },

  tab: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    transition: 'color 0.2s ease',
    fontFamily: theme.typography.fontFamily.sans,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    position: 'relative',
    zIndex: 1,

    variants: {
      size: {
        small: {
          fontSize: 14,
          padding: 8,
          lineHeight: 20,
        },
        medium: {
          fontSize: 16,
          padding: 12,
          lineHeight: 24,
        },
        large: {
          fontSize: 18,
          padding: 16,
          lineHeight: 28,
        },
      },
      variant: {
        default: {},
        pills: {
          borderRadius: theme.borderRadius.md,
          marginRight: theme.spacing.xs,
        },
        underline: {},
      },
      active: {
        true: {
          color: theme.colors.text.primary,
        },
        false: {},
      },
      disabled: {
        true: {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
        false: {
          ':hover': {
            color: theme.colors.text.primary,
          },
        },
      },
    },

    compoundVariants: [
      // Pills variant - active text color
      {
        variant: 'pills',
        active: true,
        intent: 'primary',
        styles: {
          color: theme.intents.primary.on,
        },
      },
      {
        variant: 'pills',
        active: true,
        intent: 'success',
        styles: {
          color: theme.intents.success.on,
        },
      },
      {
        variant: 'pills',
        active: true,
        intent: 'error',
        styles: {
          color: theme.intents.error.on,
        },
      },
      {
        variant: 'pills',
        active: true,
        intent: 'warning',
        styles: {
          color: theme.intents.warning.on,
        },
      },
      {
        variant: 'pills',
        active: true,
        intent: 'neutral',
        styles: {
          color: theme.intents.neutral.on,
        },
      },

      // Underline variant - active text color
      {
        variant: 'underline',
        active: true,
        intent: 'primary',
        styles: {
          color: theme.intents.primary.main,
        },
      },
      {
        variant: 'underline',
        active: true,
        intent: 'success',
        styles: {
          color: theme.intents.success.main,
        },
      },
      {
        variant: 'underline',
        active: true,
        intent: 'error',
        styles: {
          color: theme.intents.error.main,
        },
      },
      {
        variant: 'underline',
        active: true,
        intent: 'warning',
        styles: {
          color: theme.intents.warning.main,
        },
      },
      {
        variant: 'underline',
        active: true,
        intent: 'neutral',
        styles: {
          color: theme.intents.neutral.main,
        },
      },
    ],
  },

  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',

    variants: {
      variant: {
        default: {
          bottom: -1,
          height: 2,
        },
        pills: {
          height: '100%',
          borderRadius: theme.borderRadius.md,
          bottom: 0,
          top: 0,
          zIndex: 0,
        },
        underline: {
          bottom: -1,
          height: 2,
        },
      },
      intent: {
        primary: {
          backgroundColor: theme.intents.primary.main,
        },
        success: {
          backgroundColor: theme.intents.success.main,
        },
        error: {
          backgroundColor: theme.intents.error.main,
        },
        warning: {
          backgroundColor: theme.intents.warning.main,
        },
        neutral: {
          backgroundColor: theme.intents.neutral.main,
        },
      },
    },
  },
}));
