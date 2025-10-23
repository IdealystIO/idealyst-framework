import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";

type AlertType = 'filled' | 'outlined' | 'soft';
type AlertIntent = Intent | 'info'; // Alert includes 'info' which maps to primary

type AlertVariants = {
    type: AlertType;
    intent: AlertIntent;
}

export type ExpandedAlertStyles = StylesheetStyles<keyof AlertVariants>;

export type AlertStylesheet = {
    container: ExpandedAlertStyles;
    iconContainer: ExpandedAlertStyles;
    content: ExpandedAlertStyles;
    title: ExpandedAlertStyles;
    message: ExpandedAlertStyles;
    actions: ExpandedAlertStyles;
    closeButton: ExpandedAlertStyles;
    closeIcon: ExpandedAlertStyles;
}

/**
 * Helper to get intent colors, mapping 'info' to 'primary'
 */
function getIntentColors(theme: Theme, intent: AlertIntent) {
    const actualIntent = intent === 'info' ? 'primary' : intent;
    return theme.intents[actualIntent as Intent];
}

/**
 * Create compound variants for container (type + intent combinations)
 */
function createContainerCompoundVariants(theme: Theme): CompoundVariants<keyof AlertVariants> {
    const variants: CompoundVariants<keyof AlertVariants> = [];
    const intents: AlertIntent[] = ['primary', 'success', 'error', 'warning', 'info', 'neutral'];

    for (const intent of intents) {
        const colors = getIntentColors(theme, intent);

        // Filled variant
        if (intent === 'neutral') {
            variants.push({
                type: 'filled',
                intent: intent,
                styles: {
                    backgroundColor: theme.colors?.surface?.secondary || '#f5f5f5',
                    borderColor: theme.colors?.border?.primary || '#e0e0e0',
                },
            });
        } else {
            variants.push({
                type: 'filled',
                intent: intent,
                styles: {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                },
            });
        }

        // Outlined variant
        if (intent === 'neutral') {
            variants.push({
                type: 'outlined',
                intent: intent,
                styles: {
                    backgroundColor: 'transparent',
                    borderColor: theme.colors?.border?.primary || '#e0e0e0',
                },
            });
        } else {
            variants.push({
                type: 'outlined',
                intent: intent,
                styles: {
                    backgroundColor: 'transparent',
                    borderColor: colors.primary,
                },
            });
        }

        // Soft variant
        if (intent === 'neutral') {
            variants.push({
                type: 'soft',
                intent: intent,
                styles: {
                    backgroundColor: theme.colors?.surface?.secondary || '#f5f5f5',
                    borderColor: theme.colors?.surface?.secondary || '#f5f5f5',
                },
            });
        } else {
            variants.push({
                type: 'soft',
                intent: intent,
                styles: {
                    backgroundColor: colors.container || colors.primary + '20',
                    borderColor: colors.container || colors.primary + '20',
                },
            });
        }
    }

    return variants;
}

/**
 * Create compound variants for icon (type + intent combinations)
 */
function createIconCompoundVariants(theme: Theme): CompoundVariants<keyof AlertVariants> {
    const variants: CompoundVariants<keyof AlertVariants> = [];
    const intents: AlertIntent[] = ['primary', 'success', 'error', 'warning', 'info', 'neutral'];

    for (const intent of intents) {
        const colors = getIntentColors(theme, intent);

        // Filled variant - use contrast color
        variants.push({
            type: 'filled',
            intent: intent,
            styles: {
                color: intent === 'neutral'
                    ? theme.colors?.text?.primary || '#000000'
                    : colors.contrast,
            },
        });

        // Outlined variant - use primary color
        variants.push({
            type: 'outlined',
            intent: intent,
            styles: {
                color: intent === 'neutral'
                    ? theme.colors?.text?.primary || '#000000'
                    : colors.primary,
            },
        });

        // Soft variant - use primary color
        variants.push({
            type: 'soft',
            intent: intent,
            styles: {
                color: intent === 'neutral'
                    ? theme.colors?.text?.primary || '#000000'
                    : colors.primary,
            },
        });
    }

    return variants;
}

/**
 * Create compound variants for title (type + intent combinations)
 */
function createTitleCompoundVariants(theme: Theme): CompoundVariants<keyof AlertVariants> {
    const variants: CompoundVariants<keyof AlertVariants> = [];
    const intents: AlertIntent[] = ['primary', 'success', 'error', 'warning', 'info', 'neutral'];

    for (const intent of intents) {
        const colors = getIntentColors(theme, intent);

        // Filled variant - use contrast color
        variants.push({
            type: 'filled',
            intent: intent,
            styles: {
                color: intent === 'neutral'
                    ? theme.colors?.text?.primary || '#000000'
                    : colors.contrast,
            },
        });

        // Outlined variant - use primary color
        variants.push({
            type: 'outlined',
            intent: intent,
            styles: {
                color: intent === 'neutral'
                    ? theme.colors?.text?.primary || '#000000'
                    : colors.primary,
            },
        });

        // Soft variant - use primary color
        variants.push({
            type: 'soft',
            intent: intent,
            styles: {
                color: intent === 'neutral'
                    ? theme.colors?.text?.primary || '#000000'
                    : colors.primary,
            },
        });
    }

    return variants;
}

