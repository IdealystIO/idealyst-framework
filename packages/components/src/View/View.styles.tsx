import { StyleSheet } from 'react-native-unistyles';
import { createViewStylesheet } from '@idealyst/theme';

const viewStyles = StyleSheet.create(theme => {
  return createViewStylesheet((theme as any).newTheme as any);
});

export default viewStyles;
