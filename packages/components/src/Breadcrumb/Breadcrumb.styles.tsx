import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, CompoundVariants, Size } from '@idealyst/theme';
import { deepMerge } from '../utils/deepMerge';
import { buildSizeVariants } from '../utils/buildSizeVariants';

type BreadcrumbSize = Size;
type BreadcrumbIntent = 'primary' | 'neutral';

type BreadcrumbVariants = {
    size: BreadcrumbSize;
    intent: BreadcrumbIntent;
    disabled: boolean;
    isLast: boolean;
    clickable: boolean;
}

export type ExpandedBreadcrumbStyles = StylesheetStyles<keyof BreadcrumbVariants>;

export type BreadcrumbStylesheet = {
    container: ExpandedBreadcrumbStyles;
    item: ExpandedBreadcrumbStyles;
    itemText: ExpandedBreadcrumbStyles;
    icon: ExpandedBreadcrumbStyles;
    separator: ExpandedBreadcrumbStyles;
    ellipsis: ExpandedBreadcrumbStyles;
    ellipsisIcon: ExpandedBreadcrumbStyles;
    menuButton: ExpandedBreadcrumbStyles;
    menuButtonIcon: ExpandedBreadcrumbStyles;
}

/**
 * Create size variants for item text
 */
function createItemTextSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'breadcrumb', (size) => ({
        fontSize: size.fontSize,
        lineHeight: size.lineHeight,
    }));
}

/**
 * Create compound variants for item text
 */
function createItemTextCompoundVariants(theme: Theme): CompoundVariants<keyof BreadcrumbVariants> {
    return [
        {
            clickable: true,
            intent: 'primary',
            isLast: false,
            disabled: false,
            styles: { color: theme.intents.primary.primary },
        },
        {
            clickable: true,
            intent: 'neutral',
            isLast: false,
            disabled: false,
            styles: { color: theme.colors.text.secondary },
        },
        {
            clickable: false,
            isLast: false,
            disabled: false,
            styles: { color: theme.colors.text.secondary },
        },
    ];
}

/**
 * Create size variants for icons
 */
function createIconSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'breadcrumb', (size) => ({
        width: size.iconSize,
        height: size.iconSize,
    }));
}

/**
 * Get icon color based on intent
 */
function getIconColor(theme: Theme, intent: BreadcrumbIntent) {
    if (intent === 'primary') {
        return theme.intents.primary.primary;
    }
    return theme.colors.text.secondary;
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedBreadcrumbStyles>): ExpandedBreadcrumbStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
    }, expanded);
}

const createItemStyles = (theme: Theme, expanded: Partial<ExpandedBreadcrumbStyles>): ExpandedBreadcrumbStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    }, expanded);
}

const createItemTextStyles = (theme: Theme, expanded: Partial<ExpandedBreadcrumbStyles>): ExpandedBreadcrumbStyles => {
    return deepMerge({
        variants: {
            size: createItemTextSizeVariants(theme),
            intent: { primary: {}, neutral: {} },
            disabled: {
                true: {
                    opacity: 0.5,
                    color: theme.colors.text.secondary,
                },
                false: {},
            },
            isLast: {
                true: { color: theme.colors.text.primary },
                false: {},
            },
            clickable: { true: {}, false: {} },
        },
        compoundVariants: createItemTextCompoundVariants(theme),
    }, expanded);
}

const createIconStyles = (theme: Theme, expanded: Partial<ExpandedBreadcrumbStyles>): ExpandedBreadcrumbStyles => {
    return deepMerge({
        variants: {
            size: createIconSizeVariants(theme),
        },
    }, expanded);
}

const createSeparatorStyles = (theme: Theme, expanded: Partial<ExpandedBreadcrumbStyles>): ExpandedBreadcrumbStyles => {
    return deepMerge({
        color: theme.colors.text.tertiary,
        variants: {
            size: createItemTextSizeVariants(theme),
        },
    }, expanded);
}

