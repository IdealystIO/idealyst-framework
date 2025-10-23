import { StyleSheet } from 'react-native-unistyles';
import { createSwitchStylesheet } from '@idealyst/theme';

export const switchStyles = StyleSheet.create((theme) => {
  return createSwitchStylesheet(theme.newTheme);
});
