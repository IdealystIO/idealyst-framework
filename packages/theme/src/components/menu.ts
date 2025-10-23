import { StylesheetStyles } from "../styles";
import { Intent } from "../theme/intent";
import { Size } from "../theme/size";

type MenuSize = Size;
type MenuIntent = Intent;

type MenuVariants = {
    size: MenuSize;
    intent: MenuIntent;
    disabled: boolean;
}

export type ExpandedMenuStyles = StylesheetStyles<keyof MenuVariants>;

export type MenuStylesheet = {
    overlay: ExpandedMenuStyles;
    menu: ExpandedMenuStyles;
    separator: ExpandedMenuStyles;
    item: ExpandedMenuStyles;
    icon: ExpandedMenuStyles;
    label: ExpandedMenuStyles;
}

/**
 * NOTE: The menu stylesheet implementation has been moved to
 * @idealyst/components/src/Menu/Menu.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
