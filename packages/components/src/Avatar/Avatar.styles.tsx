import { StyleSheet } from 'react-native-unistyles';
import { createAvatarStylesheet } from '@idealyst/theme';

export const avatarStyles = StyleSheet.create((theme) => {
  return createAvatarStylesheet((theme as any).newTheme as any);
});
