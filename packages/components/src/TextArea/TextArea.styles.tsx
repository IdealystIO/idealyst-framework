import { StyleSheet } from 'react-native-unistyles';
import { createTextAreaStylesheet } from '@idealyst/theme';

export const textAreaStyles = StyleSheet.create((theme) => {
  return createTextAreaStylesheet(theme.newTheme);
});
