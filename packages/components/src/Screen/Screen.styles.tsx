import { StyleSheet } from 'react-native-unistyles';
import { createScreenStylesheet } from '@idealyst/theme';

export const screenStyles = StyleSheet.create((theme) => {
  return createScreenStylesheet((theme as any).newTheme as any);
});
