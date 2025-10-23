import { StyleSheet } from 'react-native-unistyles';
import { createSkeletonStylesheet } from '@idealyst/theme';

export const skeletonStyles = StyleSheet.create(theme => {
  return createSkeletonStylesheet(theme.newTheme);
});
