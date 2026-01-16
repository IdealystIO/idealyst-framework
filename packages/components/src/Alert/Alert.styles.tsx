/**
 * Alert styles using defineStyle with $iterator expansion for size variants.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type AlertType = 'filled' | 'outlined' | 'soft';

export type AlertDynamicProps = {
    intent?: Intent;
    type?: AlertType;
    size?: Size;
};

/**
 * Alert styles with $iterator expansion for size variants.
 *
 * Intent/type combinations use dynamic functions with inlined theme accesses
 * so Unistyles can trace all possible theme paths.
 */
export const alertStyles = defineStyle('Alert', (theme: Theme) => ({
    container: (_props: AlertDynamicProps) => ({
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'flex-start' as const,
        borderWidth: 1,
        borderStyle: 'solid' as const,
        variants: {
            type: {
                filled: {
                    backgroundColor: theme.$intents.primary,
                    borderColor: theme.$intents.primary,
                },
                outlined: {
                    backgroundColor: 'transparent',
                    borderColor: theme.$intents.primary,
                },
                soft: {
                    backgroundColor: theme.$intents.light,
                    borderColor: theme.$intents.light,
                },
            },
            size: {
                gap: theme.sizes.$alert.gap,
                padding: theme.sizes.$alert.padding,
                borderRadius: theme.sizes.$alert.borderRadius,
            },
        },
    }),

    iconContainer: (_props: AlertDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        alignSelf: 'flex-start' as const,
        flexShrink: 0,
        marginTop: 2,
        variants: {
            type: {
                filled: {
                    color: theme.$intents.contrast,
                },
                outlined: {
                    color: theme.$intents.primary,
                },
                soft: {
                    color: theme.$intents.primary,
                },
            },
            size: {
                width: theme.sizes.$alert.iconSize,
                height: theme.sizes.$alert.iconSize,
            },
        },
    }),

    title: (_props: AlertDynamicProps) => ({
        fontWeight: '600' as const,
        variants: {
            type: {
                filled: {
                    color: theme.$intents.contrast,
                },
                outlined: {
                    color: theme.$intents.primary,
                },
                soft: {
                    color: theme.$intents.primary,
                },
            },
            size: {
                fontSize: theme.sizes.$alert.titleFontSize,
                lineHeight: theme.sizes.$alert.titleLineHeight,
            },
        },
    }),

    message: (_props: AlertDynamicProps) => ({
        variants: {
            type: {
                filled: {
                    color: theme.$intents.contrast,
                },
                outlined: {
                    color: theme.colors.text.primary,
                },
                soft: {
                    color: theme.colors.text.primary,
                },
            },
            size: {
                fontSize: theme.sizes.$alert.messageFontSize,
                lineHeight: theme.sizes.$alert.messageLineHeight,
            },
        },
    }),

    content: (_props: AlertDynamicProps) => ({
        flex: 1,
        display: 'flex' as const,
        flexDirection: 'column' as const,
        variants: {
            size: {
                // Gap is half of the main gap
                gap: theme.sizes.$alert.gap,
            },
        },
    }),

    actions: (_props: AlertDynamicProps) => ({
        display: 'flex' as const,
        flexDirection: 'row' as const,
        variants: {
            size: {
                marginTop: theme.sizes.$alert.gap,
                gap: theme.sizes.$alert.gap,
            },
        },
    }),

    closeButton: (_props: AlertDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexShrink: 0,
        alignSelf: 'flex-start' as const,
        marginTop: 2,
        _web: {
            appearance: 'none',
            background: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
            margin: 0,
            _hover: {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
            },
        },
        variants: {
            size: {
                padding: theme.sizes.$alert.padding,
                borderRadius: theme.sizes.$alert.borderRadius,
            },
        },
    }),

    closeIcon: (_props: AlertDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        variants: {
            type: {
                filled: {
                    color: theme.$intents.contrast,
                },
                outlined: {
                    color: theme.$intents.primary,
                },
                soft: {
                    color: theme.$intents.primary,
                },
            },
            size: {
                width: theme.sizes.$alert.closeIconSize,
                height: theme.sizes.$alert.closeIconSize,
            },
        },
    }),
}));

// Export theme sizes for use in components (for icon sizing in native)
export const alertSizeConfig = {
    xs: { padding: 8, gap: 6, borderRadius: 4, titleFontSize: 12, titleLineHeight: 16, messageFontSize: 11, messageLineHeight: 14, iconSize: 16, closeIconSize: 12 },
    sm: { padding: 12, gap: 8, borderRadius: 6, titleFontSize: 14, titleLineHeight: 20, messageFontSize: 12, messageLineHeight: 16, iconSize: 20, closeIconSize: 14 },
    md: { padding: 16, gap: 10, borderRadius: 8, titleFontSize: 16, titleLineHeight: 24, messageFontSize: 14, messageLineHeight: 20, iconSize: 24, closeIconSize: 16 },
    lg: { padding: 20, gap: 12, borderRadius: 10, titleFontSize: 18, titleLineHeight: 28, messageFontSize: 16, messageLineHeight: 24, iconSize: 28, closeIconSize: 18 },
    xl: { padding: 24, gap: 14, borderRadius: 12, titleFontSize: 20, titleLineHeight: 32, messageFontSize: 18, messageLineHeight: 28, iconSize: 32, closeIconSize: 20 },
};
