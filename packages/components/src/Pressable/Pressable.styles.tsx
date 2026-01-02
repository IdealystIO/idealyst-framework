import { StyleSheet } from 'react-native-unistyles';
import { Theme } from '@idealyst/theme';
import {
  buildPaddingVariants,
  buildPaddingVerticalVariants,
  buildPaddingHorizontalVariants,
} from '../utils/buildViewStyleVariants';

const createPressableStyles = (theme: Theme) => {
  return {
    variants: {
      // Spacing variants from PressableSpacingStyleProps
      padding: buildPaddingVariants(theme),
      paddingVertical: buildPaddingVerticalVariants(theme),
      paddingHorizontal: buildPaddingHorizontalVariants(theme),
    },
  } as const;
};

export const pressableStyles = StyleSheet.create((theme: Theme) => {
  return {
    pressable: createPressableStyles(theme),
  };
});
