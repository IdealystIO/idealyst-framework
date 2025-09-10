import { createStyleSheet } from 'react-native-unistyles';

export const dateInputStyles = createStyleSheet((theme) => ({
  container: {
    width: '100%',
  },
  
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    fontSize: theme.typography.body.fontSize,
    fontFamily: theme.typography.body.fontFamily,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    
    variants: {
      size: {
        small: {
          paddingHorizontal: theme.spacing.small,
          paddingVertical: theme.spacing.xs,
          fontSize: theme.typography.caption.fontSize,
        },
        medium: {
          paddingHorizontal: theme.spacing.medium,
          paddingVertical: theme.spacing.small,
          fontSize: theme.typography.body.fontSize,
        },
        large: {
          paddingHorizontal: theme.spacing.large,
          paddingVertical: theme.spacing.medium,
          fontSize: theme.typography.subtitle.fontSize,
        },
      },
      
      variant: {
        outlined: {
          borderWidth: 1,
          backgroundColor: 'transparent',
        },
        filled: {
          borderWidth: 0,
          backgroundColor: theme.colors.surfaceVariant,
        },
      },
      
      state: {
        focused: {
          borderColor: theme.colors.primary,
          borderWidth: 2,
        },
        disabled: {
          backgroundColor: theme.colors.disabled,
          color: theme.colors.onDisabled,
          borderColor: theme.colors.outline,
        },
        error: {
          borderColor: theme.colors.error,
          borderWidth: 2,
        },
      },
    },
    
    _web: {
      outlineStyle: 'none',
      cursor: 'text',
      
      ':focus': {
        borderColor: theme.colors.primary,
        borderWidth: 2,
      },
      
      ':disabled': {
        cursor: 'not-allowed',
      },
    },
  },
  
  inputError: {
    borderColor: theme.colors.error,
    borderWidth: 2,
  },
  
  inputFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  
  inputDisabled: {
    backgroundColor: theme.colors.disabled,
    color: theme.colors.onDisabled,
    borderColor: theme.colors.outline,
  },
  
  label: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: theme.typography.caption.fontFamily,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  
  helperText: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: theme.typography.caption.fontFamily,
    color: theme.colors.onSurfaceVariant,
    marginTop: theme.spacing.xs,
  },
  
  errorText: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: theme.typography.caption.fontFamily,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
}));