import { StyleSheet } from 'react-native-unistyles';
import { createTooltipStylesheet } from '@idealyst/theme';

export const tooltipStyles = StyleSheet.create((theme) => {
  return createTooltipStylesheet(theme.newTheme);
});
