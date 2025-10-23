import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent, Size} from '@idealyst/theme';
import { deepMerge } from '../utils/deepMerge';

type TextAreaSize = Size;
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
function createTextareaSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'textarea', (size) => ({
        fontSize: size.fontSize,
        padding: size.padding,
        lineHeight: size.lineHeight,
        minHeight: size.minHeight,
    }));
}

/**
 * Get textarea styles based on intent, disabled, and hasError state
 */
function getTextareaIntentStyles(theme: Theme, intent: TextAreaIntent, disabled: boolean, hasError: boolean) {
    if (disabled || hasError) {
        return {};
    }

    const intentValue = theme.intents[intent];
    const baseStyles: any = {};

    // For success and warning, set border color
    if (intent === 'success' || intent === 'warning') {
        baseStyles.borderColor = intentValue.primary;
    }

    // Focus styles for all intents when not disabled and not in error
    baseStyles._web = {
        _focus: {
            borderColor: intentValue.primary,
            boxShadow: `0 0 0 2px ${intentValue.primary}33`,
        },
    };

    return baseStyles;
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedTextAreaStyles>): ExpandedTextAreaStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    }, expanded);
}

const createLabelStyles = (theme: Theme, expanded: Partial<ExpandedTextAreaLabelStyles>): ExpandedTextAreaLabelStyles => {
    return deepMerge({
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.text.primary,
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

const createTextareaStyles = (theme: Theme, expanded: Partial<ExpandedTextAreaTextareaStyles>) => {
    return ({ intent, disabled, hasError }: { intent: TextAreaIntent, disabled: boolean, hasError: boolean }) => {
        const intentStyles = getTextareaIntentStyles(theme, intent, disabled, hasError);

        return deepMerge({
            width: '100%',
            color: theme.colors.text.primary,
            backgroundColor: theme.colors.surface.primary,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.border.primary,
            borderRadius: 8,
            lineHeight: 'normal',
            ...intentStyles,
            variants: {
                size: createTextareaSizeVariants(theme),
                disabled: {
                    true: {
                        opacity: 0.5,
                        backgroundColor: theme.colors.surface.secondary,
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
            _web: {
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxSizing: 'border-box',
                overflowY: 'hidden',
            },
        }, expanded);
    }
}

const createHelperTextStyles = (theme: Theme, expanded: Partial<ExpandedTextAreaHelperTextStyles>): ExpandedTextAreaHelperTextStyles => {
    return deepMerge({
        fontSize: 12,
        color: theme.colors.text.secondary,
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
        gap: 4,
    }, expanded);
}

const createCharacterCountStyles = (theme: Theme, expanded: Partial<ExpandedTextAreaCharacterCountStyles>): ExpandedTextAreaCharacterCountStyles => {
    return deepMerge({
        fontSize: 12,
        color: theme.colors.text.secondary,
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

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const textAreaStyles: ReturnType<typeof createTextAreaStylesheet> = StyleSheet.create((theme: Theme) => {
    return {
        container: createContainerStyles(theme, {}),
        label: createLabelStyles(theme, {}),
        textareaContainer: createTextareaContainerStyles(theme, {}),
        textarea: createTextareaStyles(theme, {}),
        helperText: createHelperTextStyles(theme, {}),
        footer: createFooterStyles(theme, {}),
        characterCount: createCharacterCountStyles(theme, {}),
    };
});
