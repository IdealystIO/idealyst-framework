import { StylesheetStyles } from "../styles";
import { Intent } from "../theme/intent";

type SVGImageIntent = Intent;

type SVGImageVariants = {
    intent: SVGImageIntent;
}

export type ExpandedSVGImageStyles = StylesheetStyles<keyof SVGImageVariants>;

export type SVGImageStylesheet = {
    container: ExpandedSVGImageStyles;
    image: ExpandedSVGImageStyles;
}

/**
 * NOTE: The svg-image stylesheet implementation has been moved to
 * @idealyst/components/src/SVGImage/SVGImage.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
