import { StyleSheet } from 'react-native-unistyles';
import { createMenuStylesheet } from '@idealyst/theme';

export const menuStyles = StyleSheet.create((theme) => {
  return createMenuStylesheet(theme.newTheme);
});
