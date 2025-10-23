import { StyleSheet } from 'react-native-unistyles';
import { createCardStylesheet } from '@idealyst/theme';

export const cardStyles = StyleSheet.create((theme) => {
  return createCardStylesheet(theme.newTheme);
});

export const cardHoverStyles = StyleSheet.create((theme) => {
  const styles = createCardStylesheet(theme.newTheme);
  return {
    clickableHover: styles.card,
  };
});
