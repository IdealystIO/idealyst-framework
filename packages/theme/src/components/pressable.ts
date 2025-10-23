import { StylesheetStyles } from "../styles";

type PressableVariants = {
    disabled: boolean;
}

export type ExpandedPressableStyles = StylesheetStyles<keyof PressableVariants>;

export type PressableStylesheet = {
    container: ExpandedPressableStyles;
}

/**
 * NOTE: The pressable stylesheet implementation has been moved to
 * @idealyst/components/src/Pressable/Pressable.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
