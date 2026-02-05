/**
 * Menu styles using defineStyle with dynamic props.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type MenuDynamicProps = {
    size?: Size;
    intent?: Intent;
    disabled?: boolean;
};

/**
 * Menu styles with intent/disabled handling.
 */
export const menuStyles = defineStyle('Menu', (theme: Theme) => ({
    overlay: (_props: MenuDynamicProps) => ({
        backgroundColor: 'transparent' as const,
        _web: {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
        },
    }),

    menu: (_props: MenuDynamicProps) => ({
        position: 'absolute' as const,
        zIndex: 1000,
        backgroundColor: theme.colors.surface.primary,
        borderWidth: 1,
        borderStyle: 'solid' as const,
        borderColor: theme.colors.border.primary,
        borderRadius: 8,
        minWidth: 120,
        maxWidth: 400,
        padding: 4,
        display: 'flex' as const,
        flexDirection: 'column' as const,
        _web: {
            border: `1px solid ${theme.colors.border.primary}`,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            width: 'fit-content',
        },
    }),

    item: (_props: MenuDynamicProps) => ({
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
                // For non-neutral intents, use light bg with primary text
                primary: {
                    _web: {
                        _hover: {
                            backgroundColor: theme.intents.primary.light + '20',
                            color: theme.intents.primary.primary,
                        },
                    },
                },
                success: {
                    _web: {
                        _hover: {
                            backgroundColor: theme.intents.success.light + '20',
                            color: theme.intents.success.primary,
                        },
                    },
                },
                danger: {
                    _web: {
                        _hover: {
                            backgroundColor: theme.intents.danger.light + '20',
                            color: theme.intents.danger.primary,
                        },
                    },
                },
                warning: {
                    _web: {
                        _hover: {
                            backgroundColor: theme.intents.warning.light + '20',
                            color: theme.intents.warning.primary,
                        },
                    },
                },
                info: {
                    _web: {
                        _hover: {
                            backgroundColor: theme.intents.info.light + '20',
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
            border: 'none',
            outline: 'none',
            transition: 'background-color 0.2s ease',
            textAlign: 'left',
        },
    }),

    separator: (_props: MenuDynamicProps) => ({
        height: 1,
        backgroundColor: theme.colors.border.primary,
        marginTop: 4,
        marginBottom: 4,
    }),

    icon: (_props: MenuDynamicProps) => ({
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexShrink: 0,
        marginRight: 8,
        color: theme.colors.text.primary,
        variants: {
            size: {
                width: theme.sizes.$menu.iconSize,
                height: theme.sizes.$menu.iconSize,
                fontSize: theme.sizes.$menu.iconSize,
            },
        },
    }),

    label: (_props: MenuDynamicProps) => ({
        flex: 1,
        color: theme.colors.text.primary,
        variants: {
            size: {
                fontSize: theme.sizes.$menu.labelFontSize,
            },
        },
    }),
}));
