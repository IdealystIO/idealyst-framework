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
    item: (_props: MenuItemDynamicProps) => ({
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        backgroundColor: 'transparent' as const,
        borderRadius: 4,
        minHeight: 44,
        variants: {
            size: {
                paddingVertical: theme.sizes.$menu.paddingVertical,
                paddingHorizontal: theme.sizes.$menu.paddingHorizontal,
            },
            intent: {
                neutral: {
                    _web: {
                        _hover: {
                            backgroundColor: theme.colors.surface.secondary,
                        },
                    },
                },
                primary: {
                    _web: {
                        _hover: {
                            backgroundColor: theme.intents.primary.light,
                            color: theme.intents.primary.primary,
                        },
                    },
                },
                success: {
                    _web: {
                        _hover: {
                            backgroundColor: theme.intents.success.light,
                            color: theme.intents.success.primary,
                        },
                    },
                },
                danger: {
                    _web: {
                        _hover: {
                            backgroundColor: theme.intents.danger.light,
                            color: theme.intents.danger.primary,
                        },
                    },
                },
                warning: {
                    _web: {
                        _hover: {
                            backgroundColor: theme.intents.warning.light,
                            color: theme.intents.warning.primary,
                        },
                    },
                },
                info: {
                    _web: {
                        _hover: {
                            backgroundColor: theme.intents.info.light,
                            color: theme.intents.info.primary,
                        },
                    },
                },
            },
            disabled: {
                true: {
                    opacity: 0.5,
                    _web: {
                        cursor: 'not-allowed',
                        _hover: { backgroundColor: 'transparent' },
                    },
                },
                false: {
                    opacity: 1,
                    _web: { cursor: 'pointer' },
                },
            },
        },
        _web: {
            display: 'flex',
            width: '100%',
            border: 'none',
            borderWidth: 0,
            outline: 'none',
            transition: 'background-color 0.2s ease',
            textAlign: 'left',
        },
    }),

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
