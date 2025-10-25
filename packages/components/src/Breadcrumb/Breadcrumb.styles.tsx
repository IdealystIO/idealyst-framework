import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, CompoundVariants, Size } from '@idealyst/theme';
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

const createItemTextStyles = (theme: Theme) => {
    return {
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
    } as const;
}

const createIconStyles = (theme: Theme) => {
    return {
        variants: {
            size: createIconSizeVariants(theme),
        },
    } as const;
}

const createSeparatorStyles = (theme: Theme) => {
    return {
        color: theme.colors.text.tertiary,
        variants: {
            size: createItemTextSizeVariants(theme),
        },
    } as const;
}

const createEllipsisIconStyles = (theme: Theme) => {
    return ({ intent }: Partial<BreadcrumbVariants>) => {
        return {
            color: getIconColor(theme, intent),
            variants: {
                size: createIconSizeVariants(theme),
            },
        } as const;
    }
}

const createMenuButtonIconStyles = (theme: Theme) => {
    return ({ intent }: Partial<BreadcrumbVariants>) => {
        return {
            color: getIconColor(theme, intent),
            variants: {
                size: createIconSizeVariants(theme),
            },
        } as const;
    }
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const breadcrumbStyles = StyleSheet.create((theme: Theme) => {
    return {
        container: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
        },
        item: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        itemText: createItemTextStyles(theme),
        icon: createIconStyles(theme),
        separator: createSeparatorStyles(theme),
        ellipsis: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        ellipsisIcon: createEllipsisIconStyles(theme),
        menuButton: {
            paddingVertical: 4,
            paddingHorizontal: 8,
        },
        menuButtonIcon: createMenuButtonIconStyles(theme),
    };
});

// Export individual style sheets for backwards compatibility
export const breadcrumbContainerStyles = StyleSheet.create((theme: Theme) => {
    return {
        container: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
        },
    };
});

export const breadcrumbItemStyles = StyleSheet.create((theme: Theme) => {
    return {
        item: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        itemText: createItemTextStyles(theme),
        icon: createIconStyles(theme),
    } as const;
});

export const breadcrumbSeparatorStyles = StyleSheet.create((theme: Theme) => {
    return {
        separator: createSeparatorStyles(theme),
    } as const;
});

export const breadcrumbEllipsisStyles = StyleSheet.create((theme: Theme) => {
    return {
        ellipsis: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        icon: createEllipsisIconStyles(theme),
    } as const;
});

export const breadcrumbMenuButtonStyles = StyleSheet.create((theme: Theme) => {
    return {
        button: {
            paddingVertical: 4,
            paddingHorizontal: 8,
        },
        icon: createMenuButtonIconStyles(theme),
    } as const;
});
