/**
 * StyleBuilderTest styles using StyleSheet.create with $iterator expansion
 *
 * This tests the $iterator expansion for theme reactivity.
 */
import { StyleSheet } from 'react-native-unistyles';
import { ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type StyleBuilderTestVariants = {
    intent: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

/**
 * Test styles using StyleSheet.create with $iterator patterns.
 *
 * Babel will expand:
 * - theme.$intents.X → all intent keys
 * - theme.sizes.$button.X → all size keys
 */
// @ts-ignore - $iterator patterns are expanded by Babel
export const styleBuilderTestStyles = StyleSheet.create((theme: Theme) => ({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.colors.surface.primary,
    },

    title: {
        fontSize: 24,
        fontWeight: '700' as const,
        color: theme.colors.text.primary,
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 16,
        color: theme.colors.text.secondary,
        marginBottom: 20,
    },

    // Box with intent variants - uses $iterator
    box: {
        padding: 16,
        borderRadius: theme.radii.md,
        marginBottom: 20,
        borderWidth: 2,

        variants: {
            // Intent variant - expands for each intent key
            intent: {
                backgroundColor: theme.$intents.light,
                borderColor: theme.$intents.primary,
            },

            // Size variant - expands for each button size key
            size: {
                padding: theme.sizes.$button.paddingVertical,
                minHeight: theme.sizes.$button.minHeight,
            },
        },
    },

    boxText: {
        fontSize: 14,
        fontWeight: '600' as const,

        variants: {
            intent: {
                color: theme.$intents.dark,
            },
        },
    },

    button: {
        padding: 12,
        borderRadius: theme.radii.md,
        alignItems: 'center' as const,
        marginBottom: 20,

        variants: {
            intent: {
                backgroundColor: theme.$intents.primary,
            },
        },
    },

    buttonText: {
        fontSize: 16,
        fontWeight: '600' as const,

        variants: {
            intent: {
                color: theme.$intents.contrast,
            },
        },
    },

    info: {
        fontSize: 12,
        color: theme.colors.text.tertiary,
        textAlign: 'center' as const,
    },
}));
