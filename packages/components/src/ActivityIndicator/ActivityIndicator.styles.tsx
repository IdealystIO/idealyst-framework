import { StyleSheet } from 'react-native-unistyles';
import { createActivityIndicatorStylesheet } from '@idealyst/theme';

export const activityIndicatorStyles = StyleSheet.create((theme) => {
  return createActivityIndicatorStylesheet((theme as any).newTheme as any);
});
