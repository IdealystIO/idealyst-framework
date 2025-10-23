import { StyleSheet } from 'react-native-unistyles';
import { createSliderStylesheet } from '@idealyst/theme';

export const sliderStyles = StyleSheet.create((theme) => {
  return createSliderStylesheet(theme.newTheme);
});