/**
 * Create compound variants for message (type + intent combinations)
 */
function createMessageCompoundVariants(theme: Theme): CompoundVariants<keyof AlertVariants> {
    const variants: CompoundVariants<keyof AlertVariants> = [];
    const intents: AlertIntent[] = ['primary', 'success', 'error', 'warning', 'info', 'neutral'];

    for (const intent of intents) {
        const colors = getIntentColors(theme, intent);

        // Filled variant - use contrast color
        variants.push({
            type: 'filled',
            intent: intent,
            styles: {
                color: intent === 'neutral'
                    ? theme.colors?.text?.primary || '#000000'
                    : colors.contrast,
            },
        });

        // Outlined and soft variants - use primary text color
        variants.push({
            type: 'outlined',
            intent: intent,
            styles: {
                color: theme.colors?.text?.primary || '#000000',
            },
        });

        variants.push({
            type: 'soft',
            intent: intent,
            styles: {
                color: theme.colors?.text?.primary || '#000000',
            },
        });
    }

    return variants;
}

/**
 * Generate alert container styles
 */
const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedAlertStyles>): ExpandedAlertStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: theme.spacing?.sm || 8,
        padding: theme.spacing?.md || 16,
        borderRadius: theme.borderRadius?.md || 8,
        borderWidth: 1,
        borderStyle: 'solid',
        variants: {
            type: {
                filled: {},
                outlined: {},
                soft: {},
            },
            intent: {
                primary: {},
                success: {},
                error: {},
                warning: {},
                info: {},
                neutral: {},
            },
        },
        compoundVariants: createContainerCompoundVariants(theme),
    }, expanded);
}

/**
 * Generate alert icon container styles
 */
const createIconContainerStyles = (theme: Theme, expanded: Partial<ExpandedAlertStyles>): ExpandedAlertStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: 24,
        height: 24,
        variants: {
            type: {
                filled: {},
                outlined: {},
                soft: {},
            },
            intent: {
                primary: {},
                success: {},
                error: {},
                warning: {},
                info: {},
                neutral: {},
            },
        },
        compoundVariants: createIconCompoundVariants(theme),
    }, expanded);
}

/**
 * Generate alert content styles
 */
const createContentStyles = (theme: Theme, expanded: Partial<ExpandedAlertStyles>): ExpandedAlertStyles => {
    return deepMerge({
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing?.xs || 4,
    }, expanded);
}

/**
 * Generate alert title styles
 */
const createTitleStyles = (theme: Theme, expanded: Partial<ExpandedAlertStyles>): ExpandedAlertStyles => {
    return deepMerge({
        fontFamily: theme.typography?.fontFamily?.sans,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: theme.typography?.fontWeight?.semibold || '600',
        variants: {
            type: {
                filled: {},
                outlined: {},
                soft: {},
            },
            intent: {
                primary: {},
                success: {},
                error: {},
                warning: {},
                info: {},
                neutral: {},
            },
        },
        compoundVariants: createTitleCompoundVariants(theme),
    }, expanded);
}

/**
 * Generate alert message styles
 */
const createMessageStyles = (theme: Theme, expanded: Partial<ExpandedAlertStyles>): ExpandedAlertStyles => {
    return deepMerge({
        fontFamily: theme.typography?.fontFamily?.sans,
        fontSize: 14,
        lineHeight: 20,
        variants: {
            type: {
                filled: {},
                outlined: {},
                soft: {},
            },
            intent: {
                primary: {},
                success: {},
                error: {},
                warning: {},
                info: {},
                neutral: {},
            },
        },
        compoundVariants: createMessageCompoundVariants(theme),
    }, expanded);
}

/**
 * Generate alert actions styles
 */
const createActionsStyles = (theme: Theme, expanded: Partial<ExpandedAlertStyles>): ExpandedAlertStyles => {
    return deepMerge({
        marginTop: theme.spacing?.xs || 4,
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing?.sm || 8,
    }, expanded);
}

/**
 * Generate alert close button styles
 */
const createCloseButtonStyles = (theme: Theme, expanded: Partial<ExpandedAlertStyles>): ExpandedAlertStyles => {
    return deepMerge({
        padding: 4,
        backgroundColor: 'transparent',
        borderRadius: theme.borderRadius?.sm || 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        _web: {
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
            ':hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
            },
        },
    }, expanded);
}

/**
 * Generate alert close icon styles
 */
const createCloseIconStyles = (theme: Theme, expanded: Partial<ExpandedAlertStyles>): ExpandedAlertStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 16,
        height: 16,
    }, expanded);
}

/**
 * Generate alert stylesheet
 */
export const createAlertStylesheet = (theme: Theme, expanded?: Partial<AlertStylesheet>): AlertStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        iconContainer: createIconContainerStyles(theme, expanded?.iconContainer || {}),
        content: createContentStyles(theme, expanded?.content || {}),
        title: createTitleStyles(theme, expanded?.title || {}),
        message: createMessageStyles(theme, expanded?.message || {}),
        actions: createActionsStyles(theme, expanded?.actions || {}),
        closeButton: createCloseButtonStyles(theme, expanded?.closeButton || {}),
        closeIcon: createCloseIconStyles(theme, expanded?.closeIcon || {}),
    };
}
