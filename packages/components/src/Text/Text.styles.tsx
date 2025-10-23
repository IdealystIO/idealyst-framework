import { StyleSheet } from "react-native-unistyles";
import { createTextStylesheet } from '@idealyst/theme';

const textStyles = StyleSheet.create((theme) => {
  return createTextStylesheet(theme.newTheme);
});

export default textStyles;
