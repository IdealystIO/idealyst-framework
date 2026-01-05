import { StyleSheet } from 'react-native-unistyles';
import { Theme, Intent } from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';

type MenuItemDynamicProps = {
    intent?: Intent;
};

/**
 * Get hover styles for menu item based on intent
 */
function getItemHoverStyles(theme: Theme, intent: Intent) {
    if (intent === 'neutral') {
        return {
            _web: {
                _hover: {
                    backgroundColor: theme.colors.surface.secondary,
                },
            },
        } as const;
    }
    const intentValue = theme.intents[intent];
    return {
        _web: {
            _hover: {
                backgroundColor: intentValue.light,
                color: intentValue.primary,
            },
        },
    } as const;
}

/**
 * Create dynamic item styles
 */
function createItemStyles(theme: Theme) {
    return ({ intent = 'neutral' }: MenuItemDynamicProps) => {
        const hoverStyles = getItemHoverStyles(theme, intent);
        return {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'transparent',
            borderRadius: 4,
            minHeight: 44,
            variants: {
                size: buildSizeVariants(theme, 'menu', (size) => ({
                    paddingVertical: size.paddingVertical,
                    paddingHorizontal: size.paddingHorizontal,
                })),
                disabled: {
                    true: {
                        opacity: 0.5,
                        _web: {
                            cursor: 'not-allowed',
                            _hover: {
                                backgroundColor: 'transparent',
                            },
                        },
                    },
                    false: {},
                },
            },
            _web: {
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
                transition: 'background-color 0.2s ease',
                textAlign: 'left',
                _hover: {
                    backgroundColor: theme.colors.surface.secondary,
                },
            },
            ...hoverStyles,
        } as const;
    };
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel transform on native cannot resolve function calls to extract variant structures.
export const menuItemStyles = StyleSheet.create((theme: Theme) => {
    return {
        item: createItemStyles(theme),
        icon: {
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginRight: 12,
            variants: {
                size: buildSizeVariants(theme, 'menu', (size) => ({
                    width: size.iconSize,
                    height: size.iconSize,
                    fontSize: size.iconSize,
                }))
            },
        },
        label: {
            flex: 1,
            color: theme.colors.text.primary,
            variants: {
                size: buildSizeVariants(theme, 'menu', (size) => ({
                    fontSize: size.labelFontSize,
                })),
            },
        },
    };
});
