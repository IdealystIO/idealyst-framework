import { StyleSheet } from 'react-native-unistyles';
import { generateColorVariants } from '../theme/variantHelpers';

const iconStyles = StyleSheet.create((theme) => ({
  icon: {
    // Default size (medium)
    width: 24,
    height: 24,
    
    // Default theme-based color
    color: theme.colors?.text || '#000000',
    
    // Variants for different color schemes and sizes
    variants: {
      // Dynamically generated color variants using generateColorVariants helper
      color: generateColorVariants(theme),
      size: {
        xs: {
          width: 12,
          height: 12,
        },
        sm: {
          width: 16,
          height: 16,
        },
        md: {
          width: 24,
          height: 24,
        },
        lg: {
          width: 32,
          height: 32,
        },
        xl: {
          width: 48,
          height: 48,
        },
      },
    },
    
    // Web-specific styles
    _web: {
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      lineHeight: 0, // Remove extra space below the icon
    },
  },
}));

export default iconStyles;