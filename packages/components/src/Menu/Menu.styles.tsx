import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, CompoundVariants, Intent, Size } from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';
import { applyExtensions } from '../extensions/applyExtension';

type MenuSize = Size;
type MenuIntent = Intent;

type MenuVariants = {
    size: MenuSize;
    intent: MenuIntent;
    disabled: boolean;
}

export type ExpandedMenuStyles = StylesheetStyles<keyof MenuVariants>;

export type MenuStylesheet = {
    overlay: ExpandedMenuStyles;
    menu: ExpandedMenuStyles;
    separator: ExpandedMenuStyles;
    item: ExpandedMenuStyles;
    icon: ExpandedMenuStyles;
    label: ExpandedMenuStyles;
}

/**
 * Create size variants for menu item
 */
function createItemSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'menu', (size) => ({
        paddingVertical: size.paddingVertical,
        paddingHorizontal: size.paddingHorizontal,
    }));
}

/**
 * Get hover styles for menu item based on intent
 */
function getItemHoverStyles(theme: Theme, intent: MenuIntent) {
    if (intent === 'neutral') {
        return {};
    }
    const intentValue = theme.intents[intent];
    return {
        _web: {
            _hover: {
                backgroundColor: intentValue.light + '20',
                color: intentValue.primary,
            },
        },
    } as const;
}

/**
 * Create compound variants for menu item
 */
function createItemCompoundVariants(theme: Theme): CompoundVariants<keyof MenuVariants> {
    return [
        {
            disabled: true,
            styles: {
                _web: {
                    _hover: {
                        backgroundColor: 'transparent',
                    },
                },
            },
        },
    ] as const;
}

/**
 * Create size variants for icon
 */
function createIconSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'menu', (size) => ({
        width: size.iconSize,
        height: size.iconSize,
        fontSize: size.iconSize,
    }));
}

/**
 * Create size variants for label
 */
function createLabelSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'menu', (size) => ({
        fontSize: size.labelFontSize,
    }));
}

// Main element style creators (for extension support)
function createOverlayStyles(theme: Theme) {
    return () => ({
        backgroundColor: 'transparent',
        _web: {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
        },
    });
}

function createMenuStyles(theme: Theme) {
    return () => ({
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
    });
}

function createItemStyles(theme: Theme) {
    return ({ intent }: Partial<MenuVariants>) => {
        const hoverStyles = getItemHoverStyles(theme, intent ?? 'neutral');
        return {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'transparent',
            borderRadius: 4,
            minHeight: 44,
            variants: {
                size: createItemSizeVariants(theme),
                disabled: {
                    true: {
                        opacity: 0.5,
                        _web: {
                            cursor: 'not-allowed',
                        },
                    },
                    false: {},
                },
            },
            compoundVariants: createItemCompoundVariants(theme),
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
export const menuStyles = StyleSheet.create((theme: Theme) => {
    // Apply extensions to main visual elements
    const extended = applyExtensions('Menu', theme, {
        overlay: createOverlayStyles(theme),
        menu: createMenuStyles(theme),
        item: createItemStyles(theme),
    });

    return {
        ...extended,
        // Minor utility styles (not extended)
        separator: {
            height: 1,
            backgroundColor: theme.colors.border.primary,
            marginTop: 4,
            marginBottom: 4,
        },
        icon: {
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginRight: 8,
            variants: {
                size: createIconSizeVariants(theme),
            } as const,
        } as const,
        label: {
            flex: 1,
            color: theme.colors.text.primary,
            variants: {
                size: createLabelSizeVariants(theme),
            } as const,
        } as const,
    };
});
