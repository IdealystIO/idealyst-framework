import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";

type SliderSize = 'sm' | 'md' | 'lg';
type SliderIntent = Intent;

type SliderTrackVariants = {
    size: SliderSize;
    disabled: boolean;
}

type SliderFilledTrackVariants = {
    intent: SliderIntent;
}

type SliderThumbVariants = {
    size: SliderSize;
    intent: SliderIntent;
    disabled: boolean;
}

type SliderThumbIconVariants = {
    size: SliderSize;
    intent: SliderIntent;
}

type SliderMarkVariants = {
    size: SliderSize;
}

export type ExpandedSliderTrackStyles = StylesheetStyles<keyof SliderTrackVariants>;
export type ExpandedSliderFilledTrackStyles = StylesheetStyles<keyof SliderFilledTrackVariants>;
export type ExpandedSliderThumbStyles = StylesheetStyles<keyof SliderThumbVariants>;
export type ExpandedSliderThumbIconStyles = StylesheetStyles<keyof SliderThumbIconVariants>;
export type ExpandedSliderMarkStyles = StylesheetStyles<keyof SliderMarkVariants>;
export type ExpandedSliderStyles = StylesheetStyles<never>;

export type SliderStylesheet = {
    container: ExpandedSliderStyles;
    sliderWrapper: ExpandedSliderStyles;
    track: ExpandedSliderTrackStyles;
    filledTrack: ExpandedSliderFilledTrackStyles;
    thumb: ExpandedSliderThumbStyles;
    thumbActive: ExpandedSliderStyles;
    thumbIcon: ExpandedSliderThumbIconStyles;
    valueLabel: ExpandedSliderStyles;
    minMaxLabels: ExpandedSliderStyles;
    minMaxLabel: ExpandedSliderStyles;
    marks: ExpandedSliderStyles;
    mark: ExpandedSliderMarkStyles;
    markLabel: ExpandedSliderStyles;
}

/**
 * Create size variants for track
 */
function createTrackSizeVariants() {
    return {
        sm: { height: 4 },
        md: { height: 6 },
        lg: { height: 8 },
    };
}

/**
 * Create intent variants for filled track
 */
function createFilledTrackIntentVariants(theme: Theme) {
    const variants: Record<SliderIntent, any> = {} as any;
    for (const intent in theme.intents) {
        variants[intent as SliderIntent] = {
            backgroundColor: theme.intents[intent as SliderIntent].primary,
        };
    }
    return variants;
}

/**
 * Create size variants for thumb
 */
function createThumbSizeVariants() {
    return {
        sm: { width: 16, height: 16 },
        md: { width: 20, height: 20 },
        lg: { width: 24, height: 24 },
    };
}

/**
 * Create intent variants for thumb
 */
function createThumbIntentVariants(theme: Theme) {
    const variants: Record<SliderIntent, any> = {} as any;
    for (const intent in theme.intents) {
        variants[intent as SliderIntent] = {
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: theme.intents[intent as SliderIntent].primary,
        };
    }
    return variants;
}

/**
 * Create size variants for thumb icon
 */
function createThumbIconSizeVariants() {
    return {
        sm: {
            width: 10,
            height: 10,
            minWidth: 10,
            maxWidth: 10,
            minHeight: 10,
            maxHeight: 10,
        },
        md: {
            width: 12,
            height: 12,
            minWidth: 12,
            maxWidth: 12,
            minHeight: 12,
            maxHeight: 12,
        },
        lg: {
            width: 16,
            height: 16,
            minWidth: 16,
            maxWidth: 16,
            minHeight: 16,
            maxHeight: 16,
        },
    };
}

/**
 * Create intent variants for thumb icon
 */
function createThumbIconIntentVariants(theme: Theme) {
    const variants: Record<SliderIntent, any> = {} as any;
    for (const intent in theme.intents) {
        variants[intent as SliderIntent] = {
            color: theme.intents[intent as SliderIntent].primary,
        };
    }
    return variants;
}

/**
 * Create size variants for mark
 */
function createMarkSizeVariants() {
    return {
        sm: { height: 8 },
        md: { height: 10 },
        lg: { height: 12 },
    };
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedSliderStyles>): ExpandedSliderStyles => {
    return deepMerge({
        gap: theme.spacing?.xs || 4,
        paddingVertical: theme.spacing?.sm || 8,
    }, expanded);
}

const createSliderWrapperStyles = (theme: Theme, expanded: Partial<ExpandedSliderStyles>): ExpandedSliderStyles => {
    return deepMerge({
        position: 'relative',
        paddingVertical: theme.spacing?.xs || 4,
    }, expanded);
}

const createTrackStyles = (theme: Theme, expanded: Partial<ExpandedSliderTrackStyles>): ExpandedSliderTrackStyles => {
    return deepMerge({
        backgroundColor: theme.colors?.border?.secondary || '#d0d0d0',
        borderRadius: theme.borderRadius?.full || 9999,
        position: 'relative',
        variants: {
            size: createTrackSizeVariants(),
            disabled: {
                true: {
                    opacity: 0.5,
                    _web: {
                        cursor: 'not-allowed',
                    },
                },
                false: {
                    opacity: 1,
                },
            },
        },
        _web: {
            cursor: 'pointer',
        },
    }, expanded);
}

