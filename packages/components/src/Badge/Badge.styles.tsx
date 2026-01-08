/**
 * Badge styles using defineStyle with $iterator expansion.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper, getColorFromString } from '@idealyst/theme';
import type { Theme as BaseTheme, Size, Color } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type BadgeType = 'filled' | 'outlined' | 'dot';

export type BadgeDynamicProps = {
    size?: Size;
    type?: BadgeType;
    color?: Color;
};

/**
 * Badge styles with color-based type variants.
 */
export const badgeStyles = defineStyle('Badge', (theme: Theme) => ({
    badge: ({ color = 'primary', type = 'filled' }: BadgeDynamicProps) => {
        const colorValue = getColorFromString(theme as unknown as BaseTheme, color);

        const typeStyles = type === 'filled'
            ? { borderWidth: 0, backgroundColor: colorValue }
            : type === 'outlined'
                ? { backgroundColor: 'transparent', borderWidth: 2, borderStyle: 'solid' as const, borderColor: colorValue }
                : { minWidth: 8, width: 8, height: 8, paddingHorizontal: 0, paddingVertical: 0, backgroundColor: colorValue };

        return {
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            borderRadius: 9999,
            ...typeStyles,
            variants: {
                // $iterator expands for each badge size
                size: {
                    minWidth: theme.sizes.$badge.minWidth,
                    height: theme.sizes.$badge.height,
                    paddingHorizontal: theme.sizes.$badge.paddingHorizontal,
                },
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
    },

    text: ({ color = 'primary', type = 'filled' }: BadgeDynamicProps) => {
        const colorValue = getColorFromString(theme as unknown as BaseTheme, color);

        const textColor = type === 'filled'
            ? theme.colors.text.inverse
            : type === 'outlined'
                ? colorValue
                : 'transparent'; // dot type hides text

        return {
            fontWeight: '600' as const,
            textAlign: 'center' as const,
            color: textColor,
            ...(type === 'dot' ? { display: 'none' as const } : {}),
            variants: {
                size: {
                    fontSize: theme.sizes.$badge.fontSize,
                    lineHeight: theme.sizes.$badge.lineHeight,
                },
            },
        } as const;
    },

    content: (_props: BadgeDynamicProps) => ({
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: 4,
    }),

    icon: (_props: BadgeDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        variants: {
            size: {
                width: theme.sizes.$badge.iconSize,
                height: theme.sizes.$badge.iconSize,
            },
        },
    }),
}));
