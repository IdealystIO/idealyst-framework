import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";

type CheckboxSize = 'sm' | 'md' | 'lg';
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
        sm: { width: 16, height: 16 },
        md: { width: 20, height: 20 },
        lg: { width: 24, height: 24 },
    };
}

/**
 * Create type variants for checkbox
 */
function createCheckboxTypeVariants(theme: Theme) {
    return {
        default: {
            borderWidth: 1,
            borderColor: theme.colors?.border?.primary || '#e0e0e0',
            _web: {
                border: `1px solid ${theme.colors?.border?.primary || '#e0e0e0'}`,
            },
        },
        outlined: {
            borderWidth: 2,
            borderColor: theme.colors?.border?.primary || '#e0e0e0',
            _web: {
                border: `2px solid ${theme.colors?.border?.primary || '#e0e0e0'}`,
            },
        },
    };
}

/**
 * Create compound variants for checkbox (checked + intent combinations)
 */
function createCheckboxCompoundVariants(theme: Theme): CompoundVariants<keyof CheckboxVariants> {
    const variants: CompoundVariants<keyof CheckboxVariants> = [];
    const intents: CheckboxIntent[] = ['primary', 'success', 'error', 'warning', 'neutral', 'info'];

    for (const intent of intents) {
        const colors = getIntentColors(theme, intent);
        variants.push({
            checked: true,
            intent: intent,
            styles: {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
                _web: {
                    border: `1px solid ${colors.primary}`,
                },
            },
        });
    }

    return variants;
}

/**
 * Create size variants for label
 */
function createLabelSizeVariants(theme: Theme) {
    return {
        sm: { fontSize: theme.typography?.fontSize?.sm || 14 },
        md: { fontSize: theme.typography?.fontSize?.md || 16 },
        lg: { fontSize: theme.typography?.fontSize?.lg || 18 },
    };
}

/**
 * Create size variants for checkmark
 */
function createCheckmarkSizeVariants() {
    return {
        sm: { width: 12, height: 12 },
        md: { width: 14, height: 14 },
        lg: { width: 16, height: 16 },
    };
}

const createWrapperStyles = (theme: Theme, expanded: Partial<ExpandedCheckboxStyles>): ExpandedCheckboxStyles => {
    return deepMerge({
        flexDirection: 'column',
        gap: theme.spacing?.xs || 4,
        _web: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: 'auto',
        },
    }, expanded);
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedCheckboxStyles>): ExpandedCheckboxStyles => {
    return deepMerge({
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing?.sm || 8,
        _web: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing?.sm || 8,
            width: 'fit-content',
            cursor: 'pointer',
        },
    }, expanded);
}

const createCheckboxStyles = (theme: Theme, expanded: Partial<ExpandedCheckboxStyles>): ExpandedCheckboxStyles => {
    return deepMerge({
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.borderRadius?.sm || 4,
        position: 'relative',
        variants: {
            size: createCheckboxSizeVariants(),
            intent: {
                primary: { backgroundColor: 'transparent', borderColor: theme.colors?.border?.primary || '#e0e0e0' },
                success: { backgroundColor: 'transparent', borderColor: theme.colors?.border?.primary || '#e0e0e0' },
                error: { backgroundColor: 'transparent', borderColor: theme.colors?.border?.primary || '#e0e0e0' },
                warning: { backgroundColor: 'transparent', borderColor: theme.colors?.border?.primary || '#e0e0e0' },
                neutral: { backgroundColor: 'transparent', borderColor: theme.colors?.border?.primary || '#e0e0e0' },
                info: { backgroundColor: 'transparent', borderColor: theme.colors?.border?.primary || '#e0e0e0' },
            },
            type: createCheckboxTypeVariants(theme),
            checked: {
                true: {},
                false: { backgroundColor: 'transparent' },
            },
            disabled: {
                true: { opacity: 0.5 },
                false: { opacity: 1 },
            },
        },
        compoundVariants: createCheckboxCompoundVariants(theme),
        _web: {
            cursor: 'pointer',
            outline: 'none',
            display: 'flex',
            boxSizing: 'border-box',
            userSelect: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
            transition: 'all 0.2s ease',
            ':hover': { opacity: 0.8 },
            ':focus': {
                outline: `2px solid ${theme.intents.primary.primary}`,
                outlineOffset: '2px',
            },
        },
    }, expanded);
}

const createLabelStyles = (theme: Theme, expanded: Partial<ExpandedCheckboxStyles>): ExpandedCheckboxStyles => {
    return deepMerge({
        color: theme.colors?.text?.primary || '#000000',
        variants: {
            size: createLabelSizeVariants(theme),
            disabled: {
                true: { color: theme.colors?.text?.disabled || '#999999' },
                false: { color: theme.colors?.text?.primary || '#000000' },
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

const createCheckmarkStyles = (theme: Theme, expanded: Partial<ExpandedCheckboxStyles>): ExpandedCheckboxStyles => {
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

const createHelperTextStyles = (theme: Theme, expanded: Partial<ExpandedCheckboxStyles>): ExpandedCheckboxStyles => {
    return deepMerge({
        fontSize: theme.typography?.fontSize?.sm || 14,
        color: theme.colors?.text?.secondary || '#666666',
        marginTop: 2,
        variants: {
            error: {
                true: { color: theme.intents.error.primary },
                false: { color: theme.colors?.text?.secondary || '#666666' },
            },
        },
    }, expanded);
}

export const createCheckboxStylesheet = (theme: Theme, expanded?: Partial<CheckboxStylesheet>): CheckboxStylesheet => {
    return {
        wrapper: createWrapperStyles(theme, expanded?.wrapper || {}),
        container: createContainerStyles(theme, expanded?.container || {}),
        checkbox: createCheckboxStyles(theme, expanded?.checkbox || {}),
        label: createLabelStyles(theme, expanded?.label || {}),
        checkmark: createCheckmarkStyles(theme, expanded?.checkmark || {}),
        helperText: createHelperTextStyles(theme, expanded?.helperText || {}),
    };
}
