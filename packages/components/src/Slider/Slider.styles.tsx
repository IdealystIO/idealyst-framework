import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent, Size, Styles} from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';

type SliderSize = Size;
type SliderIntent = Intent;

type SliderTrackVariants = {
    size: SliderSize;
    disabled: boolean;
}

type SliderFilledTrackVariants = {
    intent: SliderIntent;
}

type SliderThumbVariants = {
    size: SliderSize;
    intent: SliderIntent;
    disabled: boolean;
}

type SliderThumbIconVariants = {
    size: SliderSize;
    intent: SliderIntent;
}

type SliderMarkVariants = {
    size: SliderSize;
}

export type ExpandedSliderTrackStyles = StylesheetStyles<keyof SliderTrackVariants>;
export type ExpandedSliderFilledTrackStyles = StylesheetStyles<keyof SliderFilledTrackVariants>;
export type ExpandedSliderThumbStyles = StylesheetStyles<keyof SliderThumbVariants>;
export type ExpandedSliderThumbIconStyles = StylesheetStyles<keyof SliderThumbIconVariants>;
export type ExpandedSliderMarkStyles = StylesheetStyles<keyof SliderMarkVariants>;
export type ExpandedSliderStyles = StylesheetStyles<never>;

export type SliderStylesheet = {
    container: ExpandedSliderStyles;
    sliderWrapper: ExpandedSliderStyles;
    track: ExpandedSliderTrackStyles;
    filledTrack: ExpandedSliderFilledTrackStyles;
    thumb: ExpandedSliderThumbStyles;
    thumbActive: ExpandedSliderStyles;
    thumbIcon: ExpandedSliderThumbIconStyles;
    valueLabel: ExpandedSliderStyles;
    minMaxLabels: ExpandedSliderStyles;
    minMaxLabel: ExpandedSliderStyles;
    marks: ExpandedSliderStyles;
    mark: ExpandedSliderMarkStyles;
    markLabel: ExpandedSliderStyles;
}

/**
 * Create size variants for track
 */
function createTrackSizeVariants(theme: Theme) {
    const variants = {} as Record<Size, Styles>;
    for (const sizeKey in theme.sizes.slider) {
        const size = sizeKey as Size;
        variants[size] = {
            height: theme.sizes.slider[size].trackHeight,
        };
    }
    return variants;
}

/**
 * Get filled track color based on intent
 */
function getFilledTrackColor(theme: Theme, intent: SliderIntent) {
    return theme.intents[intent].primary;
}

/**
 * Create size variants for thumb
 */
function createThumbSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'slider', (size) => ({
        width: size.thumbSize,
        height: size.thumbSize,
    }));
}

/**
 * Get thumb border color based on intent
 */
function getThumbBorderColor(theme: Theme, intent: SliderIntent) {
    return theme.intents[intent].primary;
}

/**
 * Create size variants for thumb icon
 */
function createThumbIconSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'slider', (size) => ({
        width: size.thumbIconSize,
        height: size.thumbIconSize,
        minWidth: size.thumbIconSize,
        maxWidth: size.thumbIconSize,
        minHeight: size.thumbIconSize,
        maxHeight: size.thumbIconSize,
    }));
}

/**
 * Get thumb icon color based on intent
 */
function getThumbIconColor(theme: Theme, intent: SliderIntent) {
    return theme.intents[intent].primary;
}

/**
 * Create size variants for mark
 */
function createMarkSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'slider', (size) => ({
        height: size.markHeight,
    }));
}

const createFilledTrackStyles = (theme: Theme) => {
    return ({ intent }: SliderFilledTrackVariants) => {
        return {
            position: 'absolute',
            height: '100%',
            borderRadius: 9999,
            top: 0,
            left: 0,
            backgroundColor: getFilledTrackColor(theme, intent),
        };
    }
}

const createThumbStyles = (theme: Theme) => {
    return ({ intent, disabled }: { intent: SliderIntent, disabled: boolean }) => {
        return {
            position: 'absolute',
            backgroundColor: theme.colors.surface.primary,
            borderRadius: 9999,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: getThumbBorderColor(theme, intent),
            top: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 2,
            variants: {
                size: createThumbSizeVariants(theme),
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
                            _hover: {
                                transform: 'translate(-50%, -50%) scale(1.05)',
                            },
                            _active: {
                                cursor: 'grabbing',
                                transform: 'translate(-50%, -50%) scale(1.1)',
                            },
                        },
                    },
                },
            },
            _web: {
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                transform: 'translate(-50%, -50%)',
                transition: 'transform 0.15s ease, box-shadow 0.2s ease',
            },
        };
    }
}

const createThumbIconStyles = (theme: Theme) => {
    return ({ intent }: SliderThumbIconVariants) => {
        return {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: getThumbIconColor(theme, intent),
            variants: {
                size: createThumbIconSizeVariants(theme),
            },
        };
    }
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const sliderStyles = StyleSheet.create((theme: Theme) => {
    return {
        container: {
            gap: 4,
            paddingVertical: 8,
        },
        sliderWrapper: {
            position: 'relative',
            paddingVertical: 4,
        },
        track: {
        backgroundColor: theme.colors.surface.tertiary,
        borderRadius: 9999,
        position: 'relative',
        variants: {
            size: createTrackSizeVariants(theme),
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
        filledTrack: createFilledTrackStyles(theme),
        thumb: createThumbStyles(theme),
        thumbActive: {
            _web: {
                transform: 'translate(-50%, -50%) scale(1.1)',
            },
        },
        thumbIcon: createThumbIconStyles(theme),
        valueLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.text.primary,
        textAlign: 'center',
    },
        minMaxLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
        minMaxLabel: {
        fontSize: 12,
        color: theme.colors.text.secondary,
    },
        mark: {
            position: 'absolute',
            width: 2,
            backgroundColor: theme.colors.border.secondary,
            top: '50%',
            variants: {
                size: createMarkSizeVariants(theme),
            },
            _web: {
                transform: 'translate(-50%, -50%)',
            },
        },
        marks: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
        },
        markLabel: {
            position: 'absolute',
            fontSize: 10,
            color: theme.colors.text.secondary,
            top: '100%',
            marginTop: 4,
            _web: {
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
            },
        },
    };
});
