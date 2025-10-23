import { StyleSheet } from 'react-native-unistyles';
import { createRadioButtonStylesheet } from '@idealyst/theme';

export const radioButtonStyles = StyleSheet.create((theme) => {
  return createRadioButtonStylesheet((theme as any).newTheme as any);
});
