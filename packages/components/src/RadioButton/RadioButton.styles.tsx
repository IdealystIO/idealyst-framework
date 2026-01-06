import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent, Size} from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';
import {
  buildMarginVariants,
  buildMarginVerticalVariants,
  buildMarginHorizontalVariants,
} from '../utils/buildViewStyleVariants';
import { applyExtensions } from '../extensions/applyExtension';

type RadioButtonSize = Size;
type RadioButtonIntent = Intent;
type RadioGroupOrientation = 'horizontal' | 'vertical';

type RadioButtonVariants = {
    size: RadioButtonSize;
    intent: RadioButtonIntent;
    checked: boolean;
    disabled: boolean;
}

type RadioGroupVariants = {
    orientation: RadioGroupOrientation;
}

export type ExpandedRadioButtonStyles = StylesheetStyles<keyof RadioButtonVariants>;
export type ExpandedRadioGroupStyles = StylesheetStyles<keyof RadioGroupVariants>;

export type RadioButtonStylesheet = {
    container: ExpandedRadioButtonStyles;
    radio: ExpandedRadioButtonStyles;
    radioDot: ExpandedRadioButtonStyles;
    label: ExpandedRadioButtonStyles;
    groupContainer: ExpandedRadioGroupStyles;
}

function createRadioSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'radioButton', (size) => ({
        width: size.radioSize,
        height: size.radioSize,
    }));
}

function createCheckedVariants(theme: Theme, intent: RadioButtonIntent) {
    const intentValue = theme.intents[intent];
    return {
        true: {
            borderColor: intentValue.primary,
        },
        false: {
            borderColor: theme.colors.border.primary,
        },
    } as const;
}

function createRadioDotSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'radioButton', (size) => ({
        width: size.radioDotSize,
        height: size.radioDotSize,
    }));
}

function createRadioDotIntentColor(theme: Theme, intent: RadioButtonIntent) {
    return theme.intents[intent].primary;
}

function createRadioStyles(theme: Theme) {
    return ({ intent }: Partial<RadioButtonVariants>) => {
        return {
            borderRadius: 9999,
            borderWidth: 1.5,
            borderStyle: 'solid',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.surface.primary,
            variants: {
                size: createRadioSizeVariants(theme),
                checked: createCheckedVariants(theme, intent),
                disabled: {
                    true: {
                        opacity: 0.5,
                        backgroundColor: theme.colors.surface.tertiary,
                        _web: {
                            cursor: 'not-allowed',
                        },
                    },
                    false: {
                        opacity: 1,
                        backgroundColor: theme.colors.surface.primary,
                        _web: {
                            cursor: 'pointer',
                            _hover: {
                                opacity: 0.8,
                            },
                            _active: {
                                opacity: 0.6,
                            },
                        },
                    },
                },
            },
            _web: {
                transition: 'all 0.2s ease',
            },
        } as const;
    }
}

function createRadioDotStyles(theme: Theme) {
    return ({ intent }: Partial<RadioButtonVariants>) => {
        return {
            borderRadius: 9999,
            backgroundColor: createRadioDotIntentColor(theme, intent),
            variants: {
                size: createRadioDotSizeVariants(theme),
            },
        } as const;
    }
}

// Container style creator for extension support
function createContainerStyles(theme: Theme) {
    return () => ({
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        paddingVertical: 4,
        variants: {
            size: buildSizeVariants(theme, 'radioButton', (size) => ({
                gap: size.gap,
            })),
            margin: buildMarginVariants(theme),
            marginVertical: buildMarginVerticalVariants(theme),
            marginHorizontal: buildMarginHorizontalVariants(theme),
        } as const,
    });
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const radioButtonStyles = StyleSheet.create((theme: Theme) => {
    // Apply extensions to main visual elements
    const extended = applyExtensions('RadioButton', theme, {
        container: createContainerStyles(theme),
        radio: createRadioStyles(theme),
        radioDot: createRadioDotStyles(theme),
    });

    return {
        ...extended,
        // Minor utility styles
        label: {
            color: theme.colors.text.primary,
            variants: {
                size: buildSizeVariants(theme, 'radioButton', (size) => ({
                    fontSize: size.fontSize,
                })),
                disabled: {
                    true: { opacity: 0.5 },
                    false: { opacity: 1 },
                },
            },
        },
        groupContainer: {
            gap: 4,
            variants: {
                orientation: {
                    horizontal: {
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: 16,
                    },
                    vertical: {
                        flexDirection: 'column',
                    },
                },
            },
        },
    };
});