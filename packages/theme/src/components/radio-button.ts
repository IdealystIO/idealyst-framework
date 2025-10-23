import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";

type RadioButtonSize = 'sm' | 'md' | 'lg';
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
function createRadioSizeVariants() {
    return {
        sm: { width: 14, height: 14 },
        md: { width: 18, height: 18 },
        lg: { width: 22, height: 22 },
    };
}

/**
 * Create compound variants for radio button
 */
function createRadioCompoundVariants(theme: Theme): CompoundVariants<keyof RadioButtonVariants> {
    const variants: CompoundVariants<keyof RadioButtonVariants> = [];

    // Unchecked states - lighter border for unselected state
    for (const intent in theme.intents) {
        variants.push({
            checked: false,
            intent: intent as RadioButtonIntent,
            styles: {
                borderColor: theme.colors?.border?.primary || '#e0e0e0',
            },
        });
    }

    // Checked states - intent-colored border
    for (const intent in theme.intents) {
        const intentKey = intent as RadioButtonIntent;
        variants.push({
            checked: true,
            intent: intentKey,
            styles: {
                borderColor: theme.intents[intentKey].primary,
            },
        });
    }

    return variants;
}

/**
 * Create size variants for radio dot
 */
function createRadioDotSizeVariants() {
    return {
        sm: { width: 10, height: 10 },
        md: { width: 12, height: 12 },
        lg: { width: 16, height: 16 },
    };
}

/**
 * Create intent variants for radio dot
 */
function createRadioDotIntentVariants(theme: Theme) {
    const variants: Record<RadioButtonIntent, any> = {} as any;
    for (const intent in theme.intents) {
        variants[intent as RadioButtonIntent] = {
            backgroundColor: theme.intents[intent as RadioButtonIntent].primary,
        };
    }
    return variants;
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedRadioButtonStyles>): ExpandedRadioButtonStyles => {
    return deepMerge({
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing?.sm || 8,
        paddingVertical: theme.spacing?.xs || 4,
    }, expanded);
}

const createRadioStyles = (theme: Theme, expanded: Partial<ExpandedRadioButtonStyles>): ExpandedRadioButtonStyles => {
    return deepMerge({
        borderRadius: theme.borderRadius?.full || 9999,
        borderWidth: 1.5,
        borderStyle: 'solid',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors?.surface?.primary || '#ffffff',
        variants: {
            size: createRadioSizeVariants(),
            checked: {
                true: {},
                false: {},
            },
            intent: {
                primary: {},
                success: {},
                error: {},
                warning: {},
                neutral: {},
            },
            disabled: {
                true: {
                    opacity: 0.5,
                    backgroundColor: theme.colors?.surface?.disabled || '#f5f5f5',
                },
                false: {
                    opacity: 1,
                    backgroundColor: theme.colors?.surface?.primary || '#ffffff',
                },
            },
        },
        compoundVariants: createRadioCompoundVariants(theme),
        _web: {
            transition: 'all 0.2s ease',
        },
    }, expanded);
}

const createRadioDotStyles = (theme: Theme, expanded: Partial<ExpandedRadioButtonStyles>): ExpandedRadioButtonStyles => {
    return deepMerge({
        borderRadius: theme.borderRadius?.full || 9999,
        variants: {
            size: createRadioDotSizeVariants(),
            intent: createRadioDotIntentVariants(theme),
        },
    }, expanded);
}

const createLabelStyles = (theme: Theme, expanded: Partial<ExpandedRadioButtonStyles>): ExpandedRadioButtonStyles => {
    return deepMerge({
        fontSize: 14,
        color: theme.colors?.text?.primary || '#000000',
        variants: {
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
        gap: theme.spacing?.xs || 4,
        variants: {
            orientation: {
                horizontal: {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: theme.spacing?.md || 16,
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
