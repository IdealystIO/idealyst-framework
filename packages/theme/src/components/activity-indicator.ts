import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";

type ActivityIndicatorSize = 'sm' | 'md' | 'lg';
type ActivityIndicatorIntent = Intent;

type ActivityIndicatorVariants = {
    size: ActivityIndicatorSize;
    intent: ActivityIndicatorIntent;
    animating: boolean;
}

export type ExpandedActivityIndicatorStyles = StylesheetStyles<keyof ActivityIndicatorVariants>;

export type ActivityIndicatorStylesheet = {
    container: ExpandedActivityIndicatorStyles;
    spinner: ExpandedActivityIndicatorStyles;
}

/**
 * Create size variants for container
 */
function createContainerSizeVariants() {
    return {
        sm: {
            width: 20,
            height: 20,
        },
        md: {
            width: 36,
            height: 36,
        },
        lg: {
            width: 48,
            height: 48,
        },
    };
}

/**
 * Create intent variants for container (empty but needed for type consistency)
 */
function createContainerIntentVariants() {
    return {
        primary: {},
        success: {},
        error: {},
        warning: {},
        neutral: {},
    };
}

/**
 * Create size variants for spinner
 */
function createSpinnerSizeVariants() {
    return {
        sm: {
            width: 20,
            height: 20,
            borderWidth: 2,
        },
        md: {
            width: 36,
            height: 36,
            borderWidth: 3,
        },
        lg: {
            width: 48,
            height: 48,
            borderWidth: 4,
        },
    };
}

/**
 * Create intent variants for spinner
 */
function createSpinnerIntentVariants(theme: Theme) {
    const variants: Record<ActivityIndicatorIntent, any> = {} as any;

    for (const intent in theme.intents) {
        variants[intent as ActivityIndicatorIntent] = {
            color: theme.intents[intent as keyof typeof theme.intents].primary,
            _web: {
                borderTopColor: theme.intents[intent as keyof typeof theme.intents].primary,
                borderRightColor: theme.intents[intent as keyof typeof theme.intents].primary,
            },
        };
    }

    return variants;
}

/**
 * Generate activity indicator container styles
 */
const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedActivityIndicatorStyles>): ExpandedActivityIndicatorStyles => {
    return deepMerge({
        alignItems: 'center',
        justifyContent: 'center',
        variants: {
            size: createContainerSizeVariants(),
            intent: createContainerIntentVariants(),
            animating: {
                true: {
                    opacity: 1,
                },
                false: {
                    opacity: 0,
                },
            },
        },
    }, expanded);
}

/**
 * Generate activity indicator spinner styles
 */
const createSpinnerStyles = (theme: Theme, expanded: Partial<ExpandedActivityIndicatorStyles>): ExpandedActivityIndicatorStyles => {
    return deepMerge({
        borderRadius: 9999,
        borderStyle: 'solid',
        variants: {
            size: createSpinnerSizeVariants(),
            intent: createSpinnerIntentVariants(theme),
            animating: {
                true: {},
                false: {},
            },
        },
        _web: {
            borderColor: 'transparent',
            animation: 'spin 1s linear infinite',
            boxSizing: 'border-box',
        },
    }, expanded);
}

/**
 * Generate activity indicator stylesheet
 */
export const createActivityIndicatorStylesheet = (theme: Theme, expanded?: Partial<ActivityIndicatorStylesheet>): ActivityIndicatorStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        spinner: createSpinnerStyles(theme, expanded?.spinner || {}),
    };
}
