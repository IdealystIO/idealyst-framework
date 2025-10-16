import { StyleSheet } from 'react-native-unistyles';

export const imageStyles = StyleSheet.create((theme) => ({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme.colors.surface.secondary,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface.secondary,
  },

  fallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface.tertiary,
    color: theme.colors.text.secondary,
  },

  loadingIndicator: {
    color: theme.colors.text.secondary,
  },
}));
