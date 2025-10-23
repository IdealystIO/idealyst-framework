import { StyleSheet } from 'react-native-unistyles';
import { createAccordionStylesheet } from '@idealyst/theme';

export const accordionStyles = StyleSheet.create((theme) => {
  return createAccordionStylesheet((theme as any).newTheme as any);
});
