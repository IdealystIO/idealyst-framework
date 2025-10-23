import { StyleSheet } from 'react-native-unistyles';
import { createChipStylesheet } from '@idealyst/theme';

export const chipStyles = StyleSheet.create((theme) => {
  return createChipStylesheet(theme.newTheme);
});
