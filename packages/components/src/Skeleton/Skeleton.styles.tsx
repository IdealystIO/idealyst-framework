import { StyleSheet } from 'react-native-unistyles';

export const skeletonStyles = StyleSheet.create((theme) => ({
  skeleton: {
    backgroundColor: theme.colors.surface.secondary,
    overflow: 'hidden',

    variants: {
      shape: {
        rectangle: {
          borderRadius: 0,
        },
        rounded: {
          borderRadius: 8,
        },
        circle: {
          borderRadius: 9999,
        },
      },
      animation: {
        pulse: {},
        wave: {},
        none: {},
      },
    },
  },

  group: {
    display: 'flex',
    flexDirection: 'column',
  },
}));
