import { StyleSheet } from 'react-native-unistyles';

export const inputStyles = StyleSheet.create((theme) => ({
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  leftIconContainer: {
    position: 'absolute',
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    variants: {
      size: {
        small: {
          left: 8,
          width: 16,
          height: 16,
        },
        medium: {
          left: 12,
          width: 20,
          height: 20,
        },
        large: {
          left: 16,
          width: 24,
          height: 24,
        },
      },
    },
  },
  rightIconContainer: {
    position: 'absolute',
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    variants: {
      size: {
        small: {
          right: 8,
          width: 16,
          height: 16,
        },
        medium: {
          right: 12,
          width: 20,
          height: 20,
        },
        large: {
          right: 16,
          width: 24,
          height: 24,
        },
      },
    },
  },
  leftIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: theme.colors.text.secondary,
    variants: {
      size: {
        small: {
          width: 16,
          height: 16,
          minWidth: 16,
          maxWidth: 16,
          minHeight: 16,
          maxHeight: 16,
        },
        medium: {
          width: 20,
          height: 20,
          minWidth: 20,
          maxWidth: 20,
          minHeight: 20,
          maxHeight: 20,
        },
        large: {
          width: 24,
          height: 24,
          minWidth: 24,
          maxWidth: 24,
          minHeight: 24,
          maxHeight: 24,
        },
      },
    },
  },
  rightIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: theme.colors.text.secondary,
    variants: {
      size: {
        small: {
          width: 16,
          height: 16,
          minWidth: 16,
          maxWidth: 16,
          minHeight: 16,
          maxHeight: 16,
        },
        medium: {
          width: 20,
          height: 20,
          minWidth: 20,
          maxWidth: 20,
          minHeight: 20,
          maxHeight: 20,
        },
        large: {
          width: 24,
          height: 24,
          minWidth: 24,
          maxWidth: 24,
          minHeight: 24,
          maxHeight: 24,
        },
      },
    },
  },
  passwordToggle: {
    position: 'absolute',
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    variants: {
      size: {
        small: {
          right: 8,
          width: 16,
          height: 16,
        },
        medium: {
          right: 12,
          width: 20,
          height: 20,
        },
        large: {
          right: 16,
          width: 24,
          height: 24,
        },
      },
    },
    _web: {
      _hover: {
        opacity: 0.7,
      },
    },
  },
  passwordToggleIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: theme.colors.text.secondary,
    variants: {
      size: {
        small: {
          width: 16,
          height: 16,
          minWidth: 16,
          maxWidth: 16,
          minHeight: 16,
          maxHeight: 16,
        },
        medium: {
          width: 20,
          height: 20,
          minWidth: 20,
          maxWidth: 20,
          minHeight: 20,
          maxHeight: 20,
        },
        large: {
          width: 24,
          height: 24,
          minWidth: 24,
          maxWidth: 24,
          minHeight: 24,
          maxHeight: 24,
        },
      },
    },
  },
  input: {
    width: '100%',
    variants: {
      size: {
        small: {
          height: 36,
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          fontSize: theme.typography?.fontSize?.sm || 14,
        },
        medium: {
          height: 44,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          fontSize: theme.typography?.fontSize?.md || 16,
        },
        large: {
          height: 52,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          fontSize: theme.typography?.fontSize?.lg || 18,
        },
      },
      hasLeftIcon: {
        true: {
          // Will be combined with size variant
        },
        false: {},
      },
      hasRightIcon: {
        true: {
          // Will be combined with size variant
        },
        false: {},
      },
      variant: {
        default: {
          backgroundColor: theme.colors.surface.primary,
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
          borderStyle: 'solid',
          color: theme.colors.text.primary,
          
          _web: {
            border: `1px solid ${theme.colors.border.primary}`,
          },
        },
        outlined: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.intents.primary.main,
          borderStyle: 'solid',
          color: theme.colors.text.primary,
          
          _web: {
            border: `1px solid ${theme.intents.primary.main}`,
          },
        },
        filled: {
          backgroundColor: theme.colors.surface.secondary,
          borderWidth: 0,
          borderColor: 'transparent',
          color: theme.colors.text.primary,
          
          _web: {
            border: 'none',
          },
        },
        bare: {
          backgroundColor: 'transparent',
          borderWidth: 0,
          borderColor: 'transparent',
          color: theme.colors.text.primary,
          paddingHorizontal: 0,
          paddingVertical: 0,
          
          _web: {
            border: 'none',
            boxShadow: 'none',
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
      // Small size with left icon
      {
        size: 'small',
        hasLeftIcon: true,
        styles: {
          paddingLeft: 32, // 8px base + 16px icon + 8px gap
        },
      },
      // Medium size with left icon
      {
        size: 'medium',
        hasLeftIcon: true,
        styles: {
          paddingLeft: 40, // 12px base + 20px icon + 8px gap
        },
      },
      // Large size with left icon
      {
        size: 'large',
        hasLeftIcon: true,
        styles: {
          paddingLeft: 48, // 16px base + 24px icon + 8px gap
        },
      },
      // Small size with right icon
      {
        size: 'small',
        hasRightIcon: true,
        styles: {
          paddingRight: 32,
        },
      },
      // Medium size with right icon
      {
        size: 'medium',
        hasRightIcon: true,
        styles: {
          paddingRight: 40,
        },
      },
      // Large size with right icon
      {
        size: 'large',
        hasRightIcon: true,
        styles: {
          paddingRight: 48,
        },
      },
      // Default variant focus
      {
        variant: 'default',
        focused: true,
        styles: {
          borderColor: theme.intents.primary.main,
          shadowColor: theme.intents.primary.main,
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
          borderColor: theme.intents.primary.main,
          borderStyle: 'solid',
        },
      },
      // Filled variant focus
      {
        variant: 'filled',
        focused: true,
        styles: {
          backgroundColor: theme.colors.surface.secondary,
          borderWidth: 0,
          shadowColor: theme.intents.primary.main,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.05,
          shadowRadius: 1,
          elevation: 0.5,
        },
      },
      // Bare variant focus (no visual changes)
      {
        variant: 'bare',
        focused: true,
        styles: {
          backgroundColor: 'transparent',
          borderWidth: 0,
          borderColor: 'transparent',
        },
      },
    ],
    
    borderRadius: theme.borderRadius.md,
    fontWeight: theme.typography?.fontWeight?.regular || '400',
    // Web-specific styles
    _web: {
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      fontFamily: 'inherit',
      _focus: {
        borderColor: theme.intents.primary.main,
      },
      _hover: {
        borderColor: theme.intents.primary.main,
      },
    },
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: theme.colors.surface.secondary,
    color: theme.colors.text.disabled,
    _web: {
      cursor: 'not-allowed',
    },
  },
  error: {
    borderWidth: 1,
    borderColor: theme.intents.error.main,
    borderStyle: 'solid',
    
    variants: {
      focused: {
        true: {
          shadowColor: theme.intents.error.main,
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
          borderColor: theme.intents.error.main,
        },
        filled: {
          // Add border for error even in filled variant
          borderWidth: 1,
          borderColor: theme.intents.error.main,
        },
      },
    },
    
    _web: {
      border: `1px solid ${theme.intents.error.main}`,
      _focus: {
        borderColor: theme.intents.error.main,
        boxShadow: `0 0 0 2px ${theme.intents.error.main}20`,
      },
    },
  },
})); 