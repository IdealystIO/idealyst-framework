import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent, Size } from '@idealyst/theme';
import {
  buildMarginVariants,
  buildMarginVerticalVariants,
  buildMarginHorizontalVariants,
} from '../utils/buildViewStyleVariants';
import { applyExtensions } from '../extensions/applyExtension';

type CheckboxSize = Size;
type CheckboxIntent = Intent | 'info';
type CheckboxType = 'default' | 'outlined';

type CheckboxVariants = {
    size: CheckboxSize;
    intent: CheckboxIntent;
    type: CheckboxType;
    checked: boolean;
    disabled: boolean;
    visible: boolean;
    error: boolean;
}

export type ExpandedCheckboxStyles = StylesheetStyles<keyof CheckboxVariants>;

export type CheckboxStylesheet = {
    wrapper: ExpandedCheckboxStyles;
    container: ExpandedCheckboxStyles;
    checkbox: ExpandedCheckboxStyles;
    label: ExpandedCheckboxStyles;
    checkmark: ExpandedCheckboxStyles;
    helperText: ExpandedCheckboxStyles;
}

/**
 * Helper to get intent colors, mapping 'info' to 'primary'
 */
function getIntentColors(theme: Theme, intent: CheckboxIntent) {
    const actualIntent = intent === 'info' ? 'primary' : intent;
    return theme.intents[actualIntent as Intent];
}

/**
 * Create size variants for checkbox
 */
function createCheckboxSizeVariants() {
    return {
        xs: { width: 14, height: 14 },
        sm: { width: 16, height: 16 },
        md: { width: 20, height: 20 },
        lg: { width: 24, height: 24 },
        xl: { width: 28, height: 28 },
    } as const;
}

/**
 * Create type variants for checkbox
 */
function createCheckboxTypeVariants(theme: Theme) {
    return {
        default: {
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            _web: {
                border: `1px solid ${theme.colors.border.primary}`,
            },
        },
        outlined: {
            borderWidth: 2,
            borderColor: theme.colors.border.primary,
            _web: {
                border: `2px solid ${theme.colors.border.primary}`,
            },
        },
    } as const;
}

/**
 * Create checked state variants dynamically based on intent
 */
function createCheckedVariants(theme: Theme, intent: CheckboxIntent) {
    const colors = getIntentColors(theme, intent);

    return {
        true: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            _web: {
                border: `1px solid ${colors.primary}`,
            },
        },
        false: {
            backgroundColor: 'transparent',
        },
    } as const;
}

/**
 * Create size variants for label
 */
function createLabelSizeVariants() {
    return {
        xs: { fontSize: 12 },
        sm: { fontSize: 14 },
        md: { fontSize: 16 },
        lg: { fontSize: 18 },
        xl: { fontSize: 20 },
    } as const;
}

/**
 * Create size variants for checkmark
 */
function createCheckmarkSizeVariants() {
    return {
        xs: { width: 10, height: 10 },
        sm: { width: 12, height: 12 },
        md: { width: 14, height: 14 },
        lg: { width: 16, height: 16 },
        xl: { width: 20, height: 20 },
    } as const;
}

function createCheckboxStyles(theme: Theme) {
    return ({ intent }: Partial<CheckboxVariants>) => {
        return {
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            position: 'relative',
            backgroundColor: 'transparent',
            borderColor: theme.colors.border.primary,
            variants: {
                size: createCheckboxSizeVariants(),
                type: createCheckboxTypeVariants(theme),
                checked: createCheckedVariants(theme, intent),
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
                            _hover: { opacity: 0.8 },
                            _active: { opacity: 0.6 },
                        },
                    },
                },
            },
            _web: {
                outline: 'none',
                display: 'flex',
                boxSizing: 'border-box',
                userSelect: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                transition: 'all 0.2s ease',
                _focus: {
                    outline: `2px solid ${theme.intents.primary.primary}`,
                    outlineOffset: '2px',
                },
            },
        } as const;
    }
}

function createCheckmarkStyles(_theme: Theme) {
    return () => ({
        position: 'absolute' as const,
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        color: '#ffffff',
        variants: {
            size: createCheckmarkSizeVariants(),
            visible: {
                true: { opacity: 1 },
                false: { opacity: 0 },
            },
        },
    });
}

// Helper functions to create static styles wrapped in dynamic functions
function createWrapperStyles(theme: Theme) {
    return () => ({
        flexDirection: 'column' as const,
        gap: 4,
        variants: {
            // Spacing variants from FormInputStyleProps
            margin: buildMarginVariants(theme),
            marginVertical: buildMarginVerticalVariants(theme),
            marginHorizontal: buildMarginHorizontalVariants(theme),
        },
        _web: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: 'auto',
        },
    });
}

function createContainerStyles() {
    return () => ({
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 8,
        _web: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            width: 'fit-content',
            cursor: 'pointer',
        },
    });
}

function createLabelStyles(theme: Theme) {
    return () => ({
        color: theme.colors.text.primary,
        variants: {
            size: createLabelSizeVariants(),
            disabled: {
                true: { opacity: 0.5 },
                false: { opacity: 1 },
            },
        },
        _web: {
            display: 'block',
            textAlign: 'left',
            margin: 0,
            padding: 0,
        },
    });
}

function createHelperTextStyles(theme: Theme) {
    return () => ({
        fontSize: 14,
        color: theme.colors.text.secondary,
        marginTop: 2,
        variants: {
            error: {
                true: { color: theme.intents.error.primary },
                false: { color: theme.colors.text.secondary },
            },
        },
    });
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const checkboxStyles = StyleSheet.create((theme: Theme) => {
    // Apply extensions to main visual elements
    const extended = applyExtensions('Checkbox', theme, {
        container: createContainerStyles(),
        checkbox: createCheckboxStyles(theme),
        checkmark: createCheckmarkStyles(theme),
    });

    return {
        ...extended,
        // Minor utility styles (not extended)
        wrapper: createWrapperStyles(theme)(),
        label: createLabelStyles(theme)(),
        helperText: createHelperTextStyles(theme)(),
    };
});