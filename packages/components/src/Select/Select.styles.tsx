import { StyleSheet } from 'react-native-unistyles';
import { createSelectStylesheet } from '@idealyst/theme';

export const selectStyles = StyleSheet.create((theme) => {
  return createSelectStylesheet((theme as any).newTheme as any);
});
