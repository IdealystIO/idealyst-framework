/**
 * Slider styles using static styles with variants.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper, CompoundVariants } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type SliderVariants = {
    size: Size;
    intent: Intent;
    disabled: boolean;
    hasError?: boolean;
    margin?: ViewStyleSize;
    marginVertical?: ViewStyleSize;
    marginHorizontal?: ViewStyleSize;
};

// Create intent variants dynamically from theme
function createIntentVariants(theme: Theme) {
    const variants: Record<string, object> = {};
    for (const intent in theme.intents) {
        variants[intent] = {};
    }
    return variants;
}

// Create compound variants for intent-specific styles
function _createSliderCompoundVariants(theme: Theme): CompoundVariants<keyof SliderVariants> {
    const compoundVariants: CompoundVariants<keyof SliderVariants> = [];

    for (const intent in theme.intents) {
        const _intentValue = theme.intents[intent as Intent];

        // filledTrack intent colors are handled inline since they need per-element targeting
        // thumb border color by intent
        compoundVariants.push({
            intent,
            styles: {},
        });
    }

    return compoundVariants;
}

/**
 * Slider styles with static styles and variants.
 */
export const sliderStyles = defineStyle('Slider', (theme: Theme) => ({
    container: {
        gap: 4,
        paddingVertical: 8,
    },

    sliderWrapper: {
        position: 'relative' as const,
        paddingVertical: 4,
    },

    track: {
        backgroundColor: theme.colors.surface.tertiary,
        borderRadius: 9999,
        position: 'relative' as const,
        variants: {
            size: {
                height: theme.sizes.$slider.trackHeight,
            },
            disabled: {
                true: {
                    opacity: 0.5,
                    _web: {
                        cursor: 'not-allowed',
                    },
                },
                false: {
                    opacity: 1,
                    _web: {
                        cursor: 'pointer',
                    },
                },
            },
        },
    },

    filledTrack: {
        position: 'absolute' as const,
        height: '100%',
        borderRadius: 9999,
        top: 0,
        left: 0,
        variants: {
            intent: createIntentVariants(theme),
        },
        compoundVariants: (() => {
            const cv: CompoundVariants<keyof SliderVariants> = [];
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

    thumb: {
        position: 'absolute' as const,
        backgroundColor: theme.colors.surface.primary,
        borderRadius: 9999,
        borderWidth: 2,
        borderStyle: 'solid' as const,
        top: '50%',
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
        variants: {
            size: {
                width: theme.sizes.$slider.thumbSize,
                height: theme.sizes.$slider.thumbSize,
            },
            intent: createIntentVariants(theme),
            disabled: {
                true: {
                    opacity: 0.6,
                    _web: {
                        cursor: 'not-allowed',
                    },
                },
                false: {
                    opacity: 1,
                    _web: {
                        cursor: 'grab',
                    },
                },
            },
        },
        compoundVariants: (() => {
            const cv: CompoundVariants<keyof SliderVariants> = [];
            for (const intent in theme.intents) {
                cv.push({
                    intent,
                    styles: {
                        borderColor: theme.intents[intent as Intent].primary,
                    },
                });
            }
            return cv;
        })(),
        _web: {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            transform: 'translate(-50%, -50%)',
            transition: 'transform 0.15s ease, box-shadow 0.2s ease',
            _hover: { transform: 'translate(-50%, -50%) scale(1.05)' },
            _active: { cursor: 'grabbing', transform: 'translate(-50%, -50%) scale(1.1)' },
        },
    },

    thumbActive: {
        _web: {
            transform: 'translate(-50%, -50%) scale(1.1)',
        },
    },

    thumbIcon: {
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexShrink: 0,
        variants: {
            size: {
                width: theme.sizes.$slider.thumbIconSize,
                height: theme.sizes.$slider.thumbIconSize,
                minWidth: theme.sizes.$slider.thumbIconSize,
                maxWidth: theme.sizes.$slider.thumbIconSize,
                minHeight: theme.sizes.$slider.thumbIconSize,
                maxHeight: theme.sizes.$slider.thumbIconSize,
            },
            intent: createIntentVariants(theme),
        },
        compoundVariants: (() => {
            const cv: CompoundVariants<keyof SliderVariants> = [];
            for (const intent in theme.intents) {
                cv.push({
                    intent,
                    styles: {
                        color: theme.intents[intent as Intent].primary,
                    },
                });
            }
            return cv;
        })(),
    },

    valueLabel: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: theme.colors.text.primary,
        textAlign: 'center' as const,
    },

    minMaxLabels: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        marginTop: 4,
    },

    minMaxLabel: {
        fontSize: 12,
        color: theme.colors.text.secondary,
    },

    marks: {
        position: 'absolute' as const,
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
    },

    mark: {
        position: 'absolute' as const,
        width: 2,
        backgroundColor: theme.colors.border.secondary,
        top: '50%',
        variants: {
            size: {
                height: theme.sizes.$slider.markHeight,
            },
        },
        _web: {
            transform: 'translate(-50%, -50%)',
        },
    },

    markLabel: {
        position: 'absolute' as const,
        fontSize: 10,
        color: theme.colors.text.secondary,
        top: '100%',
        marginTop: 4,
        _web: {
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
        },
    },

    wrapper: {
        display: 'flex' as const,
        flexDirection: 'column' as const,
        gap: 4,
        variants: {
            margin: {
                margin: theme.sizes.$view.padding,
            },
            marginVertical: {
                marginVertical: theme.sizes.$view.padding,
            },
            marginHorizontal: {
                marginHorizontal: theme.sizes.$view.padding,
            },
        },
    },

    label: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: theme.colors.text.primary,
        variants: {
            disabled: {
                true: { opacity: 0.5 },
                false: { opacity: 1 },
            },
        },
    },

    helperText: {
        fontSize: 12,
        variants: {
            hasError: {
                true: { color: theme.intents.danger.primary },
                false: { color: theme.colors.text.secondary },
            },
        },
    },

    footer: {
        display: 'flex' as const,
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        gap: 4,
    },
}));