const createEllipsisStyles = (theme: Theme, expanded: Partial<ExpandedBreadcrumbStyles>): ExpandedBreadcrumbStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }, expanded);
}

const createEllipsisIconStyles = (theme: Theme, expanded: Partial<ExpandedBreadcrumbStyles>) => {
    return ({ intent }: BreadcrumbVariants) => {
        return deepMerge({
            color: getIconColor(theme, intent),
            variants: {
                size: createIconSizeVariants(theme),
            },
        }, expanded);
    }
}

const createMenuButtonStyles = (theme: Theme, expanded: Partial<ExpandedBreadcrumbStyles>): ExpandedBreadcrumbStyles => {
    return deepMerge({
        paddingVertical: 4,
        paddingHorizontal: 8,
    }, expanded);
}

const createMenuButtonIconStyles = (theme: Theme, expanded: Partial<ExpandedBreadcrumbStyles>) => {
    return ({ intent }: BreadcrumbVariants) => {
        return deepMerge({
            color: getIconColor(theme, intent),
            variants: {
                size: createIconSizeVariants(theme),
            },
        }, expanded);
    }
}

export const createBreadcrumbStylesheet = (theme: Theme, expanded?: Partial<BreadcrumbStylesheet>): BreadcrumbStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        item: createItemStyles(theme, expanded?.item || {}),
        itemText: createItemTextStyles(theme, expanded?.itemText || {}),
        icon: createIconStyles(theme, expanded?.icon || {}),
        separator: createSeparatorStyles(theme, expanded?.separator || {}),
        ellipsis: createEllipsisStyles(theme, expanded?.ellipsis || {}),
        ellipsisIcon: createEllipsisIconStyles(theme, expanded?.ellipsisIcon || {}),
        menuButton: createMenuButtonStyles(theme, expanded?.menuButton || {}),
        menuButtonIcon: createMenuButtonIconStyles(theme, expanded?.menuButtonIcon || {}),
    };
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const breadcrumbStyles: ReturnType<typeof createBreadcrumbStylesheet> = StyleSheet.create((theme: Theme) => {
    const stylesheet = createBreadcrumbStylesheet(theme);
    return {
        container: stylesheet.container,
        item: stylesheet.item,
        itemText: stylesheet.itemText,
        icon: stylesheet.icon,
        separator: stylesheet.separator,
        ellipsis: stylesheet.ellipsis,
        ellipsisIcon: stylesheet.ellipsisIcon,
        menuButton: stylesheet.menuButton,
        menuButtonIcon: stylesheet.menuButtonIcon,
    };
});

// Export individual style sheets for backwards compatibility
export const breadcrumbContainerStyles = StyleSheet.create((theme: Theme) => {
    const breadcrumbStyles = createBreadcrumbStylesheet(theme);
    return {
        container: breadcrumbStyles.container,
    };
});

export const breadcrumbItemStyles = StyleSheet.create((theme: Theme) => {
    const breadcrumbStyles = createBreadcrumbStylesheet(theme);
    return {
        item: breadcrumbStyles.item,
        itemText: breadcrumbStyles.itemText,
        icon: breadcrumbStyles.icon,
    };
});

export const breadcrumbSeparatorStyles = StyleSheet.create((theme: Theme) => {
    const breadcrumbStyles = createBreadcrumbStylesheet(theme);
    return {
        separator: breadcrumbStyles.separator,
    };
});

export const breadcrumbEllipsisStyles = StyleSheet.create((theme: Theme) => {
    const breadcrumbStyles = createBreadcrumbStylesheet(theme);
    return {
        ellipsis: breadcrumbStyles.ellipsis,
        icon: breadcrumbStyles.ellipsisIcon,
    };
});

export const breadcrumbMenuButtonStyles = StyleSheet.create((theme: Theme) => {
    const breadcrumbStyles = createBreadcrumbStylesheet(theme);
    return {
        button: breadcrumbStyles.menuButton,
        icon: breadcrumbStyles.menuButtonIcon,
    };
});
