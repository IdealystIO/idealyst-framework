import { StyleSheet } from 'react-native-unistyles';
import { generateIntentVariants, generateButtonCompoundVariants } from '../theme/variantHelpers';

export const buttonStyles = StyleSheet.create((theme) => ({
  button: {
    // Base styles - no borders defined here
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius?.md || 8,
    fontWeight: '600',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    // Set default color to prevent fallback to theme.colors.text.placeholder
    color: theme.intents?.primary?.on || '#ffffff',
    
    // All variants defined here
    variants: {
      size: {
        sm: {
          paddingHorizontal: theme.spacing?.sm || 8,
          paddingVertical: theme.spacing?.xs || 4,
          minHeight: 24,
        },
        md: {
          paddingHorizontal: theme.spacing?.md || 12,
          paddingVertical: theme.spacing?.sm || 8,
          minHeight: 32,
        },
        lg: {
          paddingHorizontal: theme.spacing?.lg || 16,
          paddingVertical: theme.spacing?.md || 12,
          minHeight: 40,
        },
      },
      // Dynamically generated intent variants
      intent: generateIntentVariants(theme),
      variant: {
        contained: {
          // Contained buttons have no border
          border: 'none',
        },
        outlined: {
          backgroundColor: 'transparent',
          // Border is defined in compound variants
        },
        text: {
          backgroundColor: 'transparent',
          border: 'none',
        },
      },
      disabled: {
        true: {
          opacity: 0.6,
        },
        false: {
          opacity: 1,
        },
      },
    },
    
    // Dynamically generated compound variants for outlined and text variants
    compoundVariants: generateButtonCompoundVariants(theme),
    
    // Web-specific styles
    _web: {
      cursor: 'pointer',
      outline: 'none',
      display: 'flex',
      boxSizing: 'border-box',
      userSelect: 'none',
      // Fix for Chromium-based browsers (Brave, Chrome) border rendering
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      appearance: 'none',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      transform: 'translateZ(0)', // Force hardware acceleration
      _hover: {
        opacity: 0.9,
      },
      _active: {
        transform: 'scale(0.98) translateZ(0)', // Maintain hardware acceleration
      },
      _focus: {
        outlineOffset: '2px',
      },
    },
  },
  
  // Icon container styles
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing?.xs || 4,
  },

  // Icon styles that inherit button colors
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    variants: {
      size: {
        sm: {
          width: 14,
          height: 14,
        },
        md: {
          width: 16,
          height: 16,
        },
        lg: {
          width: 18,
          height: 18,
        },
      },
      intent: {
        primary: {
          color: theme.intents?.primary?.on || '#ffffff',
        },
        success: {
          color: theme.intents?.success?.on || '#ffffff',
        },
        error: {
          color: theme.intents?.error?.on || '#ffffff',
        },
        warning: {
          color: theme.intents?.warning?.on || '#ffffff',
        },
        neutral: {
          color: theme.intents?.neutral?.on || '#ffffff',
        },
      },
      variant: {
        contained: {},
        outlined: {},
        text: {},
      },
    },
    // Compound variants for icon colors in outlined and text variants
    compoundVariants: [
      // Outlined variant icon colors
      {
        variant: 'outlined',
        intent: 'primary',
        styles: {
          color: theme.intents?.primary?.main || '#3b82f6',
        },
      },
      {
        variant: 'outlined',
        intent: 'success',
        styles: {
          color: theme.intents?.success?.main || '#22c55e',
        },
      },
      {
        variant: 'outlined',
        intent: 'error',
        styles: {
          color: theme.intents?.error?.main || '#ef4444',
        },
      },
      {
        variant: 'outlined',
        intent: 'warning',
        styles: {
          color: theme.intents?.warning?.main || '#f59e0b',
        },
      },
      {
        variant: 'outlined',
        intent: 'neutral',
        styles: {
          color: theme.intents?.neutral?.main || '#6b7280',
        },
      },
      // Text variant icon colors
      {
        variant: 'text',
        intent: 'primary',
        styles: {
          color: theme.intents?.primary?.main || '#3b82f6',
        },
      },
      {
        variant: 'text',
        intent: 'success',
        styles: {
          color: theme.intents?.success?.main || '#22c55e',
        },
      },
      {
        variant: 'text',
        intent: 'error',
        styles: {
          color: theme.intents?.error?.main || '#ef4444',
        },
      },
      {
        variant: 'text',
        intent: 'warning',
        styles: {
          color: theme.intents?.warning?.main || '#f59e0b',
        },
      },
      {
        variant: 'text',
        intent: 'neutral',
        styles: {
          color: theme.intents?.neutral?.main || '#6b7280',
        },
      },
    ],
  },

  // Separate text style for React Native (no borders, just text properties)
  text: {
    fontWeight: '600',
    textAlign: 'center',

    variants: {
      size: {
        sm: {
          fontSize: 14,
        },
        md: {
          fontSize: 16,
        },
        lg: {
          fontSize: 18,
        },
      },
      intent: {
        primary: {
          color: theme.intents?.primary?.on || '#ffffff',
        },
        success: {
          color: theme.intents?.success?.on || '#ffffff',
        },
        error: {
          color: theme.intents?.error?.on || '#ffffff',
        },
        warning: {
          color: theme.intents?.warning?.on || '#ffffff',
        },
        neutral: {
          color: theme.intents?.neutral?.on || '#ffffff',
        },
      },
      variant: {
        contained: {},
        outlined: {},
        text: {},
      },
      disabled: {
        true: {
          opacity: 0.6,
        },
        false: {
          opacity: 1,
        },
      },
    },
    
    // Compound variants for text colors in different variants
    compoundVariants: [
      // Outlined variant text colors
      {
        variant: 'outlined',
        intent: 'primary',
        styles: {
          color: theme.intents?.primary?.main || '#3b82f6',
        },
      },
      {
        variant: 'outlined',
        intent: 'success',
        styles: {
          color: theme.intents?.success?.main || '#22c55e',
        },
      },
      {
        variant: 'outlined',
        intent: 'error',
        styles: {
          color: theme.intents?.error?.main || '#ef4444',
        },
      },
      {
        variant: 'outlined',
        intent: 'warning',
        styles: {
          color: theme.intents?.warning?.main || '#f59e0b',
        },
      },
      {
        variant: 'outlined',
        intent: 'neutral',
        styles: {
          color: theme.intents?.neutral?.main || '#6b7280',
        },
      },
      // Text variant text colors
      {
        variant: 'text',
        intent: 'primary',
        styles: {
          color: theme.intents?.primary?.main || '#3b82f6',
        },
      },
      {
        variant: 'text',
        intent: 'success',
        styles: {
          color: theme.intents?.success?.main || '#22c55e',
        },
      },
      {
        variant: 'text',
        intent: 'error',
        styles: {
          color: theme.intents?.error?.main || '#ef4444',
        },
      },
      {
        variant: 'text',
        intent: 'warning',
        styles: {
          color: theme.intents?.warning?.main || '#f59e0b',
        },
      },
      {
        variant: 'text',
        intent: 'neutral',
        styles: {
          color: theme.intents?.neutral?.main || '#6b7280',
        },
      },
    ],
  },
})); 