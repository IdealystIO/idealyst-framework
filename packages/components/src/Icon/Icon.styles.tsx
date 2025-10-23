import { StyleSheet } from 'react-native-unistyles';
import { createIconStylesheet } from '@idealyst/theme';

const iconStyles = StyleSheet.create((theme) => {
  return createIconStylesheet(theme.newTheme);
});

export default iconStyles;
