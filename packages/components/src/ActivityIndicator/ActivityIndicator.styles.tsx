import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent, Size} from '@idealyst/theme';
import { deepMerge } from '../utils/deepMerge';
import { buildSizeVariants } from '../utils/buildSizeVariants';

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

function createContainerSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'activityIndicator', (size) => ({
        width: size.size,
        height: size.size,
    }));
}

function createSpinnerSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'activityIndicator', (size) => ({
        width: size.size,
        height: size.size,
        borderWidth: size.borderWidth,
    }));
}

function getSpinnerColor(theme: Theme, intent: ActivityIndicatorIntent) {
    return theme.intents[intent].primary;
}

function createContainerStyles(theme: Theme, expanded: Partial<ExpandedActivityIndicatorStyles>): ExpandedActivityIndicatorStyles {
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

function createSpinnerStyles(theme: Theme, expanded: Partial<ExpandedActivityIndicatorStyles>) {
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

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const activityIndicatorStyles: ReturnType<typeof createActivityIndicatorStylesheet> = StyleSheet.create((theme: Theme) => {
  return {
    container: createContainerStyles(theme, {}),
    spinner: createSpinnerStyles(theme, {}),
  };
});

function createActivityIndicatorStylesheet(theme: Theme, expanded?: Partial<ActivityIndicatorStylesheet>): ActivityIndicatorStylesheet {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        spinner: createSpinnerStyles(theme, expanded?.spinner || {}),
    };
}
