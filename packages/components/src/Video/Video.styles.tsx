import { StyleSheet } from 'react-native-unistyles';

export const videoStyles = StyleSheet.create((theme) => ({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme.colors.surface.inverse,
  },

  video: {
    width: '100%',
    height: '100%',
  },
}));
