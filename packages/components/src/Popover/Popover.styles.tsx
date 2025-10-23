import { StyleSheet } from 'react-native-unistyles';
import { createPopoverStylesheet } from '@idealyst/theme';

export const popoverStyles = StyleSheet.create((theme) => {
  return createPopoverStylesheet((theme as any).newTheme as any);
});
