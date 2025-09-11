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
          color: theme.intents?.primary?.main || '#3b82f6',
          _web: {
            borderTopColor: theme.intents?.primary?.main || '#3b82f6',
            borderRightColor: theme.intents?.primary?.main || '#3b82f6',
          },
        },
        success: {
          color: theme.intents?.success?.main || '#22c55e',
          _web: {
            borderTopColor: theme.intents?.success?.main || '#22c55e',
            borderRightColor: theme.intents?.success?.main || '#22c55e',
          },
        },
        error: {
          color: theme.intents?.error?.main || '#ef4444',
          _web: {
            borderTopColor: theme.intents?.error?.main || '#ef4444',
            borderRightColor: theme.intents?.error?.main || '#ef4444',
          },
        },
        warning: {
          color: theme.intents?.warning?.main || '#f59e0b',
          _web: {
            borderTopColor: theme.intents?.warning?.main || '#f59e0b',
            borderRightColor: theme.intents?.warning?.main || '#f59e0b',
          },
        },
        neutral: {
          color: theme.intents?.neutral?.main || '#6b7280',
          _web: {
            borderTopColor: theme.intents?.neutral?.main || '#6b7280',
            borderRightColor: theme.intents?.neutral?.main || '#6b7280',
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