const createFilledTrackStyles = (theme: Theme, expanded: Partial<ExpandedSliderFilledTrackStyles>): ExpandedSliderFilledTrackStyles => {
    return deepMerge({
        position: 'absolute',
        height: '100%',
        borderRadius: theme.borderRadius?.full || 9999,
        top: 0,
        left: 0,
        variants: {
            intent: createFilledTrackIntentVariants(theme),
        },
    }, expanded);
}

const createThumbStyles = (theme: Theme, expanded: Partial<ExpandedSliderThumbStyles>): ExpandedSliderThumbStyles => {
    return deepMerge({
        position: 'absolute',
        backgroundColor: theme.colors?.surface?.primary || '#ffffff',
        borderRadius: theme.borderRadius?.full || 9999,
        top: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
        variants: {
            size: createThumbSizeVariants(),
            intent: createThumbIntentVariants(theme),
            disabled: {
                true: {
                    _web: {
                        cursor: 'not-allowed',
                    },
                },
                false: {
                    _web: {
                        cursor: 'pointer',
                    },
                },
            },
        },
        _web: {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            transform: 'translate(-50%, -50%)',
            transition: 'transform 0.15s ease, box-shadow 0.2s ease',
        },
    }, expanded);
}

const createThumbActiveStyles = (theme: Theme, expanded: Partial<ExpandedSliderStyles>): ExpandedSliderStyles => {
    return deepMerge({
        _web: {
            transform: 'translate(-50%, -50%) scale(1.1)',
        },
    }, expanded);
}

const createThumbIconStyles = (theme: Theme, expanded: Partial<ExpandedSliderThumbIconStyles>): ExpandedSliderThumbIconStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        variants: {
            size: createThumbIconSizeVariants(),
            intent: createThumbIconIntentVariants(theme),
        },
    }, expanded);
}

const createValueLabelStyles = (theme: Theme, expanded: Partial<ExpandedSliderStyles>): ExpandedSliderStyles => {
    return deepMerge({
        fontSize: 12,
        fontWeight: theme.typography?.fontWeight?.semibold || '600',
        color: theme.colors?.text?.primary || '#000000',
        textAlign: 'center',
    }, expanded);
}

const createMinMaxLabelsStyles = (theme: Theme, expanded: Partial<ExpandedSliderStyles>): ExpandedSliderStyles => {
    return deepMerge({
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: theme.spacing?.xs || 4,
    }, expanded);
}

const createMinMaxLabelStyles = (theme: Theme, expanded: Partial<ExpandedSliderStyles>): ExpandedSliderStyles => {
    return deepMerge({
        fontSize: 12,
        color: theme.colors?.text?.secondary || '#666666',
    }, expanded);
}

const createMarksStyles = (theme: Theme, expanded: Partial<ExpandedSliderStyles>): ExpandedSliderStyles => {
    return deepMerge({
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
    }, expanded);
}

const createMarkStyles = (theme: Theme, expanded: Partial<ExpandedSliderMarkStyles>): ExpandedSliderMarkStyles => {
    return deepMerge({
        position: 'absolute',
        width: 2,
        backgroundColor: theme.colors?.border?.secondary || '#d0d0d0',
        top: '50%',
        variants: {
            size: createMarkSizeVariants(),
        },
        _web: {
            transform: 'translate(-50%, -50%)',
        },
    }, expanded);
}

const createMarkLabelStyles = (theme: Theme, expanded: Partial<ExpandedSliderStyles>): ExpandedSliderStyles => {
    return deepMerge({
        position: 'absolute',
        fontSize: 10,
        color: theme.colors?.text?.secondary || '#666666',
        top: '100%',
        marginTop: 4,
        _web: {
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
        },
    }, expanded);
}

export const createSliderStylesheet = (theme: Theme, expanded?: Partial<SliderStylesheet>): SliderStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        sliderWrapper: createSliderWrapperStyles(theme, expanded?.sliderWrapper || {}),
        track: createTrackStyles(theme, expanded?.track || {}),
        filledTrack: createFilledTrackStyles(theme, expanded?.filledTrack || {}),
        thumb: createThumbStyles(theme, expanded?.thumb || {}),
        thumbActive: createThumbActiveStyles(theme, expanded?.thumbActive || {}),
        thumbIcon: createThumbIconStyles(theme, expanded?.thumbIcon || {}),
        valueLabel: createValueLabelStyles(theme, expanded?.valueLabel || {}),
        minMaxLabels: createMinMaxLabelsStyles(theme, expanded?.minMaxLabels || {}),
        minMaxLabel: createMinMaxLabelStyles(theme, expanded?.minMaxLabel || {}),
        marks: createMarksStyles(theme, expanded?.marks || {}),
        mark: createMarkStyles(theme, expanded?.mark || {}),
        markLabel: createMarkLabelStyles(theme, expanded?.markLabel || {}),
    };
}
