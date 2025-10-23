import { StyleSheet } from 'react-native-unistyles';
import { createViewStylesheet } from '@idealyst/theme';

const viewStyles = StyleSheet.create(theme => {
  return createViewStylesheet(theme.newTheme);
});

export default viewStyles;
