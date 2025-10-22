import { StyleSheet } from 'react-native-unistyles';

export const tooltipStyles = StyleSheet.create((theme) => ({
  container: {
    position: 'relative',

    _web: {
      display: 'inline-flex',
    },
  },

  tooltip: {
    borderRadius: theme.borderRadius.md,
    maxWidth: 300,

    // Native shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,

    variants: {
      size: {
        sm: {
          fontSize: 12,
          padding: 6,
        },
        md: {
          fontSize: 14,
          padding: 8,
        },
        lg: {
          fontSize: 16,
          padding: 10,
        },
      },
      intent: {
        primary: {
          backgroundColor: theme.intents.primary.main,
          color: theme.intents.primary.on,
        },
        neutral: {
          backgroundColor: theme.intents.neutral.main,
          color: theme.intents.neutral.on,
        },
        success: {
          backgroundColor: theme.intents.success.main,
          color: theme.intents.success.on,
        },
        error: {
          backgroundColor: theme.intents.error.main,
          color: theme.intents.error.on,
        },
        warning: {
          backgroundColor: theme.intents.warning.main,
          color: theme.intents.warning.on,
        },
      },
      visible: {
        true: {
          opacity: 1,
        },
        false: {
          opacity: 0,
        },
      },
      placement: {
        top: {},
        bottom: {},
        left: {},
        right: {},
      },
    },

    _web: {
      position: 'absolute',
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      pointerEvents: 'none',
      opacity: 0,
      transition: 'opacity 0.2s ease',
      whiteSpace: 'nowrap',

      variants: {
        placement: {
          top: {
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 8,
          },
          bottom: {
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: 8,
          },
          left: {
            right: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            marginRight: 8,
          },
          right: {
            left: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            marginLeft: 8,
          },
        },
      },
    },
  },

  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',

    variants: {
      placement: {
        top: {
          bottom: -4,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '4px 4px 0 4px',
          borderColor: 'transparent',
        },
        bottom: {
          top: -4,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '0 4px 4px 4px',
          borderColor: 'transparent',
        },
        left: {
          right: -4,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: '4px 0 4px 4px',
          borderColor: 'transparent',
        },
        right: {
          left: -4,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: '4px 4px 4px 0',
          borderColor: 'transparent',
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
      {
        placement: 'top',
        intent: 'primary',
        styles: {
          borderTopColor: (theme) => theme.intents.primary.main,
        },
      },
      {
        placement: 'top',
        intent: 'neutral',
        styles: {
          borderTopColor: (theme) => theme.intents.neutral.main,
        },
      },
      {
        placement: 'top',
        intent: 'success',
        styles: {
          borderTopColor: (theme) => theme.intents.success.main,
        },
      },
      {
        placement: 'top',
        intent: 'error',
        styles: {
          borderTopColor: (theme) => theme.intents.error.main,
        },
      },
      {
        placement: 'top',
        intent: 'warning',
        styles: {
          borderTopColor: (theme) => theme.intents.warning.main,
        },
      },

      {
        placement: 'bottom',
        intent: 'primary',
        styles: {
          borderBottomColor: (theme) => theme.intents.primary.main,
        },
      },
      {
        placement: 'bottom',
        intent: 'neutral',
        styles: {
          borderBottomColor: (theme) => theme.intents.neutral.main,
        },
      },
      {
        placement: 'bottom',
        intent: 'success',
        styles: {
          borderBottomColor: (theme) => theme.intents.success.main,
        },
      },
      {
        placement: 'bottom',
        intent: 'error',
        styles: {
          borderBottomColor: (theme) => theme.intents.error.main,
        },
      },
      {
        placement: 'bottom',
        intent: 'warning',
        styles: {
          borderBottomColor: (theme) => theme.intents.warning.main,
        },
      },

      {
        placement: 'left',
        intent: 'primary',
        styles: {
          borderLeftColor: (theme) => theme.intents.primary.main,
        },
      },
      {
        placement: 'left',
        intent: 'neutral',
        styles: {
          borderLeftColor: (theme) => theme.intents.neutral.main,
        },
      },
      {
        placement: 'left',
        intent: 'success',
        styles: {
          borderLeftColor: (theme) => theme.intents.success.main,
        },
      },
      {
        placement: 'left',
        intent: 'error',
        styles: {
          borderLeftColor: (theme) => theme.intents.error.main,
        },
      },
      {
        placement: 'left',
        intent: 'warning',
        styles: {
          borderLeftColor: (theme) => theme.intents.warning.main,
        },
      },

      {
        placement: 'right',
        intent: 'primary',
        styles: {
          borderRightColor: (theme) => theme.intents.primary.main,
        },
      },
      {
        placement: 'right',
        intent: 'neutral',
        styles: {
          borderRightColor: (theme) => theme.intents.neutral.main,
        },
      },
      {
        placement: 'right',
        intent: 'success',
        styles: {
          borderRightColor: (theme) => theme.intents.success.main,
        },
      },
      {
        placement: 'right',
        intent: 'error',
        styles: {
          borderRightColor: (theme) => theme.intents.error.main,
        },
      },
      {
        placement: 'right',
        intent: 'warning',
        styles: {
          borderRightColor: (theme) => theme.intents.warning.main,
        },
      },
    ],
  },
}));
