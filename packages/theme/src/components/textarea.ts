import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";

type TextAreaSize = 'sm' | 'md' | 'lg';
type TextAreaIntent = Intent;
type TextAreaResize = 'none' | 'vertical' | 'horizontal' | 'both';

type TextAreaLabelVariants = {
    disabled: boolean;
}

type TextAreaTextareaVariants = {
    size: TextAreaSize;
    intent: TextAreaIntent;
    disabled: boolean;
    hasError: boolean;
    resize: TextAreaResize;
}

type TextAreaHelperTextVariants = {
    hasError: boolean;
}

type TextAreaCharacterCountVariants = {
    isNearLimit: boolean;
    isAtLimit: boolean;
}

export type ExpandedTextAreaLabelStyles = StylesheetStyles<keyof TextAreaLabelVariants>;
export type ExpandedTextAreaTextareaStyles = StylesheetStyles<keyof TextAreaTextareaVariants>;
export type ExpandedTextAreaHelperTextStyles = StylesheetStyles<keyof TextAreaHelperTextVariants>;
export type ExpandedTextAreaCharacterCountStyles = StylesheetStyles<keyof TextAreaCharacterCountVariants>;
export type ExpandedTextAreaStyles = StylesheetStyles<never>;

export type TextAreaStylesheet = {
    container: ExpandedTextAreaStyles;
    label: ExpandedTextAreaLabelStyles;
    textareaContainer: ExpandedTextAreaStyles;
    textarea: ExpandedTextAreaTextareaStyles;
    helperText: ExpandedTextAreaHelperTextStyles;
    footer: ExpandedTextAreaStyles;
    characterCount: ExpandedTextAreaCharacterCountStyles;
}

/**
 * Create size variants for textarea
 */
function createTextareaSizeVariants() {
    return {
        sm: {
            fontSize: 14,
            padding: 8,
            lineHeight: 20,
        },
        md: {
            fontSize: 16,
            padding: 12,
            lineHeight: 24,
        },
        lg: {
            fontSize: 18,
            padding: 16,
            lineHeight: 28,
        },
    };
}

/**
 * Create compound variants for textarea
 */
function createTextareaCompoundVariants(theme: Theme): CompoundVariants<keyof TextAreaTextareaVariants> {
    return [
        {
            disabled: false,
            hasError: false,
            intent: 'primary',
            styles: {
                _web: {
                    ':focus': {
                        borderColor: theme.intents.primary.primary,
                        boxShadow: `0 0 0 2px ${theme.intents.primary.primary}33`,
                    },
                },
            },
        },
        {
            disabled: false,
            hasError: false,
            intent: 'success',
            styles: {
                borderColor: theme.intents.success.primary,
                _web: {
                    ':focus': {
                        boxShadow: `0 0 0 2px ${theme.intents.success.primary}33`,
                    },
                },
            },
        },
        {
            disabled: false,
            hasError: false,
            intent: 'warning',
            styles: {
                borderColor: theme.intents.warning.primary,
                _web: {
                    ':focus': {
                        boxShadow: `0 0 0 2px ${theme.intents.warning.primary}33`,
                    },
                },
            },
        },
        {
            disabled: false,
            hasError: false,
            intent: 'neutral',
            styles: {
                _web: {
                    ':focus': {
                        borderColor: theme.intents.neutral.primary,
                        boxShadow: `0 0 0 2px ${theme.intents.neutral.primary}33`,
                    },
                },
            },
        },
    ];
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedTextAreaStyles>): ExpandedTextAreaStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing?.xs || 4,
    }, expanded);
}

const createLabelStyles = (theme: Theme, expanded: Partial<ExpandedTextAreaLabelStyles>): ExpandedTextAreaLabelStyles => {
    return deepMerge({
        fontSize: 14,
        fontWeight: theme.typography?.fontWeight?.medium || '500',
        color: theme.colors?.text?.primary || '#000000',
        variants: {
            disabled: {
                true: {
                    opacity: 0.5,
                },
                false: {},
            },
        },
    }, expanded);
}

const createTextareaContainerStyles = (theme: Theme, expanded: Partial<ExpandedTextAreaStyles>): ExpandedTextAreaStyles => {
    return deepMerge({
        position: 'relative',
    }, expanded);
}

const createTextareaStyles = (theme: Theme, expanded: Partial<ExpandedTextAreaTextareaStyles>): ExpandedTextAreaTextareaStyles => {
    return deepMerge({
        width: '100%',
        color: theme.colors?.text?.primary || '#000000',
        backgroundColor: theme.colors?.surface?.primary || '#ffffff',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.colors?.border?.primary || '#e0e0e0',
        borderRadius: theme.borderRadius?.md || 8,
        lineHeight: 'normal',
        variants: {
            size: createTextareaSizeVariants(),
            intent: {
                primary: {},
                neutral: {},
                success: {},
                error: {},
                warning: {},
            },
            disabled: {
                true: {
                    opacity: 0.5,
                    backgroundColor: theme.colors?.surface?.secondary || '#f5f5f5',
                    _web: {
                        cursor: 'not-allowed',
                    },
                },
                false: {},
            },
            hasError: {
                true: {
                    borderColor: theme.intents.error.primary,
                },
                false: {},
            },
            resize: {
                none: {
                    _web: {
                        resize: 'none',
                    },
                },
                vertical: {
                    _web: {
                        resize: 'vertical',
                    },
                },
                horizontal: {
                    _web: {
                        resize: 'horizontal',
                    },
                },
                both: {
                    _web: {
                        resize: 'both',
                    },
                },
            },
        },
        compoundVariants: createTextareaCompoundVariants(theme),
        _web: {
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            boxSizing: 'border-box',
            overflowY: 'hidden',
        },
    }, expanded);
}

const createHelperTextStyles = (theme: Theme, expanded: Partial<ExpandedTextAreaHelperTextStyles>): ExpandedTextAreaHelperTextStyles => {
    return deepMerge({
        fontSize: 12,
        color: theme.colors?.text?.secondary || '#666666',
        variants: {
            hasError: {
                true: {
                    color: theme.intents.error.primary,
                },
                false: {},
            },
        },
    }, expanded);
}

const createFooterStyles = (theme: Theme, expanded: Partial<ExpandedTextAreaStyles>): ExpandedTextAreaStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: theme.spacing?.xs || 4,
    }, expanded);
}

const createCharacterCountStyles = (theme: Theme, expanded: Partial<ExpandedTextAreaCharacterCountStyles>): ExpandedTextAreaCharacterCountStyles => {
    return deepMerge({
        fontSize: 12,
        color: theme.colors?.text?.secondary || '#666666',
        variants: {
            isNearLimit: {
                true: {
                    color: theme.intents.warning.primary,
                },
                false: {},
            },
            isAtLimit: {
                true: {
                    color: theme.intents.error.primary,
                },
                false: {},
            },
        },
    }, expanded);
}

export const createTextAreaStylesheet = (theme: Theme, expanded?: Partial<TextAreaStylesheet>): TextAreaStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        label: createLabelStyles(theme, expanded?.label || {}),
        textareaContainer: createTextareaContainerStyles(theme, expanded?.textareaContainer || {}),
        textarea: createTextareaStyles(theme, expanded?.textarea || {}),
        helperText: createHelperTextStyles(theme, expanded?.helperText || {}),
        footer: createFooterStyles(theme, expanded?.footer || {}),
        characterCount: createCharacterCountStyles(theme, expanded?.characterCount || {}),
    };
}
