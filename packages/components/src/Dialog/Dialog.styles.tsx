import { StyleSheet } from 'react-native-unistyles';
import { createDialogStylesheet } from '@idealyst/theme';

export const dialogStyles = StyleSheet.create((theme) => {
  return createDialogStylesheet(theme.newTheme);
});
