import { StyleSheet } from 'react-native-unistyles';
import { createBadgeStylesheet } from '@idealyst/theme';

export const badgeStyles = StyleSheet.create((theme) => {
  return createBadgeStylesheet((theme as any).newTheme as any);
});
