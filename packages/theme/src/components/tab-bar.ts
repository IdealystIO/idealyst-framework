import { StylesheetStyles } from "../styles";
import { Size } from "../theme/size";

type TabBarSize = Size;
type TabBarType = 'default' | 'pills' | 'underline';
type PillMode = 'light' | 'dark';

type TabBarContainerVariants = {
    type: TabBarType;
    size: TabBarSize;
    pillMode: PillMode;
}

type TabBarTabVariants = {
    size: TabBarSize;
    type: TabBarType;
    active: boolean;
    disabled: boolean;
    pillMode: PillMode;
}

type TabBarLabelVariants = {
    size: TabBarSize;
    type: TabBarType;
    active: boolean;
    disabled: boolean;
    pillMode: PillMode;
}

type TabBarIndicatorVariants = {
    type: TabBarType;
    pillMode: PillMode;
}

export type ExpandedTabBarContainerStyles = StylesheetStyles<keyof TabBarContainerVariants>;
export type ExpandedTabBarTabStyles = StylesheetStyles<keyof TabBarTabVariants>;
export type ExpandedTabBarLabelStyles = StylesheetStyles<keyof TabBarLabelVariants>;
export type ExpandedTabBarIndicatorStyles = StylesheetStyles<keyof TabBarIndicatorVariants>;

export type TabBarStylesheet = {
    container: ExpandedTabBarContainerStyles;
    tab: ExpandedTabBarTabStyles;
    tabLabel: ExpandedTabBarLabelStyles;
    indicator: ExpandedTabBarIndicatorStyles;
}

/**
 * NOTE: The tab-bar stylesheet implementation has been moved to
 * @idealyst/components/src/TabBar/TabBar.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
