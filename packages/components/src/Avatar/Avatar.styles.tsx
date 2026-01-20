/**
 * Avatar styles using defineStyle with $iterator expansion.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Size, Color } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type AvatarShape = 'circle' | 'square';

export type AvatarDynamicProps = {
    size?: Size;
    shape?: AvatarShape;
    color?: Color;
};

/**
 * Resolve a color string to an actual color value from the theme.
 * Supports formats: 'blue', 'blue.500', etc.
 */
function resolveColor(theme: BaseTheme, color?: Color): string | undefined {
    if (!color) return undefined;

    const pallet = theme.colors.pallet;
    if (!pallet) return undefined;

    // Check if it's a pallet.shade format (e.g., 'blue.500')
    if (color.includes('.')) {
        const [palletName, shade] = color.split('.') as [string, string];
        const palletColors = pallet[palletName as keyof typeof pallet];
        if (palletColors && typeof palletColors === 'object') {
            return (palletColors as Record<string, string>)[shade];
        }
    } else {
        // Just a pallet name (e.g., 'blue') - use the 500 shade as default
        const palletColors = pallet[color as keyof typeof pallet];
        if (palletColors && typeof palletColors === 'object') {
            return (palletColors as Record<string, string>)['500'];
        }
    }

    return undefined;
}

/**
 * Avatar styles with size and shape variants.
 */
export const avatarStyles = defineStyle('Avatar', (theme: Theme) => ({
    avatar: ({ color }: AvatarDynamicProps) => {
        const resolvedColor = resolveColor(theme as unknown as BaseTheme, color);
        return {
            display: 'flex' as const,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            backgroundColor: resolvedColor ?? theme.colors.surface.secondary,
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
        };
    },

    image: (_props: AvatarDynamicProps) => ({
        width: '100%' as const,
        height: '100%' as const,
    }),

    fallback: ({ color }: AvatarDynamicProps) => ({
        // Use white text for colored backgrounds, primary text otherwise
        color: color ? '#ffffff' : theme.colors.text.primary,
        fontWeight: '600' as const,
        variants: {
            size: {
                fontSize: theme.sizes.$avatar.fontSize,
            },
        },
    }),
}));
