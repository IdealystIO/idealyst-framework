import { StyleSheet } from 'react-native-unistyles';
import { createButtonStylesheet } from '@idealyst/theme';

export const buttonStyles = StyleSheet.create(theme => {
  console.log(theme)
  return createButtonStylesheet((theme as any).newTheme as any);
});