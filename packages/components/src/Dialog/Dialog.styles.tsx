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
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.lg,
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
        sm: {
          width: '90%',
          maxWidth: 400,
        },
        md: {
          width: '90%',
          maxWidth: 600,
        },
        lg: {
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
          borderTopColor: theme.colors.border.primary,
        },
        confirmation: {
          borderTopWidth: 4,
          borderTopColor: theme.colors.border.primary,
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
    borderBottomColor: theme.colors.border.primary,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
    _web: {
      borderBottomStyle: 'solid',
    },
  },
  
  title: {
    marginLeft: theme.spacing.lg,
    fontSize: 18,
    paddingVertical: theme.spacing.md,
    fontWeight: '600',
    color: theme.colors.text.primary,
    flex: 1,

    _web: {
      paddingVertical: theme.spacing.xs,
    }
  },
  
  closeButton: {
    width: 32,
    height: 32,
    marginRight: theme.spacing.md,
    borderRadius: 16,
    backgroundColor: 'transparent',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    
    _web: {
      _hover: {
        backgroundColor: theme.colors.surface.secondary,
      },
    },
  },
  
  closeButtonText: {
    fontSize: 18,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  
  content: {
    padding: theme.spacing.lg,
    
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