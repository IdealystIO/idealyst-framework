import { StyleSheet } from 'react-native-unistyles';
import { createInputStylesheet } from '@idealyst/theme';

export const inputStyles = StyleSheet.create((theme) => {
  return createInputStylesheet(theme.newTheme);
});
