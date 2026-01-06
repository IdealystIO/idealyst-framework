import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Size } from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';
import { applyExtensions } from '../extensions/applyExtension';

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

type ItemTextDynamicProps = {
    intent?: BreadcrumbIntent;
    isLast?: boolean;
    disabled?: boolean;
    clickable?: boolean;
};

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
 * Get item text color based on state
 */
function getItemTextColor(theme: Theme, intent: BreadcrumbIntent, isLast: boolean, disabled: boolean, clickable: boolean): string {
    if (disabled) {
        return theme.colors.text.secondary;
    }
    if (isLast) {
        return theme.colors.text.primary;
    }
    if (clickable) {
        return intent === 'primary' ? theme.intents.primary.primary : theme.colors.text.secondary;
    }
    return theme.colors.text.secondary;
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
    return ({ intent = 'primary', isLast = false, disabled = false, clickable = true }: ItemTextDynamicProps) => {
        const color = getItemTextColor(theme, intent, isLast, disabled, clickable);
        return {
            color,
            opacity: disabled ? 0.5 : 1,
            variants: {
                size: createItemTextSizeVariants(theme),
            },
        } as const;
    };
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

// Style creators for extension support
function createContainerStyles() {
    return () => ({
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        flexWrap: 'wrap' as const,
        gap: 8,
    });
}

function createItemStyles() {
    return () => ({
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 4,
    });
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel transform on native cannot resolve function calls to extract variant structures.
export const breadcrumbStyles = StyleSheet.create((theme: Theme) => {
    // Apply extensions to main visual elements
    const extended = applyExtensions('Breadcrumb', theme, {
        container: createContainerStyles(),
        item: createItemStyles(),
        itemText: createItemTextStyles(theme),
    });

    return {
        ...extended,
        // Minor utility styles (not extended)
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
