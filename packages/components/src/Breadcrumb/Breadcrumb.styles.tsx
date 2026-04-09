/**
 * Breadcrumb styles using defineStyle with static variants.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type BreadcrumbVariants = {
    size?: ViewStyleSize;
    intent?: 'primary' | 'neutral';
    active?: boolean;
    disabled?: boolean;
};

/**
 * Breadcrumb styles with static variants.
 */
export const breadcrumbStyles = defineStyle('Breadcrumb', (theme: Theme) => ({
    container: {
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        flexWrap: 'wrap' as const,
        gap: 4,
    },

    item: {
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 4,
        opacity: 0.7,
        variants: {
            active: {
                true: { opacity: 1 },
                false: { _web: { _hover: { opacity: 1 } } },
            },
            disabled: {
                true: { opacity: 0.5 },
                false: {},
            },
        },
        _web: {
            transition: 'opacity 0.2s ease',
        },
    },

    itemText: {
        color: theme.colors.text.primary,
        variants: {
            size: {
                fontSize: theme.sizes.$breadcrumb.fontSize,
                lineHeight: theme.sizes.$breadcrumb.lineHeight,
            },
            disabled: {
                true: { color: theme.colors.text.secondary },
                false: {},
            },
        },
    },

    icon: {
        variants: {
            size: {
                width: theme.sizes.$breadcrumb.iconSize,
                height: theme.sizes.$breadcrumb.iconSize,
                fontSize: theme.sizes.$breadcrumb.iconSize,
            },
        },
    },

    separator: {
        color: theme.colors.text.tertiary,
        opacity: 0.9,
        variants: {
            size: {
                fontSize: theme.sizes.$breadcrumb.fontSize,
                lineHeight: theme.sizes.$breadcrumb.lineHeight,
            },
        },
    },

    separatorIcon: {
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        color: theme.colors.text.tertiary,
        opacity: 0.9,
        variants: {
            size: {
                width: theme.sizes.$breadcrumb.iconSize,
                height: theme.sizes.$breadcrumb.iconSize,
                fontSize: theme.sizes.$breadcrumb.iconSize,
            },
        },
    },

    ellipsis: {
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },

    ellipsisIcon: {
        color: theme.colors.text.secondary,
        variants: {
            size: {
                width: theme.sizes.$breadcrumb.iconSize,
                height: theme.sizes.$breadcrumb.iconSize,
                fontSize: theme.sizes.$breadcrumb.iconSize,
            },
            intent: {
                primary: { color: theme.intents.primary.primary },
                neutral: { color: theme.colors.text.secondary },
            },
        },
    },

    menuButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },

    menuButtonIcon: {
        color: theme.colors.text.secondary,
        variants: {
            size: {
                width: theme.sizes.$breadcrumb.iconSize,
                height: theme.sizes.$breadcrumb.iconSize,
                fontSize: theme.sizes.$breadcrumb.iconSize,
            },
            intent: {
                primary: { color: theme.intents.primary.primary },
                neutral: { color: theme.colors.text.secondary },
            },
        },
    },
}));
