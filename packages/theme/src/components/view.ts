import { StylesheetStyles } from "../styles";
import { Surface } from "../theme/surface";

type ViewSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ViewMargin = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ViewBackground = Surface | 'transparent';
type ViewRadius = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ViewBorder = 'none' | 'thin' | 'thick';

type ViewVariants = {
    spacing: ViewSpacing;
    margin: ViewMargin;
    background: ViewBackground;
    radius: ViewRadius;
    border: ViewBorder;
}

export type ExpandedViewStyles = StylesheetStyles<keyof ViewVariants>;

export type ViewStylesheet = {
    view: ExpandedViewStyles;
}

/**
 * NOTE: The view stylesheet implementation has been moved to
 * @idealyst/components/src/View/View.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
