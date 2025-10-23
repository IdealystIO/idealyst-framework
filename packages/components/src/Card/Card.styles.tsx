import { StyleSheet } from 'react-native-unistyles';
import { createCardStylesheet } from '@idealyst/theme';

export const cardStyles = StyleSheet.create((theme) => {
  return createCardStylesheet((theme as any).newTheme as any);
});

export const cardHoverStyles = StyleSheet.create((theme) => {
  const styles = createCardStylesheet((theme as any).newTheme as any);
  return {
    clickableHover: styles.card,
  };
});
