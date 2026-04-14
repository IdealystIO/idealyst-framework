/**
 * Badge styles using defineStyle with $iterator expansion.
 *
 * Uses $intents iterator + compoundVariants for type+intent combinations.
 * The `color` prop (raw palette colors) is handled at the component level
 * via inline style overrides.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper, getColorFromString } from '@idealyst/theme';
import type { Theme as BaseTheme, Color } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

/**
 * Badge styles with static variants and compoundVariants.
 */
export const badgeStyles = defineStyle('Badge', (theme: Theme) => ({
    badge: {
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        borderRadius: 9999,
        _web: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
        },
        variants: {
            size: {
                minWidth: theme.sizes.$badge.minWidth,
                paddingVertical: theme.sizes.$badge.paddingVertical,
                paddingHorizontal: theme.sizes.$badge.paddingHorizontal,
            },
            intent: {
                backgroundColor: theme.$intents.primary,
                borderColor: theme.$intents.primary,
            },
            type: {
                filled: {
                    borderWidth: 0,
                },
                outlined: {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderStyle: 'solid' as const,
                },
                dot: {
                    minWidth: 8,
                    width: 8,
                    height: 8,
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                },
            },
        },
        compoundVariants: [
            { type: 'filled', styles: { backgroundColor: theme.$intents.primary, borderColor: 'transparent', color: theme.colors.text.inverse } },
            { type: 'outlined', styles: { backgroundColor: theme.$intents.light, borderColor: theme.$intents.primary, color: theme.$intents.primary } },
            { type: 'dot', styles: { backgroundColor: theme.$intents.primary } },
        ],
    },

    text: {
        fontWeight: '500' as const,
        textAlign: 'center' as const,
        variants: {
            size: {
                fontSize: theme.sizes.$badge.fontSize,
                lineHeight: theme.sizes.$badge.lineHeight,
            },
            intent: {
                color: theme.$intents.primary,
            },
            type: {
                filled: {},
                outlined: {},
                dot: { display: 'none' as const },
            },
        },
        compoundVariants: [
            { type: 'filled', styles: { color: theme.colors.text.inverse } },
            { type: 'outlined', styles: { color: theme.$intents.primary } },
        ],
    },

    content: {
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: 4,
    },

    icon: {
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
}));

type BadgeType = 'filled' | 'outlined' | 'dot';

/**
 * Resolve color prop into style overrides for badge, text, and icon.
 * Only call when `color` is set and `intent` is not.
 */
export function resolveBadgeColor(theme: BaseTheme, color: Color, type: BadgeType) {
    const colorValue = getColorFromString(theme, color);
    return {
        badge: type === 'filled'
            ? { backgroundColor: colorValue, borderColor: 'transparent' }
            : type === 'outlined'
                ? { borderColor: colorValue, backgroundColor: colorValue + '1A' }
                : { backgroundColor: colorValue },
        text: type === 'filled'
            ? {} // inverse color from variants is correct
            : { color: colorValue },
        iconColor: type === 'filled' ? undefined : colorValue,
    };
}
