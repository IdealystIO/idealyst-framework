import { StyleSheet } from 'react-native-unistyles';

export const inputStyles = StyleSheet.create((theme) => ({
  input: {
    variants: {
      size: {
        small: {
          height: 36,
          paddingHorizontal: theme.spacing?.sm || 8,
          paddingVertical: theme.spacing?.xs || 4,
          fontSize: theme.typography?.fontSize?.sm || 14,
        },
        medium: {
          height: 44,
          paddingHorizontal: theme.spacing?.md || 12,
          paddingVertical: theme.spacing?.sm || 8,
          fontSize: theme.typography?.fontSize?.md || 16,
        },
        large: {
          height: 52,
          paddingHorizontal: theme.spacing?.lg || 16,
          paddingVertical: theme.spacing?.md || 12,
          fontSize: theme.typography?.fontSize?.lg || 18,
        },
      },
      variant: {
        default: {
          backgroundColor: theme.colors?.surface?.primary || '#ffffff',
          borderWidth: 1,
          borderColor: theme.colors?.border?.primary || '#e5e7eb',
          borderStyle: 'solid',
          color: theme.colors?.text?.primary || '#000000',
          
          _web: {
            border: `1px solid ${theme.colors?.border?.primary || '#e5e7eb'}`,
          },
        },
        outlined: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.intents?.primary?.main || '#3b82f6',
          borderStyle: 'solid',
          color: theme.colors?.text?.primary || '#000000',
          
          _web: {
            border: `1px solid ${theme.intents?.primary?.main || '#3b82f6'}`,
          },
        },
        filled: {
          backgroundColor: theme.colors?.surface?.secondary || '#f9fafb',
          borderWidth: 0,
          borderColor: 'transparent',
          color: theme.colors?.text?.primary || '#000000',
          
          _web: {
            border: 'none',
          },
        },
      },
      focused: {
        true: {
          // Base focused styles - will be overridden by compound variants
        },
        false: {
          // No additional styles when not focused
        },
      },
    },
    
    compoundVariants: [
      // Default variant focus
      {
        variant: 'default',
        focused: true,
        styles: {
          borderColor: theme.intents?.primary?.main || '#3b82f6',
          shadowColor: theme.intents?.primary?.main || '#3b82f6',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1,
        },
      },
      // Outlined variant focus
      {
        variant: 'outlined',
        focused: true,
        styles: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.intents?.primary?.main || '#3b82f6',
          borderStyle: 'solid',
        },
      },
      // Filled variant focus
      {
        variant: 'filled',
        focused: true,
        styles: {
          backgroundColor: theme.colors?.surface?.secondary || '#f3f4f6',
          borderWidth: 0,
          shadowColor: theme.intents?.primary?.main || '#3b82f6',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.05,
          shadowRadius: 1,
          elevation: 0.5,
        },
      },
    ],
    
    borderRadius: theme.borderRadius?.md || 8,
    fontWeight: theme.typography?.fontWeight?.regular || '400',
    // Web-specific styles
    _web: {
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      fontFamily: 'inherit',
      _focus: {
        borderColor: theme.intents?.primary?.main || '#3b82f6',
      },
      _hover: {
        borderColor: theme.intents?.primary?.main || '#3b82f6',
      },
    },
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: theme.colors?.surface?.secondary || '#f3f4f6',
    color: theme.colors?.text?.disabled || '#9ca3af',
    _web: {
      cursor: 'not-allowed',
    },
  },
  error: {
    borderWidth: 1,
    borderColor: theme.intents?.error?.main || '#ef4444',
    borderStyle: 'solid',
    
    variants: {
      focused: {
        true: {
          shadowColor: theme.intents?.error?.main || '#ef4444',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1,
        },
        false: {
          // No additional styles when not focused
        },
      },
      variant: {
        default: {
          // Use default error styles
        },
        outlined: {
          // Override outlined styles for error
          borderColor: theme.intents?.error?.main || '#ef4444',
        },
        filled: {
          // Add border for error even in filled variant
          borderWidth: 1,
          borderColor: theme.intents?.error?.main || '#ef4444',
        },
      },
    },
    
    _web: {
      border: `1px solid ${theme.intents?.error?.main || '#ef4444'}`,
      _focus: {
        borderColor: theme.intents?.error?.main || '#ef4444',
        boxShadow: `0 0 0 2px ${theme.intents?.error?.main || '#ef4444'}20`,
      },
    },
  },
})); 