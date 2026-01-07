import { StyleSheet } from 'react-native-unistyles';
import { Theme } from '@idealyst/theme';
import {
  buildPaddingVariants,
  buildPaddingVerticalVariants,
  buildPaddingHorizontalVariants,
} from '../utils/buildViewStyleVariants';
import { applyExtensions } from '../extensions/applyExtension';

// Style creators for extension support
function createPressableStyles(theme: Theme) {
    return () => ({
        variants: {
            // Spacing variants from PressableSpacingStyleProps
            padding: buildPaddingVariants(theme),
            paddingVertical: buildPaddingVerticalVariants(theme),
            paddingHorizontal: buildPaddingHorizontalVariants(theme),
        },
    });
}

export const pressableStyles = StyleSheet.create((theme: Theme) => {
    // Apply extensions to main visual elements
    return applyExtensions('Pressable', theme, {
        pressable: createPressableStyles(theme),
    });
});
