import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";

type ProgressSize = 'sm' | 'md' | 'lg';
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
function createLinearTrackSizeVariants() {
    return {
        sm: { height: 4 },
        md: { height: 8 },
        lg: { height: 12 },
    };
}

/**
 * Create intent variants for linear bar
 */
function createLinearBarIntentVariants(theme: Theme) {
    const variants: Record<ProgressIntent, any> = {} as any;
    for (const intent in theme.intents) {
        variants[intent as ProgressIntent] = {
            backgroundColor: theme.intents[intent as keyof typeof theme.intents].primary,
        };
    }
    return variants;
}

/**
 * Create size variants for circular container
 */
function createCircularContainerSizeVariants() {
    return {
        sm: { width: 32, height: 32 },
        md: { width: 48, height: 48 },
        lg: { width: 64, height: 64 },
    };
}

/**
 * Create intent variants for circular bar
 */
function createCircularBarIntentVariants(theme: Theme) {
    const variants: Record<ProgressIntent, any> = {} as any;
    for (const intent in theme.intents) {
        variants[intent as ProgressIntent] = {
            stroke: theme.intents[intent as keyof typeof theme.intents].primary,
        };
    }
    return variants;
}

/**
 * Create size variants for label
 */
function createLabelSizeVariants() {
    return {
        sm: { fontSize: 12 },
        md: { fontSize: 14 },
        lg: { fontSize: 16 },
    };
}

/**
 * Create size variants for circular label
 */
function createCircularLabelSizeVariants() {
    return {
        sm: { fontSize: 10 },
        md: { fontSize: 12 },
        lg: { fontSize: 14 },
    };
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles => {
    return deepMerge({
        gap: theme.spacing?.xs || 4,
    }, expanded);
}

const createLinearTrackStyles = (theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles => {
    return deepMerge({
        backgroundColor: theme.colors?.border?.secondary || '#e0e0e0',
        overflow: 'hidden',
        position: 'relative',
        variants: {
            size: createLinearTrackSizeVariants(),
            rounded: {
                true: {
                    borderRadius: theme.borderRadius?.full || 9999,
                },
                false: {
                    borderRadius: 0,
                },
            },
        },
    }, expanded);
}

const createLinearBarStyles = (theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles => {
    return deepMerge({
        height: '100%',
        variants: {
            intent: createLinearBarIntentVariants(theme),
            rounded: {
                true: {
                    borderRadius: theme.borderRadius?.full || 9999,
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

const createIndeterminateBarStyles = (theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles => {
    return deepMerge({
        position: 'absolute',
        height: '100%',
        width: '40%',
        variants: {
            intent: createLinearBarIntentVariants(theme),
            rounded: {
                true: {
                    borderRadius: theme.borderRadius?.full || 9999,
                },
                false: {
                    borderRadius: 0,
                },
            },
        },
    }, expanded);
}

const createCircularContainerStyles = (theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles => {
    return deepMerge({
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        variants: {
            size: createCircularContainerSizeVariants(),
        },
    }, expanded);
}

const createCircularTrackStyles = (theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles => {
    return deepMerge({
        stroke: theme.colors?.border?.secondary || '#e0e0e0',
    }, expanded);
}

const createCircularBarStyles = (theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles => {
    return deepMerge({
        variants: {
            intent: createCircularBarIntentVariants(theme),
        },
    }, expanded);
}

const createLabelStyles = (theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles => {
    return deepMerge({
        color: theme.colors?.text?.primary || '#000000',
        textAlign: 'center',
        variants: {
            size: createLabelSizeVariants(),
        },
    }, expanded);
}

const createCircularLabelStyles = (theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles => {
    return deepMerge({
        position: 'absolute',
        fontWeight: '600',
        color: theme.colors?.text?.primary || '#000000',
        variants: {
            size: createCircularLabelSizeVariants(),
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
