import { StylesheetStyles } from "../styles";
import { Surface } from "../theme/surface";

type ScreenBackground = Surface | 'transparent';
type ScreenPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

type ScreenVariants = {
    background: ScreenBackground;
    padding: ScreenPadding;
}

export type ExpandedScreenStyles = StylesheetStyles<keyof ScreenVariants>;

export type ScreenStylesheet = {
    screen: ExpandedScreenStyles;
}

/**
 * NOTE: The screen stylesheet implementation has been moved to
 * @idealyst/components/src/Screen/Screen.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
