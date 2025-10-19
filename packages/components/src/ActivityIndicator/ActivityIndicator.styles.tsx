import { StyleSheet } from 'react-native-unistyles';

export const activityIndicatorStyles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    
    variants: {
      size: {
        small: {
          width: 20,
          height: 20,
        },
        medium: {
          width: 36,
          height: 36,
        },
        large: {
          width: 48,
          height: 48,
        },
      },
      intent: {
        primary: {},
        success: {},
        error: {},
        warning: {},
        neutral: {},
      },
      animating: {
        true: {
          opacity: 1,
        },
        false: {
          opacity: 0,
        },
      },
    },
  },
  
  spinner: {
    borderRadius: 9999,
    borderStyle: 'solid',
    
    // Web-specific animation styles
    _web: {
      borderColor: 'transparent',
      animation: 'spin 1s linear infinite',
      boxSizing: 'border-box',
    },
    
    variants: {
      size: {
        small: {
          width: 20,
          height: 20,
          borderWidth: 2,
        },
        medium: {
          width: 36,
          height: 36,
          borderWidth: 3,
        },
        large: {
          width: 48,
          height: 48,
          borderWidth: 4,
        },
      },
      intent: {
        primary: {
          color: theme.intents.primary.main,
          _web: {
            borderTopColor: theme.intents.primary.main,
            borderRightColor: theme.intents.primary.main,
          },
        },
        success: {
          color: theme.intents.success.main,
          _web: {
            borderTopColor: theme.intents.success.main,
            borderRightColor: theme.intents.success.main,
          },
        },
        error: {
          color: theme.intents.error.main,
          _web: {
            borderTopColor: theme.intents.error.main,
            borderRightColor: theme.intents.error.main,
          },
        },
        warning: {
          color: theme.intents.warning.main,
          _web: {
            borderTopColor: theme.intents.warning.main,
            borderRightColor: theme.intents.warning.main,
          },
        },
        neutral: {
          color: theme.intents.neutral.main,
          _web: {
            borderTopColor: theme.intents.neutral.main,
            borderRightColor: theme.intents.neutral.main,
          },
        },
      },
      animating: {
        true: {},
        false: {},
      },
    },
  },
}));