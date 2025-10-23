import { StyleSheet } from 'react-native-unistyles';
import { createDividerStylesheet } from '@idealyst/theme';

export const dividerStyles = StyleSheet.create((theme) => {
  return createDividerStylesheet((theme as any).newTheme as any);
});
