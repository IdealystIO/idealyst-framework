import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent, Size} from '@idealyst/theme';
import { deepMerge } from '../utils/deepMerge';

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
    };
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
    };
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
    };
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
    };
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
    };
}

function createWrapperStyles(theme: Theme, expanded: Partial<ExpandedCheckboxStyles>) {
    return deepMerge({
        flexDirection: 'column',
        gap: 4,
        _web: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: 'auto',
        },
    }, expanded);
}

function createContainerStyles(theme: Theme, expanded: Partial<ExpandedCheckboxStyles>) {
    return deepMerge({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        _web: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            width: 'fit-content',
            cursor: 'pointer',
        },
    }, expanded);
}

function createCheckboxStyles(theme: Theme, expanded: Partial<ExpandedCheckboxStyles>) {
    return ({ intent }: CheckboxVariants) => {
        return deepMerge({
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
        }, expanded);
    }
}

function createLabelStyles(theme: Theme, expanded: Partial<ExpandedCheckboxStyles>) {
    return deepMerge({
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
    }, expanded);
}

function createCheckmarkStyles(_theme: Theme, expanded: Partial<ExpandedCheckboxStyles>) {
    return deepMerge({
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        variants: {
            size: createCheckmarkSizeVariants(),
            visible: {
                true: { opacity: 1 },
                false: { opacity: 0 },
            },
        },
    }, expanded);
}

function createHelperTextStyles(theme: Theme, expanded: Partial<ExpandedCheckboxStyles>) {
    return deepMerge({
        fontSize: 14,
        color: theme.colors.text.secondary,
        marginTop: 2,
        variants: {
            error: {
                true: { color: theme.intents.error.primary },
                false: { color: theme.colors.text.secondary },
            },
        },
    }, expanded);
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const checkboxStyles = StyleSheet.create((theme: Theme) => {
  return {
    wrapper: createWrapperStyles(theme, {}),
    container: createContainerStyles(theme, {}),
    checkbox: createCheckboxStyles(theme, {}),
    label: createLabelStyles(theme, {}),
    checkmark: createCheckmarkStyles(theme, {}),
    helperText: createHelperTextStyles(theme, {}),
  };
});