/**
 * Progress styles using static styles with variants.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper, CompoundVariants } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type ProgressVariants = {
    size: Size;
    intent: Intent;
    rounded: boolean;
};

// Create intent variants dynamically from theme
function createIntentVariants(theme: Theme) {
    const variants: Record<string, object> = {};
    for (const intent in theme.intents) {
        variants[intent] = {};
    }
    return variants;
}

/**
 * Progress styles with static styles and variants.
 */
export const progressStyles = defineStyle('Progress', (theme: Theme) => ({
    container: {
        gap: 4 as const,
    },

    linearTrack: {
        backgroundColor: theme.colors.border.secondary,
        overflow: 'hidden' as const,
        position: 'relative' as const,
        variants: {
            size: {
                height: theme.sizes.$progress.linearHeight,
            },
            rounded: {
                true: { borderRadius: 9999 },
                false: { borderRadius: 0 },
            },
        },
    },

    linearBar: {
        height: '100%' as const,
        variants: {
            rounded: {
                true: { borderRadius: 9999 },
                false: { borderRadius: 0 },
            },
            intent: createIntentVariants(theme),
        },
        compoundVariants: (() => {
            const cv: CompoundVariants<keyof ProgressVariants> = [];
            for (const intent in theme.intents) {
                cv.push({
                    intent,
                    styles: {
                        backgroundColor: theme.intents[intent as Intent].primary,
                    },
                });
            }
            return cv;
        })(),
        _web: {
            transition: 'width 0.3s ease' as const,
        },
    },

    indeterminateBar: {
        position: 'absolute' as const,
        height: '100%' as const,
        width: '40%' as const,
        variants: {
            rounded: {
                true: { borderRadius: 9999 },
                false: { borderRadius: 0 },
            },
            intent: createIntentVariants(theme),
        },
        compoundVariants: (() => {
            const cv: CompoundVariants<keyof ProgressVariants> = [];
            for (const intent in theme.intents) {
                cv.push({
                    intent,
                    styles: {
                        backgroundColor: theme.intents[intent as Intent].primary,
                    },
                });
            }
            return cv;
        })(),
    },

    circularContainer: {
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        position: 'relative' as const,
        variants: {
            size: {
                width: theme.sizes.$progress.circularSize,
                height: theme.sizes.$progress.circularSize,
            },
        },
    },

    circularTrack: {
        _web: {
            stroke: theme.colors.border.secondary,
        },
    },

    circularBar: {
        variants: {
            intent: createIntentVariants(theme),
        },
        compoundVariants: (() => {
            const cv: CompoundVariants<keyof ProgressVariants> = [];
            for (const intent in theme.intents) {
                cv.push({
                    intent,
                    styles: {
                        _web: {
                            stroke: theme.intents[intent as Intent].primary,
                        },
                    },
                });
            }
            return cv;
        })(),
    },

    label: {
        color: theme.colors.text.primary,
        textAlign: 'center' as const,
        variants: {
            size: {
                fontSize: theme.sizes.$progress.labelFontSize,
            },
        },
    },

    circularLabel: {
        position: 'absolute' as const,
        fontWeight: '600' as const,
        color: theme.colors.text.primary,
        variants: {
            size: {
                fontSize: theme.sizes.$progress.circularLabelFontSize,
            },
        },
    },
}));
