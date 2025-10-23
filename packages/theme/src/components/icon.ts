import { StylesheetStyles } from "../styles";
import { Intent } from "../theme/intent";
import { Color } from "../theme/color";

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type IconVariants = {
    size: IconSize;
    intent?: Intent;
    color?: Color;
}

export type ExpandedIconStyles = StylesheetStyles<keyof IconVariants>;

export type IconStylesheet = {
    icon: ExpandedIconStyles;
}

/**
 * NOTE: The icon stylesheet implementation has been moved to
 * @idealyst/components/src/Icon/Icon.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
