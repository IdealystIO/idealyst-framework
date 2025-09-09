import { StyleSheet } from 'react-native-unistyles';

export const svgImageStyles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    
    variants: {
      intent: {
        primary: {
          // Use CSS filter for web, tintColor for React Native
          filter: `brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)`,
        },
        success: {
          filter: `brightness(0) saturate(100%) invert(64%) sepia(88%) saturate(3323%) hue-rotate(84deg) brightness(119%) contrast(119%)`,
        },
        error: {
          filter: `brightness(0) saturate(100%) invert(23%) sepia(89%) saturate(7395%) hue-rotate(4deg) brightness(102%) contrast(118%)`,
        },
        warning: {
          filter: `brightness(0) saturate(100%) invert(54%) sepia(98%) saturate(4341%) hue-rotate(21deg) brightness(101%) contrast(101%)`,
        },
        neutral: {
          filter: `brightness(0) saturate(100%) invert(52%) sepia(23%) saturate(3207%) hue-rotate(314deg) brightness(99%) contrast(96%)`,
        },
      },
    },
    
    // Web-specific styles
    _web: {
      userSelect: 'none',
    },
    
    // Native-specific styles  
    _native: {
      variants: {
        intent: {
          primary: {
            tintColor: theme.intents?.primary?.main || '#3b82f6',
          },
          success: {
            tintColor: theme.intents?.success?.main || '#22c55e',
          },
          error: {
            tintColor: theme.intents?.error?.main || '#ef4444',
          },
          warning: {
            tintColor: theme.intents?.warning?.main || '#f59e0b',
          },
          neutral: {
            tintColor: theme.intents?.neutral?.main || '#6b7280',
          },
        },
      },
    },
  },
  
  image: {
    // Base image styles
    _web: {
      display: 'block',
      maxWidth: '100%',
      height: 'auto',
    },
    
    _native: {
      // Native image styles will be applied via Image component
    },
  },
}));