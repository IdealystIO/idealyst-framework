import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { Size } from "../theme/size";
import { deepMerge } from "../util/deepMerge";
import { buildSizeVariants } from "../variants/size";

type ProgressSize = Size;
type ProgressIntent = Intent;

type ProgressVariants = {
    size: ProgressSize;
    intent: ProgressIntent;
    rounded: boolean;
}

export type ExpandedProgressStyles = StylesheetStyles<keyof ProgressVariants>;

export type ProgressStylesheet = {
    container: ExpandedProgressStyles;
    linearTrack: ExpandedProgressStyles;
    linearBar: ExpandedProgressStyles;
    indeterminateBar: ExpandedProgressStyles;
    circularContainer: ExpandedProgressStyles;
    circularTrack: ExpandedProgressStyles;
    circularBar: ExpandedProgressStyles;
    label: ExpandedProgressStyles;
    circularLabel: ExpandedProgressStyles;
}

/**
 * Create size variants for linear track
 */
function createLinearTrackSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'progress', (size) => ({
        height: size.linearHeight,
    }));
}

/**
 * Get linear bar background color based on intent
 */
function getLinearBarColor(theme: Theme, intent: ProgressIntent) {
    return theme.intents[intent].primary;
}

/**
 * Create size variants for circular container
 */
function createCircularContainerSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'progress', (size) => ({
        width: size.circularSize,
        height: size.circularSize,
    }));
}

/**
 * Get circular bar stroke color based on intent
 */
function getCircularBarColor(theme: Theme, intent: ProgressIntent) {
    return theme.intents[intent].primary;
}

/**
 * Create size variants for label
 */
function createLabelSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'progress', (size) => ({
        fontSize: size.labelFontSize,
    }));
}

/**
 * Create size variants for circular label
 */
function createCircularLabelSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'progress', (size) => ({
        fontSize: size.circularLabelFontSize,
    }));
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles => {
    return deepMerge({
        gap: 4,
    }, expanded);
}

const createLinearTrackStyles = (theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles => {
    return deepMerge({
        backgroundColor: theme.colors.border.secondary,
        overflow: 'hidden',
        position: 'relative',
        variants: {
            size: createLinearTrackSizeVariants(theme),
            rounded: {
                true: {
                    borderRadius: 9999,
                },
                false: {
                    borderRadius: 0,
                },
            },
        },
    }, expanded);
}

const createLinearBarStyles = (theme: Theme, expanded: Partial<ExpandedProgressStyles>) => {
    return ({ intent }: { intent: ProgressIntent }) => {
        return deepMerge({
            height: '100%',
            backgroundColor: getLinearBarColor(theme, intent),
            variants: {
                rounded: {
                    true: {
                        borderRadius: 9999,
                    },
                    false: {
                        borderRadius: 0,
                    },
                },
            },
            _web: {
                transition: 'width 0.3s ease',
            },
        }, expanded);
    }
}

const createIndeterminateBarStyles = (theme: Theme, expanded: Partial<ExpandedProgressStyles>) => {
    return ({ intent }: { intent: ProgressIntent }) => {
        return deepMerge({
            position: 'absolute',
            height: '100%',
            width: '40%',
            backgroundColor: getLinearBarColor(theme, intent),
            variants: {
                rounded: {
                    true: {
                        borderRadius: 9999,
                    },
                    false: {
                        borderRadius: 0,
                    },
                },
            },
        }, expanded);
    }
}

const createCircularContainerStyles = (theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles => {
    return deepMerge({
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        variants: {
            size: createCircularContainerSizeVariants(theme),
        },
    }, expanded);
}

const createCircularTrackStyles = (theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles => {
    return deepMerge({
        stroke: theme.colors.border.secondary,
    }, expanded);
}

const createCircularBarStyles = (theme: Theme, expanded: Partial<ExpandedProgressStyles>) => {
    return ({ intent }: { intent: ProgressIntent }) => {
        return deepMerge({
            stroke: getCircularBarColor(theme, intent),
        }, expanded);
    }
}

const createLabelStyles = (theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles => {
    return deepMerge({
        color: theme.colors.text.primary,
        textAlign: 'center',
        variants: {
            size: createLabelSizeVariants(theme),
        },
    }, expanded);
}

const createCircularLabelStyles = (theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles => {
    return deepMerge({
        position: 'absolute',
        fontWeight: '600',
        color: theme.colors.text.primary,
        variants: {
            size: createCircularLabelSizeVariants(theme),
        },
    }, expanded);
}

export const createProgressStylesheet = (theme: Theme, expanded?: Partial<ProgressStylesheet>): ProgressStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        linearTrack: createLinearTrackStyles(theme, expanded?.linearTrack || {}),
        linearBar: createLinearBarStyles(theme, expanded?.linearBar || {}),
        indeterminateBar: createIndeterminateBarStyles(theme, expanded?.indeterminateBar || {}),
        circularContainer: createCircularContainerStyles(theme, expanded?.circularContainer || {}),
        circularTrack: createCircularTrackStyles(theme, expanded?.circularTrack || {}),
        circularBar: createCircularBarStyles(theme, expanded?.circularBar || {}),
        label: createLabelStyles(theme, expanded?.label || {}),
        circularLabel: createCircularLabelStyles(theme, expanded?.circularLabel || {}),
    };
}
