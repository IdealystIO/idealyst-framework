/**
 * Breadcrumb styles using defineStyle with $iterator expansion.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Size } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type BreadcrumbIntent = 'primary' | 'neutral';

export type BreadcrumbDynamicProps = {
    size?: Size;
    intent?: BreadcrumbIntent;
    disabled?: boolean;
    isLast?: boolean;
    clickable?: boolean;
};

/**
 * Breadcrumb styles with intent and state handling.
 */
export const breadcrumbStyles = defineStyle('Breadcrumb', (theme: Theme) => ({
    container: (_props: BreadcrumbDynamicProps) => ({
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        flexWrap: 'wrap' as const,
        gap: 8,
    }),

    item: (_props: BreadcrumbDynamicProps) => ({
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 4,
    }),

    itemText: ({ intent = 'primary', isLast = false, disabled = false, clickable = true }: BreadcrumbDynamicProps) => {
        // Get color based on state - inline for Unistyles to trace
        const color = disabled
            ? theme.colors.text.secondary
            : isLast
                ? theme.colors.text.primary
                : clickable
                    ? (intent === 'primary' ? theme.intents.primary.primary : theme.colors.text.secondary)
                    : theme.colors.text.secondary;

        return {
            color,
            opacity: disabled ? 0.5 : 1,
            variants: {
                // $iterator expands for each breadcrumb size
                size: {
                    fontSize: theme.sizes.$breadcrumb.fontSize,
                    lineHeight: theme.sizes.$breadcrumb.lineHeight,
                },
            },
        } as const;
    },

    icon: (_props: BreadcrumbDynamicProps) => ({
        variants: {
            size: {
                width: theme.sizes.$breadcrumb.iconSize,
                height: theme.sizes.$breadcrumb.iconSize,
                fontSize: theme.sizes.$breadcrumb.iconSize,
            },
        },
    }),

    separator: (_props: BreadcrumbDynamicProps) => ({
        color: theme.colors.text.tertiary,
        variants: {
            size: {
                fontSize: theme.sizes.$breadcrumb.fontSize,
                lineHeight: theme.sizes.$breadcrumb.lineHeight,
            },
        },
    }),

    ellipsis: (_props: BreadcrumbDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    }),

    ellipsisIcon: ({ intent = 'primary' }: BreadcrumbDynamicProps) => ({
        color: intent === 'primary' ? theme.intents.primary.primary : theme.colors.text.secondary,
        variants: {
            size: {
                width: theme.sizes.$breadcrumb.iconSize,
                height: theme.sizes.$breadcrumb.iconSize,
                fontSize: theme.sizes.$breadcrumb.iconSize,
            },
        },
    }),

    menuButton: (_props: BreadcrumbDynamicProps) => ({
        paddingVertical: 4,
        paddingHorizontal: 8,
    }),

    menuButtonIcon: ({ intent = 'primary' }: BreadcrumbDynamicProps) => ({
        color: intent === 'primary' ? theme.intents.primary.primary : theme.colors.text.secondary,
        variants: {
            size: {
                width: theme.sizes.$breadcrumb.iconSize,
                height: theme.sizes.$breadcrumb.iconSize,
                fontSize: theme.sizes.$breadcrumb.iconSize,
            },
        },
    }),
}));
