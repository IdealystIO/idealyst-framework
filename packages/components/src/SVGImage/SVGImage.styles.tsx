import { StyleSheet } from 'react-native-unistyles';
import { createSVGImageStylesheet } from '@idealyst/theme';

export const svgImageStyles = StyleSheet.create(theme => {
  return createSVGImageStylesheet(theme.newTheme);
});
