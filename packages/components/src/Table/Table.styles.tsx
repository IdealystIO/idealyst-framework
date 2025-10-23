import { StyleSheet } from 'react-native-unistyles';
import { createTableStylesheet } from '@idealyst/theme';

export const tableStyles = StyleSheet.create((theme) => {
  return createTableStylesheet(theme.newTheme);
});
