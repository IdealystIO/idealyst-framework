import { StyleSheet } from 'react-native-unistyles';

export const dividerStyles = StyleSheet.create((theme) => ({
  divider: {
    backgroundColor: theme.colors?.border?.secondary || theme.palettes?.gray?.[300] || '#d1d5db',
    
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
        medium: {
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
          backgroundColor: theme.intents?.primary?.main || '#3b82f6',
        },
        secondary: {
          backgroundColor: theme.colors?.border?.primary || theme.palettes?.gray?.[200] || '#e5e7eb',
        },
        neutral: {
          backgroundColor: theme.colors?.border?.secondary || theme.palettes?.gray?.[300] || '#d1d5db',
        },
        success: {
          backgroundColor: theme.intents?.success?.main || '#22c55e',
        },
        error: {
          backgroundColor: theme.intents?.error?.main || '#ef4444',
        },
        warning: {
          backgroundColor: theme.intents?.warning?.main || '#f59e0b',
        },
        info: {
          backgroundColor: theme.intents?.info?.main || '#06b6d4',
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
        small: {
          // Handled by orientation compound variants
        },
        medium: {
          // Handled by orientation compound variants
        },
        large: {
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
        thickness: 'medium',
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
        thickness: 'medium',
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
          marginVertical: theme.spacing?.sm || 8,
        },
      },
      {
        orientation: 'horizontal',
        spacing: 'medium',
        styles: {
          marginVertical: theme.spacing?.md || 12,
        },
      },
      {
        orientation: 'horizontal',
        spacing: 'large',
        styles: {
          marginVertical: theme.spacing?.lg || 16,
        },
      },
      // Vertical spacing variants
      {
        orientation: 'vertical',
        spacing: 'small',
        styles: {
          marginHorizontal: theme.spacing?.sm || 8,
        },
      },
      {
        orientation: 'vertical',
        spacing: 'medium',
        styles: {
          marginHorizontal: theme.spacing?.md || 12,
        },
      },
      {
        orientation: 'vertical',
        spacing: 'large',
        styles: {
          marginHorizontal: theme.spacing?.lg || 16,
        },
      },
      // Dashed variant compound styles (web-only, RN handled by component)
      {
        variant: 'dashed',
        orientation: 'horizontal',
        styles: {
          _web: {
            borderTop: `1px dashed ${theme.colors?.border?.secondary || theme.palettes?.gray?.[300] || '#d1d5db'}`,
            borderLeft: 'none',
          },
        },
      },
      {
        variant: 'dashed',
        orientation: 'vertical',
        styles: {
          _web: {
            borderLeft: `1px dashed ${theme.colors?.border?.secondary || theme.palettes?.gray?.[300] || '#d1d5db'}`,
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
            borderTop: `1px dotted ${theme.colors?.border?.secondary || theme.palettes?.gray?.[300] || '#d1d5db'}`,
            borderLeft: 'none',
          },
        },
      },
      {
        variant: 'dotted',
        orientation: 'vertical',
        styles: {
          _web: {
            borderLeft: `1px dotted ${theme.colors?.border?.secondary || theme.palettes?.gray?.[300] || '#d1d5db'}`,
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
          borderTopColor: theme.intents?.primary?.main || '#3b82f6',
          
          _web: {
            borderTop: `1px dashed ${theme.intents?.primary?.main || '#3b82f6'}`,
          },
        },
      },
      {
        variant: 'dashed',
        intent: 'primary',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents?.primary?.main || '#3b82f6',
          
          _web: {
            borderLeft: `1px dashed ${theme.intents?.primary?.main || '#3b82f6'}`,
          },
        },
      },
      {
        variant: 'dashed',
        intent: 'success',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents?.success?.main || '#22c55e',
          
          _web: {
            borderTop: `1px dashed ${theme.intents?.success?.main || '#22c55e'}`,
          },
        },
      },
      {
        variant: 'dashed',
        intent: 'success',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents?.success?.main || '#22c55e',
          
          _web: {
            borderLeft: `1px dashed ${theme.intents?.success?.main || '#22c55e'}`,
          },
        },
      },
      {
        variant: 'dashed',
        intent: 'error',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents?.error?.main || '#ef4444',
          
          _web: {
            borderTop: `1px dashed ${theme.intents?.error?.main || '#ef4444'}`,
          },
        },
      },
      {
        variant: 'dashed',
        intent: 'error',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents?.error?.main || '#ef4444',
          
          _web: {
            borderLeft: `1px dashed ${theme.intents?.error?.main || '#ef4444'}`,
          },
        },
      },
      {
        variant: 'dashed',
        intent: 'warning',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents?.warning?.main || '#f59e0b',
          
          _web: {
            borderTop: `1px dashed ${theme.intents?.warning?.main || '#f59e0b'}`,
          },
        },
      },
      {
        variant: 'dashed',
        intent: 'warning',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents?.warning?.main || '#f59e0b',
          
          _web: {
            borderLeft: `1px dashed ${theme.intents?.warning?.main || '#f59e0b'}`,
          },
        },
      },
      {
        variant: 'dashed',
        intent: 'info',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents?.info?.main || '#06b6d4',
          
          _web: {
            borderTop: `1px dashed ${theme.intents?.info?.main || '#06b6d4'}`,
          },
        },
      },
      {
        variant: 'dashed',
        intent: 'info',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents?.info?.main || '#06b6d4',
          
          _web: {
            borderLeft: `1px dashed ${theme.intents?.info?.main || '#06b6d4'}`,
          },
        },
      },
      // Intent color compounds for dotted variant
      {
        variant: 'dotted',
        intent: 'primary',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents?.primary?.main || '#3b82f6',
          
          _web: {
            borderTop: `1px dotted ${theme.intents?.primary?.main || '#3b82f6'}`,
          },
        },
      },
      {
        variant: 'dotted',
        intent: 'primary',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents?.primary?.main || '#3b82f6',
          
          _web: {
            borderLeft: `1px dotted ${theme.intents?.primary?.main || '#3b82f6'}`,
          },
        },
      },
      {
        variant: 'dotted',
        intent: 'success',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents?.success?.main || '#22c55e',
          
          _web: {
            borderTop: `1px dotted ${theme.intents?.success?.main || '#22c55e'}`,
          },
        },
      },
      {
        variant: 'dotted',
        intent: 'success',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents?.success?.main || '#22c55e',
          
          _web: {
            borderLeft: `1px dotted ${theme.intents?.success?.main || '#22c55e'}`,
          },
        },
      },
      {
        variant: 'dotted',
        intent: 'error',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents?.error?.main || '#ef4444',
          
          _web: {
            borderTop: `1px dotted ${theme.intents?.error?.main || '#ef4444'}`,
          },
        },
      },
      {
        variant: 'dotted',
        intent: 'error',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents?.error?.main || '#ef4444',
          
          _web: {
            borderLeft: `1px dotted ${theme.intents?.error?.main || '#ef4444'}`,
          },
        },
      },
      {
        variant: 'dotted',
        intent: 'warning',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents?.warning?.main || '#f59e0b',
          
          _web: {
            borderTop: `1px dotted ${theme.intents?.warning?.main || '#f59e0b'}`,
          },
        },
      },
      {
        variant: 'dotted',
        intent: 'warning',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents?.warning?.main || '#f59e0b',
          
          _web: {
            borderLeft: `1px dotted ${theme.intents?.warning?.main || '#f59e0b'}`,
          },
        },
      },
      {
        variant: 'dotted',
        intent: 'info',
        orientation: 'horizontal',
        styles: {
          borderTopColor: theme.intents?.info?.main || '#06b6d4',
          
          _web: {
            borderTop: `1px dotted ${theme.intents?.info?.main || '#06b6d4'}`,
          },
        },
      },
      {
        variant: 'dotted',
        intent: 'info',
        orientation: 'vertical',
        styles: {
          borderLeftColor: theme.intents?.info?.main || '#06b6d4',
          
          _web: {
            borderLeft: `1px dotted ${theme.intents?.info?.main || '#06b6d4'}`,
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
        small: {
          gap: theme.spacing?.sm || 8,
        },
        medium: {
          gap: theme.spacing?.md || 12,
        },
        large: {
          gap: theme.spacing?.lg || 16,
        },
      },
    },
  },
  
  // Content styling for dividers with children
  content: {
    backgroundColor: theme.colors?.surface?.primary || '#ffffff',
    color: theme.colors?.text?.secondary || theme.palettes?.gray?.[600] || '#4b5563',
    fontSize: theme.typography?.fontSize?.sm || 14,
    
    variants: {
      orientation: {
        horizontal: {
          paddingHorizontal: theme.spacing?.sm || 8,
        },
        vertical: {
          paddingVertical: theme.spacing?.sm || 8,
        },
      },
    },
  },
  
  // Line segments for dividers with content
  line: {
    backgroundColor: theme.colors?.border?.secondary || theme.palettes?.gray?.[300] || '#d1d5db',
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
        medium: {
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
        thickness: 'medium',
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
        thickness: 'medium',
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