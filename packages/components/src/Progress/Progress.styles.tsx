import { StyleSheet } from 'react-native-unistyles';
import { createProgressStylesheet } from '@idealyst/theme';

export const progressStyles = StyleSheet.create((theme) => {
  return createProgressStylesheet(theme.newTheme);
});
