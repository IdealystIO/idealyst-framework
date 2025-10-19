import { StyleSheet } from 'react-native-unistyles';

export const dialogStyles = StyleSheet.create((theme) => ({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    
    // Web-specific styles
    _web: {
      position: 'fixed',
      transition: 'opacity 150ms ease-out',
    },
  },
  
  container: {
    backgroundColor: theme.colors?.surface?.primary || '#ffffff',
    borderRadius: theme.borderRadius?.lg || 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    maxHeight: '90%',
    
    variants: {
      size: {
        small: {
          width: '90%',
          maxWidth: 400,
        },
        medium: {
          width: '90%',
          maxWidth: 600,
        },
        large: {
          width: '90%',
          maxWidth: 800,
        },
        fullscreen: {
          width: '100%',
          height: '100%',
          borderRadius: 0,
          maxHeight: '100%',
        },
      },
      variant: {
        default: {},
        alert: {
          borderTopWidth: 4,
          borderTopColor: theme.colors?.border?.primary || '#e5e7eb',
        },
        confirmation: {
          borderTopWidth: 4,
          borderTopColor: theme.colors?.border?.primary || '#e5e7eb',
        },
      },
    },
    
    // Web-specific styles
    _web: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: 'opacity 150ms ease-out, transform 150ms ease-out',
      transformOrigin: 'center center',
    },
  },
  
  header: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors?.border?.primary || '#e5e7eb',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
    _web: {
      borderBottomStyle: 'solid',
    },
  },
  
  title: {
    marginLeft: theme.spacing?.lg || 12,
    fontSize: 18,
    paddingVertical: theme.spacing.md,
    fontWeight: '600',
    color: theme.colors?.text?.primary || '#111827',
    flex: 1,

    _web: {
      paddingVertical: theme.spacing.xs,
    }
  },
  
  closeButton: {
    width: 32,
    height: 32,
    marginRight: theme.spacing?.md || 12,
    borderRadius: 16,
    backgroundColor: 'transparent',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    
    _web: {
      _hover: {
        backgroundColor: theme.colors?.surface?.secondary || '#f3f4f6',
      },
    },
  },
  
  closeButtonText: {
    fontSize: 18,
    color: theme.colors?.text?.secondary || '#6b7280',
    fontWeight: '500',
  },
  
  content: {
    padding: theme.spacing?.lg || 16,
    
    _web: {
      overflow: 'visible',
      maxHeight: 'none',
    },
  },
  
  // Native-specific modal styles
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));