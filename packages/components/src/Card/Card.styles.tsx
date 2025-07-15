import { StyleSheet } from 'react-native-unistyles';

export const cardStyles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors?.surface?.primary || '#ffffff',
    position: 'relative',
    overflow: 'hidden',
    
    variants: {
      variant: {
        default: {
          backgroundColor: theme.colors?.surface?.primary || '#ffffff',
          // React Native border properties
          borderWidth: 1,
          borderColor: theme.colors?.border?.primary || theme.palettes?.gray?.[200] || '#e5e7eb',
          // Web-specific border override
          _web: {
            border: `1px solid ${theme.colors?.border?.primary || theme.palettes?.gray?.[200] || '#e5e7eb'}`,
          },
        },
        outlined: {
          backgroundColor: 'transparent',
          // React Native border properties
          borderWidth: 1,
          borderColor: theme.colors?.border?.primary || theme.palettes?.gray?.[300] || '#d1d5db',
          // Web-specific border override
          _web: {
            border: `1px solid ${theme.colors?.border?.primary || theme.palettes?.gray?.[300] || '#d1d5db'}`,
          },
        },
        elevated: {
          backgroundColor: theme.colors?.surface?.primary || '#ffffff',
          borderWidth: 0,
          _web: {
            border: 'none',
          },
        },
        filled: {
          backgroundColor: theme.colors?.surface?.secondary || theme.palettes?.gray?.[50] || '#f9fafb',
          borderWidth: 0,
          _web: {
            border: 'none',
          },
        },
      },
      padding: {
        none: {
          padding: 0,
        },
        small: {
          padding: theme.spacing?.sm || 8,
        },
        medium: {
          padding: theme.spacing?.md || 12,
        },
        large: {
          padding: theme.spacing?.lg || 16,
        },
      },
      radius: {
        none: {
          borderRadius: 0,
        },
        small: {
          borderRadius: theme.borderRadius?.sm || 4,
        },
        medium: {
          borderRadius: theme.borderRadius?.md || 8,
        },
        large: {
          borderRadius: theme.borderRadius?.lg || 12,
        },
      },
      intent: {
        neutral: {
          // Default colors handled by variant
        },
        primary: {
          // Intent colors applied via compound variants
        },
        success: {
          // Intent colors applied via compound variants  
        },
        error: {
          // Intent colors applied via compound variants
        },
        warning: {
          // Intent colors applied via compound variants
        },
        info: {
          // Intent colors applied via compound variants
        },
      },
      clickable: {
        true: {
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        },
        false: {
          cursor: 'default',
        },
      },
      disabled: {
        true: {
          opacity: 0.6,
          cursor: 'not-allowed',
        },
        false: {
          opacity: 1,
        },
      },
    },
    
    compoundVariants: [
      // Elevated variant with shadows
      {
        variant: 'elevated',
        styles: {
          shadowColor: theme.shadows?.md?.shadowColor || '#000',
          shadowOffset: theme.shadows?.md?.shadowOffset || { width: 0, height: 4 },
          shadowOpacity: theme.shadows?.md?.shadowOpacity || 0.1,
          shadowRadius: theme.shadows?.md?.shadowRadius || 8,
          elevation: theme.shadows?.md?.elevation || 4,
          // More subtle shadow for web
          _web: {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
          },
        },
      },
      // Intent color combinations for outlined variant
      {
        variant: 'outlined',
        intent: 'primary',
        styles: {
          borderColor: theme.intents?.primary?.main || '#3b82f6',
          _web: {
            border: `1px solid ${theme.intents?.primary?.main || '#3b82f6'}`,
          },
        },
      },
      {
        variant: 'outlined',
        intent: 'success',
        styles: {
          borderColor: theme.intents?.success?.main || '#22c55e',
          _web: {
            border: `1px solid ${theme.intents?.success?.main || '#22c55e'}`,
          },
        },
      },
      {
        variant: 'outlined',
        intent: 'error',
        styles: {
          borderColor: theme.intents?.error?.main || '#ef4444',
          _web: {
            border: `1px solid ${theme.intents?.error?.main || '#ef4444'}`,
          },
        },
      },
      {
        variant: 'outlined',
        intent: 'warning',
        styles: {
          borderColor: theme.intents?.warning?.main || '#f59e0b',
          _web: {
            border: `1px solid ${theme.intents?.warning?.main || '#f59e0b'}`,
          },
        },
      },
      {
        variant: 'outlined',
        intent: 'info',
        styles: {
          borderColor: theme.intents?.info?.main || '#06b6d4',
          _web: {
            border: `1px solid ${theme.intents?.info?.main || '#06b6d4'}`,
          },
        },
      },
      // Intent color combinations for filled variant
      {
        variant: 'filled',
        intent: 'primary',
        styles: {
          backgroundColor: theme.intents?.primary?.container || theme.palettes?.blue?.[50] || '#eff6ff',
        },
      },
      {
        variant: 'filled',
        intent: 'success',
        styles: {
          backgroundColor: theme.intents?.success?.container || theme.palettes?.green?.[50] || '#f0fdf4',
        },
      },
      {
        variant: 'filled',
        intent: 'error',
        styles: {
          backgroundColor: theme.intents?.error?.container || theme.palettes?.red?.[50] || '#fef2f2',
        },
      },
      {
        variant: 'filled',
        intent: 'warning',
        styles: {
          backgroundColor: theme.intents?.warning?.container || theme.palettes?.amber?.[50] || '#fffbeb',
        },
      },
      {
        variant: 'filled',
        intent: 'info',
        styles: {
          backgroundColor: theme.intents?.info?.container || theme.palettes?.cyan?.[50] || '#ecfeff',
        },
      },
    ],
    
    _web: {
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      _hover: {
        // Hover effects for clickable cards
      },
    },
  },
}));

// Add hover effects for clickable cards
export const cardHoverStyles = StyleSheet.create((theme) => ({
  clickableHover: {
    _web: {
      _hover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
    },
  },
})); 