import { StylesheetStyles } from "../styles";
import { Color, Size } from "../theme";

type BadgeType = 'filled' | 'outlined' | 'dot';

type BadgeVariants = {
    size: Size;
    type: BadgeType;
    color: Color;
}

export type ExpandedBadgeStyles = StylesheetStyles<keyof BadgeVariants>;

export type BadgeStylesheet = {
    badge: ExpandedBadgeStyles;
    content: ExpandedBadgeStyles;
    icon: ExpandedBadgeStyles;
    text: ExpandedBadgeStyles;
}

/**
 * NOTE: The badge stylesheet implementation has been moved to
 * @idealyst/components/src/Badge/Badge.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
