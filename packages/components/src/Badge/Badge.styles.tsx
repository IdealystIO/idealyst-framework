import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, getColorFromString, Size, Color } from '@idealyst/theme';
import { deepMerge } from '../utils/deepMerge';
import { buildSizeVariants } from '../utils/buildSizeVariants';

type BadgeType = 'filled' | 'outlined' | 'dot';

type BadgeVariants = {
    size: Size;
    type: BadgeType;
    color: Color;
}

export type ExpandedBadgeStyles = StylesheetStyles<keyof BadgeVariants>;

export type BadgeStylesheet = {
    badge: ExpandedBadgeStyles;
    content: ExpandedBadgeStyles;
    icon: ExpandedBadgeStyles;
    text: ExpandedBadgeStyles;
}

/**
 * Create type variants for badge
 */
function createBadgeTypeVariants(theme: Theme, color: Color) {
    const colorValue = getColorFromString(theme, color);
    return {
        filled: {
            borderWidth: 0,
            backgroundColor: colorValue,
        },
        outlined: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colorValue,
        },
        dot: {
            minWidth: 8,
            width: 8,
            height: 8,
            paddingHorizontal: 0,
            paddingVertical: 0,
            backgroundColor: colorValue,
        },
    };
}

/**
 * Create type variants for badge text
 */
function createTextTypeVariants(theme: Theme, color: Color){
    const colorValue = theme.colors.pallet[color];
    return {
        filled: {
            color: theme.colors.text.inverse,
        },
        outlined: {
            color: colorValue,
        },
        dot: {
            display: 'none',
        },
    }
}

/**
 * Generate badge container styles
 */
function createBadgeStyles(theme: Theme, expanded?: Partial<ExpandedBadgeStyles>) {
    return ({ color }: BadgeVariants) => {
        return deepMerge({
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 9999,
            variants: {
                size: buildSizeVariants(theme, 'badge', (size) => ({
                    minWidth: size.minWidth,
                    height: size.height,
                    paddingHorizontal: size.paddingHorizontal,
                })),
                type: createBadgeTypeVariants(theme, color),
            },
            _web: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                fontWeight: '600',
                lineHeight: 1,
            },
        }, expanded);
    }
}

/**
 * Generate badge content container styles
 */
function createContentStyles(theme: Theme, expanded?: Partial<ExpandedBadgeStyles>) {
    return deepMerge({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    }, expanded);
}

/**
 * Generate badge icon styles
 */
function createIconStyles(theme: Theme, expanded?: Partial<ExpandedBadgeStyles>) {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        variants: {
            size: buildSizeVariants(theme, 'badge', (size) => ({
                width: size.iconSize,
                height: size.iconSize,
            })),
        },
    }, expanded);
}

/**
 * Generate badge text styles
 */
function createTextStyles(theme: Theme, expanded?: Partial<ExpandedBadgeStyles>) {
    return ({ color }: BadgeVariants) => {
        return deepMerge({
            fontWeight: '600',
            textAlign: 'center',
            variants: {
                size: buildSizeVariants(theme, 'badge', (size) => ({
                    fontSize: size.fontSize,
                    lineHeight: size.lineHeight,
                })),
                type: createTextTypeVariants(theme, color),
            },
        }, expanded);
    };
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const badgeStyles: ReturnType<typeof createBadgeStylesheet> = StyleSheet.create((theme: Theme) => {
  return {
    badge: createBadgeStyles(theme, {}),
    content: createContentStyles(theme, {}),
    icon: createIconStyles(theme, {}),
    text: createTextStyles(theme, {}),
  };
});

function createBadgeStylesheet(theme: Theme, expanded?: Partial<BadgeStylesheet>) {
    return {
        badge: createBadgeStyles(theme, expanded?.badge || {}),
        content: createContentStyles(theme, expanded?.content || {}),
        icon: createIconStyles(theme, expanded?.icon || {}),
        text: createTextStyles(theme, expanded?.text || {}),
    };
}
