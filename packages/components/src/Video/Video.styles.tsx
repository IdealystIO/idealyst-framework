import { StyleSheet } from 'react-native-unistyles';
import { createVideoStylesheet } from '@idealyst/theme';

export const videoStyles = StyleSheet.create(theme => {
  return createVideoStylesheet((theme as any).newTheme as any);
});
