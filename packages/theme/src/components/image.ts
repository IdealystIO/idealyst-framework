import { StylesheetStyles } from "../styles";

type ImageVariants = {}

export type ExpandedImageStyles = StylesheetStyles<keyof ImageVariants>;

export type ImageStylesheet = {
    container: ExpandedImageStyles;
    image: ExpandedImageStyles;
    placeholder: ExpandedImageStyles;
    fallback: ExpandedImageStyles;
    loadingIndicator: ExpandedImageStyles;
}

/**
 * NOTE: The image stylesheet implementation has been moved to
 * @idealyst/components/src/Image/Image.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
