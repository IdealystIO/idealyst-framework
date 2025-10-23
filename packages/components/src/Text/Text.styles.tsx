import { StyleSheet } from "react-native-unistyles";
import { createTextStylesheet } from '@idealyst/theme';

const textStyles = StyleSheet.create((theme) => {
  return createTextStylesheet((theme as any).newTheme as any);
});

export default textStyles;
