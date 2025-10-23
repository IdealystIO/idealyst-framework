import { StyleSheet } from 'react-native-unistyles';
import { createCheckboxStylesheet } from '@idealyst/theme';

export const checkboxStyles = StyleSheet.create((theme) => {
  return createCheckboxStylesheet(theme.newTheme);
});
