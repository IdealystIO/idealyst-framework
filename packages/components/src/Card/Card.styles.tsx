import { StyleSheet } from 'react-native-unistyles';

export const cardStyles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface.primary,
    position: 'relative',
    overflow: 'hidden',
    
    variants: {
      variant: {
        default: {
          backgroundColor: theme.colors.surface.primary,
          // React Native border properties
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
          // Web-specific border override
          _web: {
            border: `1px solid ${theme.colors.border.primary}`,
          },
        },
        outlined: {
          backgroundColor: 'transparent',
          // React Native border properties
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
          // Web-specific border override
          _web: {
            border: `1px solid ${theme.colors.border.primary}`,
          },
        },
        elevated: {
          backgroundColor: theme.colors.surface.primary,
          borderWidth: 0,
          _web: {
            border: 'none',
          },
        },
        filled: {
          backgroundColor: theme.colors.surface.secondary,
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
          padding: theme.spacing.sm,
        },
        medium: {
          padding: theme.spacing.md,
        },
        large: {
          padding: theme.spacing.lg,
        },
      },
      radius: {
        none: {
          borderRadius: 0,
        },
        small: {
          borderRadius: theme.borderRadius.sm,
        },
        medium: {
          borderRadius: theme.borderRadius.md,
        },
        large: {
          borderRadius: theme.borderRadius.lg,
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
          shadowColor: theme.shadows.md.shadowColor,
          shadowOffset: theme.shadows.md.shadowOffset,
          shadowOpacity: theme.shadows.md.shadowOpacity,
          shadowRadius: theme.shadows.md.shadowRadius,
          elevation: theme.shadows.md.elevation,
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
          borderColor: theme.intents.primary.main,
          _web: {
            border: `1px solid ${theme.intents.primary.main}`,
          },
        },
      },
      {
        variant: 'outlined',
        intent: 'success',
        styles: {
          borderColor: theme.intents.success.main,
          _web: {
            border: `1px solid ${theme.intents.success.main}`,
          },
        },
      },
      {
        variant: 'outlined',
        intent: 'error',
        styles: {
          borderColor: theme.intents.error.main,
          _web: {
            border: `1px solid ${theme.intents.error.main}`,
          },
        },
      },
      {
        variant: 'outlined',
        intent: 'warning',
        styles: {
          borderColor: theme.intents.warning.main,
          _web: {
            border: `1px solid ${theme.intents.warning.main}`,
          },
        },
      },
      {
        variant: 'outlined',
        intent: 'info',
        styles: {
          borderColor: theme.intents.info.main,
          _web: {
            border: `1px solid ${theme.intents.info.main}`,
          },
        },
      },
      // Intent color combinations for filled variant
      {
        variant: 'filled',
        intent: 'primary',
        styles: {
          backgroundColor: theme.intents.primary.container,
        },
      },
      {
        variant: 'filled',
        intent: 'success',
        styles: {
          backgroundColor: theme.intents.success.container,
        },
      },
      {
        variant: 'filled',
        intent: 'error',
        styles: {
          backgroundColor: theme.intents.error.container,
        },
      },
      {
        variant: 'filled',
        intent: 'warning',
        styles: {
          backgroundColor: theme.intents.warning.container,
        },
      },
      {
        variant: 'filled',
        intent: 'info',
        styles: {
          backgroundColor: theme.intents.info.container,
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