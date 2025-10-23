import { StyleSheet } from 'react-native-unistyles';
import { createButtonStylesheet } from '@idealyst/theme';

export const buttonStyles = StyleSheet.create((theme) => {
  return createButtonStylesheet(theme.newTheme);
});