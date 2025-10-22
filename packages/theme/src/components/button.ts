import { ExpandedStyles, Styles } from "../styles";
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
    const compoundVariants: Array<{ variants: Partial<ButtonVariants>; styles: Styles }> = [];
    for (const intent in theme.intents) {
        compoundVariants.push({
            variants: {
                intent: intent as ButtonIntent,
                type: 'outlined',
            },
            styles: {
                color: theme.intents[intent as keyof typeof theme.intents].main,
            },
        });
        compoundVariants.push({
            variants: {
                intent: intent as ButtonIntent,
                type: 'text',
            },
            styles: {
                color: theme.intents[intent as keyof typeof theme.intents].main,
            },
        });
        compoundVariants.push({
            variants: {
                intent: intent as ButtonIntent,
                type: 'contained',
            },
            styles: {
                backgroundColor: theme.intents[intent as keyof typeof theme.intents].main,
                color: theme.intents[intent as keyof typeof theme.intents].on,
            },
        });
    }
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
        borderRadius: 4, // TODO - replace with theme value or composition function
        fontWeight: '600',
        textAlign: 'center',
        transition: 'all 0.2s ease',
        // Set default color to prevent fallback to theme.colors.text.placeholder
        color: theme.intents.primary.on,
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
 * Generate button icon styles
 * @param theme 
 * @param expanded 
 */
const createButtonIconStyles = (theme: Theme, expanded: Partial<ExpandedButtonStyles>): ExpandedButtonStyles => {
    throw new Error("Not implemented");
}

/**
 * Generate button icon container styles
 * @param theme 
 * @param expanded 
 */
const createButtonIconContainerStyles = (theme: Theme, expanded: Partial<ExpandedButtonStyles>): ExpandedButtonStyles => {
    throw new Error("Not implemented");
}

/**
 * Generate button text styles
 * @param theme 
 * @param expanded 
 */
const createButtonTextStyles = (theme: Theme, expanded: Partial<ExpandedButtonStyles>): ExpandedButtonStyles => {
    throw new Error("Not implemented");
}

/**
 * Generate button stylesheet
 * @param theme 
 * @param expanded 
 * @returns 
 */
export const createButtonStylesheet = (theme: Theme, expanded: Partial<ButtonStylesheet>): ButtonStylesheet => {
    return {
        button: createButtonStyles(theme, expanded.button),
        icon: createButtonIconStyles(theme, expanded.icon),
        iconContainer: createButtonIconContainerStyles(theme, expanded.iconContainer),
        text: createButtonTextStyles(theme, expanded.text),
    };
}