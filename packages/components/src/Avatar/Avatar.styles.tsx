import { StyleSheet } from 'react-native-unistyles';

export const avatarStyles = StyleSheet.create((theme) => ({
  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface.secondary,
    overflow: 'hidden',
    
    variants: {
      size: {
        small: {
          width: 32,
          height: 32,
        },
        medium: {
          width: 40,
          height: 40,
        },
        large: {
          width: 48,
          height: 48,
        },
        xlarge: {
          width: 64,
          height: 64,
        },
      },
      shape: {
        circle: {
          borderRadius: 9999,
        },
        square: {
          borderRadius: theme.borderRadius.md,
        },
      },
    },
  },
  
  image: {
    width: '100%',
    height: '100%',
  },
  
  fallback: {
    color: theme.colors.text.primary,
    fontWeight: '600',
    
    variants: {
      size: {
        small: {
          fontSize: 14,
        },
        medium: {
          fontSize: 16,
        },
        large: {
          fontSize: 18,
        },
        xlarge: {
          fontSize: 24,
        },
      },
    },
  },
})); 