/**
 * MenuItem styles using defineStyle with dynamic props.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type MenuItemDynamicProps = {
    size?: Size;
    intent?: Intent;
    disabled?: boolean;
};

/**
 * MenuItem styles with intent/disabled handling.
 */
export const menuItemStyles = defineStyle('MenuItem', (theme: Theme) => ({
    item: ({ intent = 'neutral', disabled = false }: MenuItemDynamicProps) => {
        const intentValue = theme.intents[intent];
        const hoverStyles = intent !== 'neutral' ? {
            backgroundColor: intentValue.light,
            color: intentValue.primary,
        } : {
            backgroundColor: theme.colors.surface.secondary,
        };

        return {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            backgroundColor: 'transparent' as const,
            borderRadius: 4,
            minHeight: 44,
            opacity: disabled ? 0.5 : 1,
            variants: {
                size: {
                    paddingVertical: theme.sizes.$menu.paddingVertical,
                    paddingHorizontal: theme.sizes.$menu.paddingHorizontal,
                },
            },
            _web: {
                display: 'flex',
                width: '100%',
                cursor: disabled ? 'not-allowed' : 'pointer',
                border: 'none',
                borderWidth: 0,
                outline: 'none',
                transition: 'background-color 0.2s ease',
                textAlign: 'left',
                _hover: disabled ? { backgroundColor: 'transparent' } : hoverStyles,
            },
        } as const;
    },

    icon: (_props: MenuItemDynamicProps) => ({
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexShrink: 0,
        marginRight: 12,
        variants: {
            size: {
                width: theme.sizes.$menu.iconSize,
                height: theme.sizes.$menu.iconSize,
                fontSize: theme.sizes.$menu.iconSize,
            },
        },
        _web: {
            display: 'flex',
        },
    }),

    label: (_props: MenuItemDynamicProps) => ({
        flex: 1,
        color: theme.colors.text.primary,
        variants: {
            size: {
                fontSize: theme.sizes.$menu.labelFontSize,
            },
        },
    }),
}));
