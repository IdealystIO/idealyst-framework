import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { deepMerge } from "../util/deepMerge";

type InputSize = 'sm' | 'md' | 'lg';
type InputType = 'default' | 'outlined' | 'filled' | 'bare';

type InputVariants = {
    size: InputSize;
    type: InputType;
    focused: boolean;
    hasError: boolean;
    disabled: boolean;
}

export type ExpandedInputStyles = StylesheetStyles<keyof InputVariants>;

export type InputStylesheet = {
    container: ExpandedInputStyles;
    leftIconContainer: ExpandedInputStyles;
    rightIconContainer: ExpandedInputStyles;
    leftIcon: ExpandedInputStyles;
    rightIcon: ExpandedInputStyles;
    passwordToggle: ExpandedInputStyles;
    passwordToggleIcon: ExpandedInputStyles;
    input: ExpandedInputStyles;
}

/**
 * Create size variants for container
 */
function createContainerSizeVariants(theme: Theme) {
    return {
        sm: {
            height: 36,
            paddingHorizontal: theme.spacing?.xs || 4,
        },
        md: {
            height: 44,
            paddingHorizontal: theme.spacing?.sm || 8,
        },
        lg: {
            height: 52,
            paddingHorizontal: theme.spacing?.md || 16,
        },
    };
}

/**
 * Create type variants for container
 */
function createContainerTypeVariants(theme: Theme) {
    return {
        default: {
            backgroundColor: theme.colors?.surface?.primary || '#ffffff',
            borderWidth: 1,
            borderColor: theme.colors?.border?.primary || '#e0e0e0',
            borderStyle: 'solid',
            _web: {
                border: `1px solid ${theme.colors?.border?.primary || '#e0e0e0'}`,
            },
        },
        outlined: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.intents.primary.primary,
            borderStyle: 'solid',
            _web: {
                border: `1px solid ${theme.intents.primary.primary}`,
            },
        },
        filled: {
            backgroundColor: theme.colors?.surface?.secondary || '#f5f5f5',
            borderWidth: 0,
            _web: {
                border: 'none',
            },
        },
        bare: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            _web: {
                border: 'none',
            },
        },
    };
}

/**
 * Create compound variants for container
 */
function createContainerCompoundVariants(theme: Theme): CompoundVariants<keyof InputVariants> {
    return [
        {
            type: 'default',
            focused: true,
            styles: {
                borderColor: theme.intents.primary.primary,
                _web: {
                    border: `1px solid ${theme.intents.primary.primary}`,
                    boxShadow: `0 0 0 2px ${theme.intents.primary.primary}20`,
                },
            },
        },
        {
            type: 'outlined',
            focused: true,
            styles: {
                borderColor: theme.intents.primary.primary,
                _web: {
                    border: `2px solid ${theme.intents.primary.primary}`,
                },
            },
        },
        {
            type: 'filled',
            focused: true,
            styles: {
                _web: {
                    boxShadow: `0 0 0 2px ${theme.intents.primary.primary}20`,
                },
            },
        },
        {
            hasError: true,
            focused: true,
            styles: {
                borderColor: theme.intents.error.primary,
                _web: {
                    border: `1px solid ${theme.intents.error.primary}`,
                    boxShadow: `0 0 0 2px ${theme.intents.error.primary}20`,
                },
            },
        },
    ];
}

/**
 * Create size variants for icon containers
 */
function createIconContainerSizeVariants(theme: Theme) {
    return {
        sm: { marginRight: theme.spacing?.xs || 4 },
        md: { marginRight: theme.spacing?.xs || 4 },
        lg: { marginRight: theme.spacing?.sm || 8 },
    };
}

/**
 * Create size variants for icons
 */
function createIconSizeVariants() {
    return {
        sm: {
            fontSize: 16,
            width: 16,
            height: 16,
            minWidth: 16,
            maxWidth: 16,
            minHeight: 16,
            maxHeight: 16,
        },
        md: {
            fontSize: 20,
            width: 20,
            height: 20,
            minWidth: 20,
            maxWidth: 20,
            minHeight: 20,
            maxHeight: 20,
        },
        lg: {
            fontSize: 24,
            width: 24,
            height: 24,
            minWidth: 24,
            maxWidth: 24,
            minHeight: 24,
            maxHeight: 24,
        },
    };
}

/**
 * Create size variants for input
 */
