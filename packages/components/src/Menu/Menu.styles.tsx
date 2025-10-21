import { StyleSheet } from 'react-native-unistyles';

export const menuStyles = StyleSheet.create((theme) => ({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: 'transparent',
  },

  menu: {
    position: 'absolute',
    zIndex: 1000,
    backgroundColor: theme.colors.surface.elevated,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.md,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    minWidth: 120,
    maxWidth: 400,
    padding: 4,
    display: 'flex',
    flexDirection: 'column',
    _web: {
      width: 'fit-content',
    }
  },

  separator: {
    height: 1,
    backgroundColor: theme.colors.border.primary,
    marginTop: 4,
    marginBottom: 4,
  },
}));
