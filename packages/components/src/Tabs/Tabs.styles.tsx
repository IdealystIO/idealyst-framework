import { StyleSheet } from 'react-native-unistyles';

export const tabsStyles = StyleSheet.create((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: 0,
    position: 'relative',
  },

  tab: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: theme.typography.fontFamily.sans,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    position: 'relative',

    variants: {
      size: {
        small: {
          fontSize: 14,
          padding: 8,
        },
        medium: {
          fontSize: 16,
          padding: 12,
        },
        large: {
          fontSize: 18,
          padding: 16,
        },
      },
      variant: {
        default: {
          borderBottomWidth: 2,
          borderBottomStyle: 'solid',
          borderBottomColor: 'transparent',
        },
        pills: {
          borderRadius: theme.borderRadius.md,
          marginRight: theme.spacing.xs,
        },
        underline: {
          borderBottomWidth: 2,
          borderBottomStyle: 'solid',
          borderBottomColor: 'transparent',
        },
      },
      active: {
        true: {
          color: theme.colors.text.primary,
          fontWeight: theme.typography.fontWeight.semibold,
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
      intent: {
        primary: {},
        neutral: {},
        success: {},
        error: {},
        warning: {},
      },
    },

    compoundVariants: [
      // Default variant - active states
      {
        variant: 'default',
        active: true,
        intent: 'primary',
        styles: {
          borderBottomColor: theme.intents.primary.main,
        },
      },
      {
        variant: 'default',
        active: true,
        intent: 'success',
        styles: {
          borderBottomColor: theme.intents.success.main,
        },
      },
      {
        variant: 'default',
        active: true,
        intent: 'error',
        styles: {
          borderBottomColor: theme.intents.error.main,
        },
      },
      {
        variant: 'default',
        active: true,
        intent: 'warning',
        styles: {
          borderBottomColor: theme.intents.warning.main,
        },
      },
      {
        variant: 'default',
        active: true,
        intent: 'neutral',
        styles: {
          borderBottomColor: theme.intents.neutral.main,
        },
      },

      // Pills variant - active states
      {
        variant: 'pills',
        active: true,
        intent: 'primary',
        styles: {
          backgroundColor: theme.intents.primary.main,
          color: theme.intents.primary.on,
        },
      },
      {
        variant: 'pills',
        active: true,
        intent: 'success',
        styles: {
          backgroundColor: theme.intents.success.main,
          color: theme.intents.success.on,
        },
      },
      {
        variant: 'pills',
        active: true,
        intent: 'error',
        styles: {
          backgroundColor: theme.intents.error.main,
          color: theme.intents.error.on,
        },
      },
      {
        variant: 'pills',
        active: true,
        intent: 'warning',
        styles: {
          backgroundColor: theme.intents.warning.main,
          color: theme.intents.warning.on,
        },
      },
      {
        variant: 'pills',
        active: true,
        intent: 'neutral',
        styles: {
          backgroundColor: theme.intents.neutral.main,
          color: theme.intents.neutral.on,
        },
      },

      // Pills variant - inactive hover
      {
        variant: 'pills',
        active: false,
        disabled: false,
        styles: {
          ':hover': {
            backgroundColor: theme.colors.surface.secondary,
          },
        },
      },

      // Underline variant - active states
      {
        variant: 'underline',
        active: true,
        intent: 'primary',
        styles: {
          borderBottomColor: theme.intents.primary.main,
          color: theme.intents.primary.main,
        },
      },
      {
        variant: 'underline',
        active: true,
        intent: 'success',
        styles: {
          borderBottomColor: theme.intents.success.main,
          color: theme.intents.success.main,
        },
      },
      {
        variant: 'underline',
        active: true,
        intent: 'error',
        styles: {
          borderBottomColor: theme.intents.error.main,
          color: theme.intents.error.main,
        },
      },
      {
        variant: 'underline',
        active: true,
        intent: 'warning',
        styles: {
          borderBottomColor: theme.intents.warning.main,
          color: theme.intents.warning.main,
        },
      },
      {
        variant: 'underline',
        active: true,
        intent: 'neutral',
        styles: {
          borderBottomColor: theme.intents.neutral.main,
          color: theme.intents.neutral.main,
        },
      },
    ],
  },

  tabIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabLabel: {
    whiteSpace: 'nowrap',
  },
}));
