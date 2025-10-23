import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { Size } from "../theme/size";
import { deepMerge } from "../util/deepMerge";
import { buildSizeVariants } from "../variants/size";

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

/**
 * Create size variants for radio button
 */
function createRadioSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'radioButton', (size) => ({
        width: size.radioSize,
        height: size.radioSize,
    }));
}

/**
 * Create checked variants dynamically based on intent
 */
function createCheckedVariants(theme: Theme, intent: RadioButtonIntent) {
    const intentValue = theme.intents[intent];
    return {
        true: {
            borderColor: intentValue.primary,
        },
        false: {
            borderColor: theme.colors.border.primary,
        },
    };
}

/**
 * Create size variants for radio dot
 */
function createRadioDotSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'radioButton', (size) => ({
        width: size.radioDotSize,
        height: size.radioDotSize,
    }));
}

/**
 * Create intent variant for radio dot background color
 */
function createRadioDotIntentColor(theme: Theme, intent: RadioButtonIntent) {
    return theme.intents[intent].primary;
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedRadioButtonStyles>): ExpandedRadioButtonStyles => {
    return deepMerge({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        variants: {
            size: buildSizeVariants(theme, 'radioButton', (size) => ({
                gap: size.gap,
            })),
        },
    }, expanded);
}

const createRadioStyles = (theme: Theme, expanded: Partial<ExpandedRadioButtonStyles>) => {
    return ({ intent }: RadioButtonVariants) => {
        return deepMerge({
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
        }, expanded);
    }
}

const createRadioDotStyles = (theme: Theme, expanded: Partial<ExpandedRadioButtonStyles>) => {
    return ({ intent }: RadioButtonVariants) => {
        return deepMerge({
            borderRadius: 9999,
            backgroundColor: createRadioDotIntentColor(theme, intent),
            variants: {
                size: createRadioDotSizeVariants(theme),
            },
        }, expanded);
    }
}

const createLabelStyles = (theme: Theme, expanded: Partial<ExpandedRadioButtonStyles>): ExpandedRadioButtonStyles => {
    return deepMerge({
        color: theme.colors.text.primary,
        variants: {
            size: buildSizeVariants(theme, 'radioButton', (size) => ({
                fontSize: size.fontSize,
            })),
            disabled: {
                true: {
                    opacity: 0.5,
                },
                false: {
                    opacity: 1,
                },
            },
        },
    }, expanded);
}

const createGroupContainerStyles = (theme: Theme, expanded: Partial<ExpandedRadioGroupStyles>): ExpandedRadioGroupStyles => {
    return deepMerge({
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
    }, expanded);
}

export const createRadioButtonStylesheet = (theme: Theme, expanded?: Partial<RadioButtonStylesheet>): RadioButtonStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        radio: createRadioStyles(theme, expanded?.radio || {}),
        radioDot: createRadioDotStyles(theme, expanded?.radioDot || {}),
        label: createLabelStyles(theme, expanded?.label || {}),
        groupContainer: createGroupContainerStyles(theme, expanded?.groupContainer || {}),
    };
}