function createInputSizeVariants(theme: Theme) {
    return {
        sm: { fontSize: theme.typography?.fontSize?.sm || 14 },
        md: { fontSize: theme.typography?.fontSize?.md || 16 },
        lg: { fontSize: theme.typography?.fontSize?.lg || 18 },
    };
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedInputStyles>): ExpandedInputStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderRadius: theme.borderRadius?.md || 8,
        variants: {
            size: createContainerSizeVariants(theme),
            type: createContainerTypeVariants(theme),
            focused: {
                true: {},
                false: {},
            },
            hasError: {
                true: {
                    borderColor: theme.intents.error.primary,
                    _web: {
                        border: `1px solid ${theme.intents.error.primary}`,
                    },
                },
                false: {},
            },
            disabled: {
                true: {
                    opacity: 0.6,
                    backgroundColor: theme.colors?.surface?.secondary || '#f5f5f5',
                    _web: {
                        cursor: 'not-allowed',
                    },
                },
                false: {},
            },
        },
        compoundVariants: createContainerCompoundVariants(theme),
        _web: {
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            ':hover': {
                borderColor: theme.intents.primary.primary,
            },
        },
    }, expanded);
}

const createLeftIconContainerStyles = (theme: Theme, expanded: Partial<ExpandedInputStyles>): ExpandedInputStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        variants: {
            size: createIconContainerSizeVariants(theme),
        },
    }, expanded);
}

const createRightIconContainerStyles = (theme: Theme, expanded: Partial<ExpandedInputStyles>): ExpandedInputStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        variants: {
            size: {
                sm: { marginLeft: theme.spacing?.xs || 4 },
                md: { marginLeft: theme.spacing?.xs || 4 },
                lg: { marginLeft: theme.spacing?.sm || 8 },
            },
        },
    }, expanded);
}

const createLeftIconStyles = (theme: Theme, expanded: Partial<ExpandedInputStyles>): ExpandedInputStyles => {
    return deepMerge({
        color: theme.colors?.text?.secondary || '#666666',
        variants: {
            size: createIconSizeVariants(),
        },
    }, expanded);
}

const createRightIconStyles = (theme: Theme, expanded: Partial<ExpandedInputStyles>): ExpandedInputStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: theme.colors?.text?.secondary || '#666666',
        variants: {
            size: createIconSizeVariants(),
        },
    }, expanded);
}

const createPasswordToggleStyles = (theme: Theme, expanded: Partial<ExpandedInputStyles>): ExpandedInputStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        padding: 0,
        variants: {
            size: {
                sm: { marginLeft: theme.spacing?.xs || 4 },
                md: { marginLeft: theme.spacing?.xs || 4 },
                lg: { marginLeft: theme.spacing?.sm || 8 },
            },
        },
        _web: {
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            ':hover': {
                opacity: 0.7,
            },
        },
    }, expanded);
}

const createPasswordToggleIconStyles = (theme: Theme, expanded: Partial<ExpandedInputStyles>): ExpandedInputStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: theme.colors?.text?.secondary || '#666666',
        variants: {
            size: createIconSizeVariants(),
        },
    }, expanded);
}

const createInputStyles = (theme: Theme, expanded: Partial<ExpandedInputStyles>): ExpandedInputStyles => {
    return deepMerge({
        flex: 1,
        minWidth: 0,
        backgroundColor: 'transparent',
        color: theme.colors?.text?.primary || '#000000',
        fontWeight: theme.typography?.fontWeight?.regular || '400',
        variants: {
            size: createInputSizeVariants(theme),
        },
        _web: {
            border: 'none',
            outline: 'none',
            fontFamily: 'inherit',
        },
    }, expanded);
}

export const createInputStylesheet = (theme: Theme, expanded?: Partial<InputStylesheet>): InputStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        leftIconContainer: createLeftIconContainerStyles(theme, expanded?.leftIconContainer || {}),
        rightIconContainer: createRightIconContainerStyles(theme, expanded?.rightIconContainer || {}),
        leftIcon: createLeftIconStyles(theme, expanded?.leftIcon || {}),
        rightIcon: createRightIconStyles(theme, expanded?.rightIcon || {}),
        passwordToggle: createPasswordToggleStyles(theme, expanded?.passwordToggle || {}),
        passwordToggleIcon: createPasswordToggleIconStyles(theme, expanded?.passwordToggleIcon || {}),
        input: createInputStyles(theme, expanded?.input || {}),
    };
}
