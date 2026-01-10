/**
 * List styles using defineStyle with dynamic props.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Size } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type ListType = 'default' | 'bordered' | 'divided';

export type ListDynamicProps = {
    size?: Size;
    type?: ListType;
    scrollable?: boolean;
    active?: boolean;
    selected?: boolean;
    disabled?: boolean;
    clickable?: boolean;
    isLast?: boolean;
    gap?: ViewStyleSize;
    padding?: ViewStyleSize;
    paddingVertical?: ViewStyleSize;
    paddingHorizontal?: ViewStyleSize;
    margin?: ViewStyleSize;
    marginVertical?: ViewStyleSize;
    marginHorizontal?: ViewStyleSize;
};

/**
 * List styles with type/state handling.
 */
export const listStyles = defineStyle('List', (theme: Theme) => ({
    container: ({ type = 'default', scrollable = false }: ListDynamicProps) => {
        const typeStyles = type === 'bordered' ? {
            backgroundColor: theme.colors.surface.primary,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            borderRadius: 8,
        } : {
            backgroundColor: 'transparent',
        };

        return {
            display: 'flex' as const,
            flexDirection: 'column' as const,
            width: '100%',
            ...typeStyles,
            variants: {
                gap: {
                    gap: theme.sizes.$view.padding,
                },
                padding: {
                    padding: theme.sizes.$view.padding,
                },
                paddingVertical: {
                    paddingVertical: theme.sizes.$view.padding,
                },
                paddingHorizontal: {
                    paddingHorizontal: theme.sizes.$view.padding,
                },
                margin: {
                    margin: theme.sizes.$view.padding,
                },
                marginVertical: {
                    marginVertical: theme.sizes.$view.padding,
                },
                marginHorizontal: {
                    marginHorizontal: theme.sizes.$view.padding,
                },
            },
            _web: {
                overflow: type === 'bordered' ? 'hidden' : (scrollable ? 'auto' : undefined),
                border: type === 'bordered' ? `1px solid ${theme.colors.border.primary}` : undefined,
            },
        } as const;
    },

    item: ({ type = 'default', active = false, selected = false, disabled = false, clickable = true, isLast = false }: ListDynamicProps) => {
        const baseStyles = {
            display: 'flex' as const,
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            backgroundColor: active ? theme.colors.surface.secondary : 'transparent',
            textAlign: 'left' as const,
            opacity: disabled ? 0.5 : 1,
        };

        // Don't add divider on last item
        const dividerStyles = (type === 'divided' && !isLast) ? {
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.primary,
        } : {};

        const selectedStyles = selected ? {
            backgroundColor: theme.intents.primary.light + '20',
            borderLeftWidth: 3,
            borderLeftColor: theme.intents.primary.primary,
        } : {};

        return {
            ...baseStyles,
            ...dividerStyles,
            ...selectedStyles,
            variants: {
                size: {
                    paddingVertical: theme.sizes.$list.paddingVertical,
                    paddingHorizontal: theme.sizes.$list.paddingHorizontal,
                    minHeight: theme.sizes.$list.minHeight,
                },
            },
            _web: {
                border: 'none',
                cursor: disabled ? 'not-allowed' : (clickable ? 'pointer' : 'default'),
                outline: 'none',
                transition: 'background-color 0.2s ease, border-color 0.2s ease',
                // Don't add divider on last item
                borderBottom: (type === 'divided' && !isLast) ? `1px solid ${theme.colors.border.primary}` : undefined,
                borderLeft: selected ? `3px solid ${theme.intents.primary.primary}` : undefined,
                _hover: (disabled || !clickable) ? {} : {
                    backgroundColor: theme.colors.surface.secondary,
                    borderRadius: 4,
                },
            },
        } as const;
    },

    itemContent: (_props: ListDynamicProps) => ({
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        flex: 1,
        gap: 8,
    }),

    leading: (_props: ListDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        marginRight: 8,
        color: theme.colors.text.secondary,
        variants: {
            size: {
                width: theme.sizes.$list.iconSize,
                height: theme.sizes.$list.iconSize,
                fontSize: theme.sizes.$list.iconSize,
            },
        },
    }),

    labelContainer: (_props: ListDynamicProps) => ({
        flex: 1,
        display: 'flex' as const,
        flexDirection: 'column' as const,
    }),

    label: ({ disabled = false, selected = false }: ListDynamicProps) => ({
        fontWeight: selected ? ('600' as const) : ('500' as const),
        color: selected ? theme.intents.primary.primary : (disabled ? theme.colors.text.secondary : theme.colors.text.primary),
        variants: {
            size: {
                fontSize: theme.sizes.$list.labelFontSize,
                lineHeight: theme.sizes.$list.labelLineHeight,
            },
        },
    }),

    trailing: (_props: ListDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        marginLeft: 8,
        color: theme.colors.text.secondary,
        flexShrink: 0,
    }),

    trailingIcon: (_props: ListDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        variants: {
            size: {
                width: theme.sizes.$list.iconSize,
                height: theme.sizes.$list.iconSize,
                fontSize: theme.sizes.$list.iconSize,
            },
        },
    }),

    section: (_props: ListDynamicProps) => ({
        display: 'flex' as const,
        flexDirection: 'column' as const,
    }),

    sectionTitle: (_props: ListDynamicProps) => ({
        fontWeight: '600' as const,
        fontSize: 12,
        lineHeight: 16,
        textTransform: 'uppercase' as const,
        letterSpacing: 0.5,
        color: theme.colors.text.secondary,
        padding: 8,
        paddingBottom: 4,
    }),

    sectionContent: (_props: ListDynamicProps) => ({
        display: 'flex' as const,
        flexDirection: 'column' as const,
    }),
}));
