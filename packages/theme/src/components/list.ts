import { StylesheetStyles } from "../styles";
import { Size } from "../theme/size";

type ListSize = Size;
type ListType = 'default' | 'bordered' | 'divided';

type ListVariants = {
    size: ListSize;
    type: ListType;
    scrollable: boolean;
    active: boolean;
    selected: boolean;
    disabled: boolean;
    clickable: boolean;
}

export type ExpandedListStyles = StylesheetStyles<keyof ListVariants>;

export type ListStylesheet = {
    container: ExpandedListStyles;
    item: ExpandedListStyles;
    itemContent: ExpandedListStyles;
    leading: ExpandedListStyles;
    labelContainer: ExpandedListStyles;
    label: ExpandedListStyles;
    trailing: ExpandedListStyles;
    trailingIcon: ExpandedListStyles;
    section: ExpandedListStyles;
    sectionTitle: ExpandedListStyles;
    sectionContent: ExpandedListStyles;
}

/**
 * NOTE: The list stylesheet implementation has been moved to
 * @idealyst/components/src/List/List.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
