import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, getColorFromString, Size, Color } from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';
import { applyExtensions } from '../extensions/applyExtension';

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
            borderWidth: 2,
            borderStyle: 'solid',
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
    } as const;
}

/**
 * Create type variants for badge text
 */
function createTextTypeVariants(theme: Theme, color: Color){
    const colorValue = getColorFromString(theme, color);
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
    } as const;
}

/**
 * Generate badge container styles
 */
function createBadgeStyles(theme: Theme) {
    return ({ color }: Partial<BadgeVariants>) => {
        return {
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
        } as const;
    }
}

/**
 * Generate badge text styles
 */
function createTextStyles(theme: Theme) {
    return ({ color }: Partial<BadgeVariants>) => {
        return {
            fontWeight: '600',
            textAlign: 'center',
            variants: {
                size: buildSizeVariants(theme, 'badge', (size) => ({
                    fontSize: size.fontSize,
                    lineHeight: size.lineHeight,
                })),
                type: createTextTypeVariants(theme, color),
            },
        } as const;
    };
}

/**
 * Create content styles
 */
function createContentStyles() {
    return () => ({
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: 4,
    });
}

/**
 * Create icon styles
 */
function createIconStyles(theme: Theme) {
    return () => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        variants: {
            size: buildSizeVariants(theme, 'badge', (size) => ({
                width: size.iconSize,
                height: size.iconSize,
            })),
        },
    });
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const badgeStyles = StyleSheet.create((theme: Theme) => {
  // Apply extensions to main visual elements
  const extended = applyExtensions('Badge', theme, {
    badge: createBadgeStyles(theme),
    text: createTextStyles(theme),
  });

  return {
    ...extended,
    // Minor utility styles (not extended)
    content: createContentStyles()(),
    icon: createIconStyles(theme)(),
  };
});