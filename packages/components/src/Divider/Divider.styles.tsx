import { StyleSheet } from 'react-native-unistyles';

export const dividerStyles = StyleSheet.create((theme) => ({
  divider: {
    backgroundColor: theme.colors.border.secondary,
    
    variants: {
      orientation: {
        horizontal: {
          width: '100%',
          height: 1,
          flexDirection: 'row',
        },
        vertical: {
          width: 1,
          height: '100%',
          flexDirection: 'column',
        },
      },
      thickness: {
        thin: {
          // Handled by orientation compound variants
        },
        md: {
          // Handled by orientation compound variants
        },
        thick: {
          // Handled by orientation compound variants
        },
      },
      variant: {
        solid: {
          // Default solid style
        },
        dashed: {
          // React Native: handled by component logic with segments
          backgroundColor: 'transparent',
          
          _web: {
            border: 'none',
            backgroundColor: 'transparent',
          },
        },
        dotted: {
          // React Native: handled by component logic with segments
          backgroundColor: 'transparent',
          
          _web: {
            border: 'none',
            backgroundColor: 'transparent',
          },
        },
      },
      intent: {
        primary: {
          backgroundColor: theme.intents.primary.main,
        },
        secondary: {
          backgroundColor: theme.colors.border.primary,
        },
        neutral: {
          backgroundColor: theme.colors.border.secondary,
        },
        success: {
          backgroundColor: theme.intents.success.main,
        },
        error: {
          backgroundColor: theme.intents.error.main,
        },
        warning: {
          backgroundColor: theme.intents.warning.main,
        },
        info: {
          backgroundColor: theme.intents.info.main,
        },
      },
      length: {
        full: {
          // Default full length
        },
        auto: {
          // Auto length handled by parent container
        },
      },
      spacing: {
        none: {
          margin: 0,
        },
        sm: {
          // Handled by orientation compound variants
        },
        md: {
          // Handled by orientation compound variants
        },
        lg: {
          // Handled by orientation compound variants
        },
      },
    },
    
    compoundVariants: [
      // Horizontal thickness variants
      {
        orientation: 'horizontal',
        thickness: 'thin',
        styles: {
          height: 1,
        },
      },
      {
        orientation: 'horizontal',
        thickness: 'md',
        styles: {
          height: 2,
        },
      },
      {
        orientation: 'horizontal',
        thickness: 'thick',
        styles: {
          height: 4,
        },
      },
      // Vertical thickness variants
      {
        orientation: 'vertical',
        thickness: 'thin',
        styles: {
          width: 1,
        },
      },
      {
        orientation: 'vertical',
        thickness: 'md',
        styles: {
          width: 2,
        },
      },
      {
        orientation: 'vertical',
        thickness: 'thick',
        styles: {
          width: 4,
        },
      },
      // Horizontal spacing variants
      {
        orientation: 'horizontal',
        spacing: 'small',
        styles: {
          marginVertical: theme.spacing.sm,
        },
      },
      {
        orientation: 'horizontal',
        spacing: 'md',
        styles: {
          marginVertical: theme.spacing.md,
        },
      },
      {
        orientation: 'horizontal',
        spacing: 'large',
        styles: {
          marginVertical: theme.spacing.lg,
        },
      },
      // Vertical spacing variants
      {
        orientation: 'vertical',
        spacing: 'small',
        styles: {
          marginHorizontal: theme.spacing.sm,
        },
      },
      {
        orientation: 'vertical',
        spacing: 'md',
        styles: {
          marginHorizontal: theme.spacing.md,
        },
      },
      {
        orientation: 'vertical',
        spacing: 'large',
        styles: {
          marginHorizontal: theme.spacing.lg,
        },
      },
      // Dashed variant compound styles (web-only, RN handled by component)
      {
        variant: 'dashed',
        orientation: 'horizontal',
        styles: {
          _web: {
            borderTop: `1px dashed ${theme.colors.border.secondary}`,
            borderLeft: 'none',
          },
        },
      },
      {
        variant: 'dashed',
        orientation: 'vertical',
        styles: {
          _web: {
            borderLeft: `1px dashed ${theme.colors.border.secondary}`,
            borderTop: 'none',
          },
        },
      },
      // Dotted variant compound styles (web-only, RN handled by component)
      {
        variant: 'dotted',
        orientation: 'horizontal',
        styles: {
          _web: {
            borderTop: `1px dotted ${theme.colors.border.secondary}`,
            borderLeft: 'none',
          },
        },
      },
      {
        variant: 'dotted',
        orientation: 'vertical',
        styles: {
          _web: {
            borderLeft: `1px dotted ${theme.colors.border.secondary}`,
            borderTop: 'none',
          },
        },
      },
      // Intent color compounds for dashed variant
      {
        variant: 'dashed',
        intent: 'primary',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents.primary.main,
          
          _web: {
            borderTop: `1px dashed ${theme.intents.primary.main}`,
          },
        },
      },
      {
        variant: 'dashed',
        intent: 'primary',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents.primary.main,
          
          _web: {
            borderLeft: `1px dashed ${theme.intents.primary.main}`,
          },
        },
      },
      {
        variant: 'dashed',
        intent: 'success',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents.success.main,
          
          _web: {
            borderTop: `1px dashed ${theme.intents.success.main}`,
          },
        },
      },
      {
        variant: 'dashed',
        intent: 'success',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents.success.main,
          
          _web: {
            borderLeft: `1px dashed ${theme.intents.success.main}`,
          },
        },
      },
      {
        variant: 'dashed',
        intent: 'error',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents.error.main,
          
          _web: {
            borderTop: `1px dashed ${theme.intents.error.main}`,
          },
        },
      },
      {
        variant: 'dashed',
        intent: 'error',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents.error.main,
          
          _web: {
            borderLeft: `1px dashed ${theme.intents.error.main}`,
          },
        },
      },
      {
        variant: 'dashed',
        intent: 'warning',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents.warning.main,
          
          _web: {
            borderTop: `1px dashed ${theme.intents.warning.main}`,
          },
        },
      },
      {
        variant: 'dashed',
        intent: 'warning',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents.warning.main,
          
          _web: {
            borderLeft: `1px dashed ${theme.intents.warning.main}`,
          },
        },
      },
      {
        variant: 'dashed',
        intent: 'info',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents.info.main,
          
          _web: {
            borderTop: `1px dashed ${theme.intents.info.main}`,
          },
        },
      },
      {
        variant: 'dashed',
        intent: 'info',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents.info.main,
          
          _web: {
            borderLeft: `1px dashed ${theme.intents.info.main}`,
          },
        },
      },
      // Intent color compounds for dotted variant
      {
        variant: 'dotted',
        intent: 'primary',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents.primary.main,
          
          _web: {
            borderTop: `1px dotted ${theme.intents.primary.main}`,
          },
        },
      },
      {
        variant: 'dotted',
        intent: 'primary',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents.primary.main,
          
          _web: {
            borderLeft: `1px dotted ${theme.intents.primary.main}`,
          },
        },
      },
      {
        variant: 'dotted',
        intent: 'success',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents.success.main,
          
          _web: {
            borderTop: `1px dotted ${theme.intents.success.main}`,
          },
        },
      },
      {
        variant: 'dotted',
        intent: 'success',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents.success.main,
          
          _web: {
            borderLeft: `1px dotted ${theme.intents.success.main}`,
          },
        },
      },
      {
        variant: 'dotted',
        intent: 'error',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents.error.main,
          
          _web: {
            borderTop: `1px dotted ${theme.intents.error.main}`,
          },
        },
      },
      {
        variant: 'dotted',
        intent: 'error',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents.error.main,
          
          _web: {
            borderLeft: `1px dotted ${theme.intents.error.main}`,
          },
        },
      },
      {
        variant: 'dotted',
        intent: 'warning',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents.warning.main,
          
          _web: {
            borderTop: `1px dotted ${theme.intents.warning.main}`,
          },
        },
      },
      {
        variant: 'dotted',
        intent: 'warning',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents.warning.main,
          
          _web: {
            borderLeft: `1px dotted ${theme.intents.warning.main}`,
          },
        },
      },
      {
        variant: 'dotted',
        intent: 'info',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents.info.main,
          
          _web: {
            borderTop: `1px dotted ${theme.intents.info.main}`,
          },
        },
      },
      {
        variant: 'dotted',
        intent: 'info',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents.info.main,
          
          _web: {
            borderLeft: `1px dotted ${theme.intents.info.main}`,
          },
        },
      },
    ],
  },
  
  // Container for dividers with content
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    
    variants: {
      orientation: {
        horizontal: {
          flexDirection: 'row',
          width: '100%',
        },
        vertical: {
          flexDirection: 'column',
          height: '100%',
        },
      },
      spacing: {
        none: {
          gap: 0,
        },
        sm: {
          gap: theme.spacing.sm,
        },
        md: {
          gap: theme.spacing.md,
        },
        lg: {
          gap: theme.spacing.lg,
        },
      },
    },
  },
  
  // Content styling for dividers with children
  content: {
    backgroundColor: theme.colors?.surface?.primary,
    color: theme.colors.text.secondary,
    fontSize: theme.typography?.fontSize?.sm || 14,
    
    variants: {
      orientation: {
        horizontal: {
          paddingHorizontal: theme.spacing.sm,
        },
        vertical: {
          paddingVertical: theme.spacing.sm,
        },
      },
    },
  },
  
  // Line segments for dividers with content
  line: {
    backgroundColor: theme.colors.border.secondary,
    flex: 1,
    
    variants: {
      orientation: {
        horizontal: {
          height: 1,
        },
        vertical: {
          width: 1,
        },
      },
      thickness: {
        thin: {
          // Handled by orientation compound variants
        },
        md: {
          // Handled by orientation compound variants
        },
        thick: {
          // Handled by orientation compound variants
        },
      },
    },
    
    compoundVariants: [
      // Horizontal thickness for line segments
      {
        orientation: 'horizontal',
        thickness: 'thin',
        styles: {
          height: 1,
        },
      },
      {
        orientation: 'horizontal',
        thickness: 'md',
        styles: {
          height: 2,
        },
      },
      {
        orientation: 'horizontal',
        thickness: 'thick',
        styles: {
          height: 4,
        },
      },
      // Vertical thickness for line segments
      {
        orientation: 'vertical',
        thickness: 'thin',
        styles: {
          width: 1,
        },
      },
      {
        orientation: 'vertical',
        thickness: 'md',
        styles: {
          width: 2,
        },
      },
      {
        orientation: 'vertical',
        thickness: 'thick',
        styles: {
          width: 4,
        },
      },
    ],
  },
})); 