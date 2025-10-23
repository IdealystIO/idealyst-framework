import { CompoundVariants, StylesheetStyles } from "../styles";
import { Intent } from "../theme/intent";

type DividerOrientation = 'horizontal' | 'vertical';
type DividerThickness = 'thin' | 'md' | 'thick';
type DividerType = 'solid' | 'dashed' | 'dotted';
type DividerIntent = Intent | 'secondary' | 'neutral' | 'info';
type DividerLength = 'full' | 'auto';
type DividerSpacing = 'none' | 'sm' | 'md' | 'lg';

type DividerVariants = {
    orientation: DividerOrientation;
    thickness: DividerThickness;
    type: DividerType;
    intent: DividerIntent;
    length: DividerLength;
    spacing: DividerSpacing;
}

export type ExpandedDividerStyles = StylesheetStyles<keyof DividerVariants>;

export type DividerStylesheet = {
    divider: ExpandedDividerStyles;
    container: ExpandedDividerStyles;
    content: ExpandedDividerStyles;
    line: ExpandedDividerStyles;
}

/**
 * NOTE: The divider stylesheet implementation has been moved to
 * @idealyst/components/src/Divider/Divider.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
