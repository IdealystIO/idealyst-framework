import { StyleSheet } from 'react-native-unistyles';
import { createImageStylesheet } from '@idealyst/theme';

export const imageStyles = StyleSheet.create(theme => {
  return createImageStylesheet(theme.newTheme);
});
