import { CompoundVariants, ExpandedStyles, Styles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";
import { buildSizeVariants } from "../variants/index";

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonIntent = Intent;
type ButtonType = 'contained' | 'outlined' | 'text';

type ButtonVariants = {
    size: ButtonSize;
    intent: ButtonIntent;
    type: ButtonType;
}

export type ExpandedButtonStyles = ExpandedStyles<keyof ButtonVariants>;

export type ButtonStylesheet = {
    button: ExpandedButtonStyles;
    icon: ExpandedButtonStyles;
    iconContainer: ExpandedButtonStyles;
    text: ExpandedButtonStyles;
}

/**
 * Create compound button variants based on theme intents
 * @param theme
 */
function createButtonCompoundVariants(theme: Theme) {
    // Intent and Type compound variants
    const compoundVariants: CompoundVariants<keyof ButtonVariants> = [];
    for (const intent in theme.intents) {
        // Outlined: transparent background, primary color text/border
        compoundVariants.push({
            intent: intent as ButtonIntent,
            type: 'outlined',
            styles: {
                borderWidth: 2,
                borderStyle: 'solid',
                backgroundColor: 'transparent',
                color: theme.intents[intent as keyof typeof theme.intents].primary,
                borderColor: theme.intents[intent as keyof typeof theme.intents].primary,
            },
        });

        // Text: transparent background, primary color text, no border
        compoundVariants.push({
            intent: intent as ButtonIntent,
            type: 'text',
            styles: {
                borderWidth: 0,
                backgroundColor: 'transparent',
                color: theme.intents[intent as keyof typeof theme.intents].primary,
            },
        });

        // Contained: primary background, contrast text
        compoundVariants.push({
            intent: intent as ButtonIntent,
            type: 'contained',
            styles: {
                borderWidth: 0,
                backgroundColor: theme.intents[intent as keyof typeof theme.intents].primary,
                color: theme.intents[intent as keyof typeof theme.intents].contrast,
            },
        });
    }

    return compoundVariants;
}

/**
 * Generate main button styles
 * @param theme 
 * @param expanded 
 */
const createButtonStyles = (theme: Theme, expanded: Partial<ExpandedButtonStyles>): ExpandedButtonStyles => {
    return deepMerge({
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8, // TODO - replace with theme value or composition function
        fontWeight: '600',
        textAlign: 'center',
        transition: 'all 0.2s ease',
        // Set default color to prevent fallback to theme.colors.text.placeholder
        color: theme.intents.primary.contrast,
        variants: {
            size: buildSizeVariants(theme, 'button', size => size),
            disabled: {
                true: {
                    opacity: 0.6,
                },
                false: {
                    opacity: 1,
                },
            },
        },
        compoundVariants: createButtonCompoundVariants(theme),
    }, expanded);
}

/**
 * Create compound variants for icon colors in outlined and text variants
 * @param theme
 */
function createIconCompoundVariants(theme: Theme) {
    const compoundVariants: CompoundVariants<keyof ButtonVariants> = [];

    for (const intent in theme.intents) {
        // Outlined variant icon colors - use primary color
        compoundVariants.push({
            intent: intent as ButtonIntent,
            type: 'outlined',
            styles: {
                color: theme.intents[intent as keyof typeof theme.intents].primary,
            },
        });

        // Text variant icon colors - use primary color
        compoundVariants.push({
            intent: intent as ButtonIntent,
            type: 'text',
            styles: {
                color: theme.intents[intent as keyof typeof theme.intents].primary,
            },
        });
    }

    return compoundVariants;
}

/**
 * Generate button icon styles
 * @param theme
 * @param expanded
 */
const createButtonIconStyles = (theme: Theme, expanded: Partial<ExpandedButtonStyles>): ExpandedButtonStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        variants: {
            size: {
                sm: {
                    width: 14,
                    height: 14,
                },
                md: {
                    width: 16,
                    height: 16,
                },
                lg: {
                    width: 18,
                    height: 18,
                },
            },
            intent: {
                primary: {
                    color: theme.intents.primary.contrast,
                },
                success: {
                    color: theme.intents.success.contrast,
                },
                error: {
                    color: theme.intents.error.contrast,
                },
                warning: {
                    color: theme.intents.warning.contrast,
                },
                neutral: {
                    color: theme.intents.neutral.contrast,
                },
            },
        },
        compoundVariants: createIconCompoundVariants(theme),
    }, expanded);
}

/**
 * Generate button icon container styles
 * @param theme
 * @param expanded
 */
const createButtonIconContainerStyles = (theme: Theme, expanded: Partial<ExpandedButtonStyles>): ExpandedButtonStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4, // TODO - replace with theme value or composition function
    }, expanded);
}

/**
 * Create compound variants for text colors in outlined and text variants
 * @param theme
 */
function createTextCompoundVariants(theme: Theme) {
    const compoundVariants: CompoundVariants<keyof ButtonVariants> = [];

    for (const intent in theme.intents) {
        // Outlined variant text colors - use primary color
        compoundVariants.push({
            intent: intent as ButtonIntent,
            type: 'outlined',
            styles: {
                color: theme.intents[intent as keyof typeof theme.intents].primary,
            },
        });

        // Text variant text colors - use primary color
        compoundVariants.push({
            intent: intent as ButtonIntent,
            type: 'text',
            styles: {
                color: theme.intents[intent as keyof typeof theme.intents].primary,
            },
        });
    }

    return compoundVariants;
}

/**
 * Generate button text styles
 * @param theme
 * @param expanded
 */
const createButtonTextStyles = (theme: Theme, expanded: Partial<ExpandedButtonStyles>): ExpandedButtonStyles => {
    return deepMerge({
        fontWeight: '600',
        textAlign: 'center',
        variants: {
            size: {
                sm: {
                    fontSize: 14,
                },
                md: {
                    fontSize: 16,
                },
                lg: {
                    fontSize: 18,
                },
            },
            intent: {
                primary: {
                    color: theme.intents.primary.contrast,
                },
                success: {
                    color: theme.intents.success.contrast,
                },
                error: {
                    color: theme.intents.error.contrast,
                },
                warning: {
                    color: theme.intents.warning.contrast,
                },
                neutral: {
                    color: theme.intents.neutral.contrast,
                },
            },
            disabled: {
                true: {
                    opacity: 0.6,
                },
                false: {
                    opacity: 1,
                },
            },
        },
        compoundVariants: createTextCompoundVariants(theme),
    }, expanded);
}

/**
 * Generate button stylesheet
 * @param theme 
 * @param expanded 
 * @returns 
 */
export const createButtonStylesheet = (theme: Theme, expanded?: Partial<ButtonStylesheet>): ButtonStylesheet => {
    return {
        button: createButtonStyles(theme, expanded?.button),
        icon: createButtonIconStyles(theme, expanded?.icon),
        iconContainer: createButtonIconContainerStyles(theme, expanded?.iconContainer),
        text: createButtonTextStyles(theme, expanded?.text),
    };
}