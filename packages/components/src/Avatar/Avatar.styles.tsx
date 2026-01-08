/**
 * Avatar styles using defineStyle with $iterator expansion.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Size } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type AvatarShape = 'circle' | 'square';

export type AvatarDynamicProps = {
    size?: Size;
    shape?: AvatarShape;
};

/**
 * Avatar styles with size and shape variants.
 */
export const avatarStyles = defineStyle('Avatar', (theme: Theme) => ({
    avatar: (_props: AvatarDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: theme.colors.surface.secondary,
        overflow: 'hidden' as const,
        variants: {
            // $iterator expands for each avatar size
            size: {
                width: theme.sizes.$avatar.width,
                height: theme.sizes.$avatar.height,
            },
            shape: {
                circle: { borderRadius: 9999 },
                square: { borderRadius: 8 },
            },
        },
    }),

    image: (_props: AvatarDynamicProps) => ({
        width: '100%' as const,
        height: '100%' as const,
    }),

    fallback: (_props: AvatarDynamicProps) => ({
        color: theme.colors.text.primary,
        fontWeight: '600' as const,
        variants: {
            size: {
                fontSize: theme.sizes.$avatar.fontSize,
            },
        },
    }),
}));
