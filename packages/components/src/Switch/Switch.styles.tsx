import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent, Size} from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';
import {
  buildMarginVariants,
  buildMarginVerticalVariants,
  buildMarginHorizontalVariants,
} from '../utils/buildViewStyleVariants';
import { SwitchIntentVariant, SwitchSizeVariant } from './types';

function createTrackSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'switch', (size) => ({
        width: size.trackWidth,
        height: size.trackHeight,
    }));
}

function getTrackBackgroundColor(theme: Theme, checked: boolean, intent: SwitchIntentVariant) {
    if (checked) {
        return theme.intents[intent].primary;
    }
    return theme.colors.border.secondary;
}

function createThumbSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'switch', (size) => ({
        width: size.thumbSize,
        height: size.thumbSize,
        left: 2,
    }));
}

function getThumbTransform(theme: Theme, size: SwitchSizeVariant, checked: boolean) {
    const sizeValue = theme.sizes.switch[size];
    const translateX = checked ? sizeValue.translateX : 0;
    return `translateY(-50%) translateX(${translateX}px)`;
}

function createThumbIconSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'switch', (size) => ({
        width: size.thumbIconSize,
        height: size.thumbIconSize,
    }));
}

function getThumbIconColor(theme: Theme, checked: boolean, intent: SwitchIntentVariant) {
    if (checked) {
        return theme.intents[intent].primary;
    }
    return theme.colors.border.secondary;
}

function createSwitchTrackStyles(theme: Theme) {
    return ({ checked, intent }: { checked: boolean, intent: SwitchIntentVariant }) => {
        return {
            borderRadius: 9999,
            position: 'relative',
            backgroundColor: getTrackBackgroundColor(theme, checked, intent),
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
                            _hover: {
                                opacity: 0.9,
                            },
                            _active: {
                                opacity: 0.8,
                            },
                        },
                    },
                },
            } as const,
            _web: {
                transition: 'background-color 0.2s ease',
            },
        } as const;
    }
}

function createSwitchThumbStyles(theme: Theme) {
    return ({ size, checked }: { size: SwitchSizeVariant, checked: boolean }) => {
        return {
            position: 'absolute',
            backgroundColor: theme.colors.surface.primary,
            borderRadius: 9999,
            top: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 2,
            variants: {
                size: createThumbSizeVariants(theme),
            },
            _web: {
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s ease',
                transform: getThumbTransform(theme, size, checked),
            },
        } as const;
    }
}

function createThumbIconStyles(theme: Theme) {
    return ({ checked, intent }: { checked: boolean, intent: SwitchIntentVariant }) => {
        return {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: getThumbIconColor(theme, checked, intent),
            variants: {
                size: createThumbIconSizeVariants(theme),
            },
        } as const;
    }
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const switchStyles = StyleSheet.create((theme: Theme) => {
  return {
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        variants: {
            // Spacing variants from FormInputStyleProps
            margin: buildMarginVariants(theme),
            marginVertical: buildMarginVerticalVariants(theme),
            marginHorizontal: buildMarginHorizontalVariants(theme),
        },
    },
    switchContainer: {
        justifyContent: 'center',
        _web: {
            border: 'none',
            padding: 0,
            backgroundColor: 'transparent',
            width: 'fit-content',
        }
    },
    switchTrack: createSwitchTrackStyles(theme),
    switchThumb: createSwitchThumbStyles(theme),
    thumbIcon: createThumbIconStyles(theme),
    label: {
        fontSize: 14,
        color: theme.colors.text.primary,
        variants: {
            disabled: {
                true: {
                    opacity: 0.5,
                },
                false: {
                    opacity: 1,
                },
            },
            position: {
                left: {
                    marginRight: 8,
                },
                right: {
                    marginLeft: 8,
                },
            },
        } as const,
    } as const,
  };
});