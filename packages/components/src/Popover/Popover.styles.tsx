import { StyleSheet } from 'react-native-unistyles';

export const popoverStyles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors?.surface?.primary || '#ffffff',
    borderRadius: theme.borderRadius?.md || 8,
    border: `1px solid ${theme.colors?.border?.primary || '#e5e7eb'}`,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    transition: 'opacity 150ms ease-out, transform 150ms ease-out',
    transformOrigin: 'center center',
    maxWidth: 320,
  },
  
  content: {
    padding: theme.spacing?.md || 12,
  },
  
  arrow: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: theme.colors?.surface?.primary || '#ffffff',
    transform: 'rotate(45deg)',
    
    variants: {
      placement: {
        top: {
          bottom: -6,
          left: '50%',
          marginLeft: -6,
        },
        'top-start': {
          bottom: -6,
          left: 16,
        },
        'top-end': {
          bottom: -6,
          right: 16,
        },
        bottom: {
          top: -6,
          left: '50%',
          marginLeft: -6,
        },
        'bottom-start': {
          top: -6,
          left: 16,
        },
        'bottom-end': {
          top: -6,
          right: 16,
        },
        left: {
          right: -6,
          top: '50%',
          marginTop: -6,
        },
        'left-start': {
          right: -6,
          top: 16,
        },
        'left-end': {
          right: -6,
          bottom: 16,
        },
        right: {
          left: -6,
          top: '50%',
          marginTop: -6,
        },
        'right-start': {
          left: -6,
          top: 16,
        },
        'right-end': {
          left: -6,
          bottom: 16,
        },
      },
    },
    
    _web: {
      boxShadow: '-2px 2px 4px rgba(0, 0, 0, 0.1)',
    },
  },
  
  // Native-specific backdrop
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
}));