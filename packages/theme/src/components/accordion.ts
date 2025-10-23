import { StylesheetStyles } from "../styles";
import { Size } from "../theme/size";

type AccordionSize = Size;
type AccordionType = 'default' | 'separated' | 'bordered';

type AccordionVariants = {
    size: AccordionSize;
    type: AccordionType;
    expanded: boolean;
    disabled: boolean;
    isLast: boolean;
}

export type ExpandedAccordionStyles = StylesheetStyles<keyof AccordionVariants>;

export type AccordionStylesheet = {
    container: ExpandedAccordionStyles;
    item: ExpandedAccordionStyles;
    header: ExpandedAccordionStyles;
    title: ExpandedAccordionStyles;
    icon: ExpandedAccordionStyles;
    content: ExpandedAccordionStyles;
    contentInner: ExpandedAccordionStyles;
}

/**
 * NOTE: The accordion stylesheet implementation has been moved to
 * @idealyst/components/src/Accordion/Accordion.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
