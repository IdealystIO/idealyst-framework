import { StyleSheet } from 'react-native-unistyles';

export const checkboxStyles = StyleSheet.create((theme) => ({
  wrapper: {
    flexDirection: 'column',
    gap: theme.spacing.xs,
    
    // Web-specific styles
    _web: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: 'auto',
    },
  },
  
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    
    // Web-specific styles for proper layout
    _web: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      width: 'fit-content',
      cursor: 'pointer',
    },
  },
  
  checkbox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.sm,
    position: 'relative',
    transition: 'all 0.2s ease',
    
    variants: {
      size: {
        sm: {
          width: 16,
          height: 16,
        },
        md: {
          width: 20,
          height: 20,
        },
        lg: {
          width: 24,
          height: 24,
        },
      },
      intent: {
        primary: {
          backgroundColor: 'transparent',
          borderColor: theme.colors.border.primary,
        },
        success: {
          backgroundColor: 'transparent',
          borderColor: theme.colors.border.primary,
        },
        error: {
          backgroundColor: 'transparent',
          borderColor: theme.colors.border.primary,
        },
        warning: {
          backgroundColor: 'transparent',
          borderColor: theme.colors.border.primary,
        },
        neutral: {
          backgroundColor: 'transparent',
          borderColor: theme.colors.border.primary,
        },
        info: {
          backgroundColor: 'transparent',
          borderColor: theme.colors.border.primary,
        },
      },
      variant: {
        default: {
          // React Native border properties
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
          // Web-specific border override
          _web: {
            border: `1px solid ${theme.colors.border.primary}`,
          },
        },
        outlined: {
          // React Native border properties
          borderWidth: 2,
          borderColor: theme.colors.border.primary,
          // Web-specific border override
          _web: {
            border: `2px solid ${theme.colors.border.primary}`,
          },
        },
      },
      checked: {
        true: {
          // Checked state handled by compound variants
        },
        false: {
          backgroundColor: 'transparent',
        },
      },
      disabled: {
        true: {
          opacity: 0.5,
        },
        false: {
          opacity: 1,
        },
      },
    },
    
    compoundVariants: [
      // Checked state for each intent
      {
        checked: true,
        intent: 'primary',
        styles: {
          backgroundColor: theme.intents.primary.main,
          borderColor: theme.intents.primary.main,
          _web: {
            border: `1px solid ${theme.intents.primary.main}`,
          },
        },
      },
      {
        checked: true,
        intent: 'success',
        styles: {
          backgroundColor: theme.intents.success.main,
          borderColor: theme.intents.success.main,
          _web: {
            border: `1px solid ${theme.intents.success.main}`,
          },
        },
      },
      {
        checked: true,
        intent: 'error',
        styles: {
          backgroundColor: theme.intents.error.main,
          borderColor: theme.intents.error.main,
          _web: {
            border: `1px solid ${theme.intents.error.main}`,
          },
        },
      },
      {
        checked: true,
        intent: 'warning',
        styles: {
          backgroundColor: theme.intents.warning.main,
          borderColor: theme.intents.warning.main,
          _web: {
            border: `1px solid ${theme.intents.warning.main}`,
          },
        },
      },
      {
        checked: true,
        intent: 'neutral',
        styles: {
          backgroundColor: theme.intents.neutral.main,
          borderColor: theme.intents.neutral.main,
          _web: {
            border: `1px solid ${theme.intents.neutral.main}`,
          },
        },
      },
      {
        checked: true,
        intent: 'info',
        styles: {
          backgroundColor: theme.intents.info.main,
          borderColor: theme.intents.info.main,
          _web: {
            border: `1px solid ${theme.intents.info.main}`,
          },
        },
      },
    ],
    
    _web: {
      cursor: 'pointer',
      outline: 'none',
      display: 'flex',
      boxSizing: 'border-box',
      userSelect: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      appearance: 'none',
      _hover: {
        opacity: 0.8,
      },
      _focus: {
        outline: `2px solid ${theme.intents.primary.main}`,
        outlineOffset: '2px',
      },
    },
  },
}));

export const checkboxLabelStyles = StyleSheet.create((theme) => ({
  label: {
    color: theme.colors.text.primary,
    
    // Web-specific styles to prevent centering issues
    _web: {
      display: 'block',
      textAlign: 'left',
      margin: 0,
      padding: 0,
    },
    
    variants: {
      size: {
        sm: {
          fontSize: theme.typography?.fontSize?.sm || 14,
        },
        md: {
          fontSize: theme.typography?.fontSize?.md || 16,
        },
        lg: {
          fontSize: theme.typography?.fontSize?.lg || 18,
        },
      },
      disabled: {
        true: {
          color: theme.colors.text.disabled,
        },
        false: {
          color: theme.colors.text.primary,
        },
      },
    },
  },
}));

export const checkboxCheckmarkStyles = StyleSheet.create((theme) => ({
  checkmark: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',

    variants: {
      size: {
        sm: {
          width: 12,
          height: 12,
        },
        md: {
          width: 14,
          height: 14,
        },
        lg: {
          width: 16,
          height: 16,
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
    },
  },
}));

export const checkboxHelperStyles = StyleSheet.create((theme) => ({
  helperText: {
    fontSize: theme.typography?.fontSize?.sm || 14,
    color: theme.colors?.text?.secondary,
    marginTop: 2, // Reduced spacing between checkbox and helper text
    
    variants: {
      error: {
        true: {
          color: theme.intents.error.main,
        },
        false: {
          color: theme.colors?.text?.secondary,
        },
      },
    },
  },
})); 