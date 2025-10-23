import { StyleSheet } from 'react-native-unistyles';
import { createListStylesheet } from '@idealyst/theme';

export const listStyles = StyleSheet.create((theme) => {
  return createListStylesheet(theme.newTheme);
});
