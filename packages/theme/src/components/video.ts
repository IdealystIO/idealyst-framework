import { StylesheetStyles } from "../styles";

export type ExpandedVideoStyles = StylesheetStyles<never>;

export type VideoStylesheet = {
    container: ExpandedVideoStyles;
    video: ExpandedVideoStyles;
    fallback: ExpandedVideoStyles;
}

/**
 * NOTE: The video stylesheet implementation has been moved to
 * @idealyst/components/src/Video/Video.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
