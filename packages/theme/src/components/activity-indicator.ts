import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { Size } from "../theme/size";
import { deepMerge } from "../util/deepMerge";
import { buildSizeVariants } from "../variants/size";

type ActivityIndicatorSize = Size;
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
function createContainerSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'activityIndicator', (size) => ({
        width: size.size,
        height: size.size,
    }));
}

/**
 * Create size variants for spinner
 */
function createSpinnerSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'activityIndicator', (size) => ({
        width: size.size,
        height: size.size,
        borderWidth: size.borderWidth,
    }));
}

/**
 * Get spinner color based on intent
 */
function getSpinnerColor(theme: Theme, intent: ActivityIndicatorIntent) {
    return theme.intents[intent].primary;
}

/**
 * Generate activity indicator container styles
 */
const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedActivityIndicatorStyles>): ExpandedActivityIndicatorStyles => {
    return deepMerge({
        alignItems: 'center',
        justifyContent: 'center',
        variants: {
            size: createContainerSizeVariants(theme),
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
const createSpinnerStyles = (theme: Theme, expanded: Partial<ExpandedActivityIndicatorStyles>) => {
    return ({ intent }: ActivityIndicatorVariants) => {
        const color = getSpinnerColor(theme, intent);
        return deepMerge({
            borderRadius: 9999,
            borderStyle: 'solid',
            color,
            variants: {
                size: createSpinnerSizeVariants(theme),
                animating: {
                    true: {},
                    false: {},
                },
            },
            _web: {
                borderColor: 'transparent',
                borderTopColor: color,
                borderRightColor: color,
                animation: 'spin 1s linear infinite',
                boxSizing: 'border-box',
            },
        }, expanded);
    }
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
