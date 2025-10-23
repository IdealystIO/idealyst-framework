import { StylesheetStyles } from "../styles";
import { Intent } from "../theme/intent";
import { Size } from "../theme/size";

type MenuItemSize = Size;
type MenuItemIntent = Intent;

type MenuItemVariants = {
    size: MenuItemSize;
    intent: MenuItemIntent;
    disabled: boolean;
}

export type ExpandedMenuItemStyles = StylesheetStyles<keyof MenuItemVariants>;

export type MenuItemStylesheet = {
    item: ExpandedMenuItemStyles;
    icon: ExpandedMenuItemStyles;
    label: ExpandedMenuItemStyles;
}

/**
 * NOTE: The menu-item stylesheet implementation has been moved to
 * @idealyst/components/src/Menu/MenuItem.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
