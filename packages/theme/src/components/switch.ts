import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";

type SwitchSize = 'sm' | 'md' | 'lg';
type SwitchIntent = Intent;
type LabelPosition = 'left' | 'right';

type SwitchTrackVariants = {
    size: SwitchSize;
    checked: boolean;
    intent: SwitchIntent;
    disabled: boolean;
}

type SwitchThumbVariants = {
    size: SwitchSize;
    checked: boolean;
}

type ThumbIconVariants = {
    size: SwitchSize;
    checked: boolean;
    intent: SwitchIntent;
}

type LabelVariants = {
    disabled: boolean;
    position: LabelPosition;
}

export type ExpandedSwitchTrackStyles = StylesheetStyles<keyof SwitchTrackVariants>;
export type ExpandedSwitchThumbStyles = StylesheetStyles<keyof SwitchThumbVariants>;
export type ExpandedThumbIconStyles = StylesheetStyles<keyof ThumbIconVariants>;
export type ExpandedLabelStyles = StylesheetStyles<keyof LabelVariants>;
export type ExpandedSwitchStyles = StylesheetStyles<never>;

export type SwitchStylesheet = {
    container: ExpandedSwitchStyles;
    switchContainer: ExpandedSwitchStyles;
    switchTrack: ExpandedSwitchTrackStyles;
    switchThumb: ExpandedSwitchThumbStyles;
    thumbIcon: ExpandedThumbIconStyles;
    label: ExpandedLabelStyles;
}

/**
 * Create size variants for track
 */
function createTrackSizeVariants() {
    return {
        sm: { width: 36, height: 20 },
        md: { width: 44, height: 24 },
        lg: { width: 52, height: 28 },
    };
}

/**
 * Create compound variants for track
 */
function createTrackCompoundVariants(theme: Theme): CompoundVariants<keyof SwitchTrackVariants> {
    const variants: CompoundVariants<keyof SwitchTrackVariants> = [];

    // Checked + Intent combinations
    for (const intent in theme.intents) {
        variants.push({
            checked: true,
            intent: intent as SwitchIntent,
            styles: {
                backgroundColor: theme.intents[intent as SwitchIntent].primary,
            },
        });
    }

    return variants;
}

/**
 * Create size variants for thumb
 */
function createThumbSizeVariants() {
    return {
        sm: { width: 16, height: 16, left: 2 },
        md: { width: 20, height: 20, left: 2 },
        lg: { width: 24, height: 24, left: 2 },
    };
}

/**
 * Create compound variants for thumb
 */
function createThumbCompoundVariants(): CompoundVariants<keyof SwitchThumbVariants> {
    return [
        // Small size
        {
            size: 'sm',
            checked: true,
            styles: {
                _web: {
                    transform: 'translateY(-50%) translateX(16px)',
                },
            },
        },
        {
            size: 'sm',
            checked: false,
            styles: {
                _web: {
                    transform: 'translateY(-50%) translateX(0)',
                },
            },
        },
        // Medium size
        {
            size: 'md',
            checked: true,
            styles: {
                _web: {
                    transform: 'translateY(-50%) translateX(20px)',
                },
            },
        },
        {
            size: 'md',
            checked: false,
            styles: {
                _web: {
                    transform: 'translateY(-50%) translateX(0)',
                },
            },
        },
        // Large size
        {
            size: 'lg',
            checked: true,
            styles: {
                _web: {
                    transform: 'translateY(-50%) translateX(24px)',
                },
            },
        },
        {
            size: 'lg',
            checked: false,
            styles: {
                _web: {
                    transform: 'translateY(-50%) translateX(0)',
                },
            },
        },
    ];
}

/**
 * Create size variants for thumb icon
 */
function createThumbIconSizeVariants() {
    return {
        sm: { width: 10, height: 10 },
        md: { width: 12, height: 12 },
        lg: { width: 14, height: 14 },
    };
}

/**
 * Create compound variants for thumb icon
 */
function createThumbIconCompoundVariants(theme: Theme): CompoundVariants<keyof ThumbIconVariants> {
    const variants: CompoundVariants<keyof ThumbIconVariants> = [];

    // Checked + Intent combinations
    for (const intent in theme.intents) {
        variants.push({
            checked: true,
            intent: intent as SwitchIntent,
            styles: {
                color: theme.intents[intent as SwitchIntent].primary,
            },
        });
    }

    // Unchecked state
    variants.push({
        checked: false,
        styles: {
            color: theme.colors?.border?.secondary || '#d0d0d0',
        },
    });

    return variants;
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedSwitchStyles>): ExpandedSwitchStyles => {
    return deepMerge({
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing?.sm || 8,
    }, expanded);
}

const createSwitchContainerStyles = (theme: Theme, expanded: Partial<ExpandedSwitchStyles>): ExpandedSwitchStyles => {
    return deepMerge({
        justifyContent: 'center',
    }, expanded);
}

const createSwitchTrackStyles = (theme: Theme, expanded: Partial<ExpandedSwitchTrackStyles>): ExpandedSwitchTrackStyles => {
    return deepMerge({
        borderRadius: theme.borderRadius?.full || 9999,
        position: 'relative',
        variants: {
            size: createTrackSizeVariants(),
            checked: {
                true: {},
                false: {
                    backgroundColor: theme.colors?.border?.secondary || '#d0d0d0',
                },
            },
            intent: {
                primary: {},
                success: {},
                error: {},
                warning: {},
                neutral: {},
            },
            disabled: {
                true: {
                    opacity: 0.5,
                },
                false: {
                    opacity: 1,
                },
            },
        },
        compoundVariants: createTrackCompoundVariants(theme),
        _web: {
            transition: 'background-color 0.2s ease',
        },
    }, expanded);
}

const createSwitchThumbStyles = (theme: Theme, expanded: Partial<ExpandedSwitchThumbStyles>): ExpandedSwitchThumbStyles => {
    return deepMerge({
        position: 'absolute',
        backgroundColor: theme.colors?.surface?.primary || '#ffffff',
        borderRadius: theme.borderRadius?.full || 9999,
        top: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
        variants: {
            size: createThumbSizeVariants(),
            checked: {
                true: {},
                false: {},
            },
        },
        compoundVariants: createThumbCompoundVariants(),
        _web: {
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s ease',
            transform: 'translateY(-50%)',
        },
    }, expanded);
}

const createThumbIconStyles = (theme: Theme, expanded: Partial<ExpandedThumbIconStyles>): ExpandedThumbIconStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        variants: {
            size: createThumbIconSizeVariants(),
            checked: {
                true: {},
                false: {},
            },
            intent: {
                primary: {},
                success: {},
                error: {},
                warning: {},
                neutral: {},
            },
        },
        compoundVariants: createThumbIconCompoundVariants(theme),
    }, expanded);
}

const createLabelStyles = (theme: Theme, expanded: Partial<ExpandedLabelStyles>): ExpandedLabelStyles => {
    return deepMerge({
        fontSize: 14,
        color: theme.colors?.text?.primary || '#000000',
        variants: {
            disabled: {
                true: {
                    opacity: 0.5,
                },
                false: {
                    opacity: 1,
                },
            },
            position: {
                left: {
                    marginRight: theme.spacing?.sm || 8,
                },
                right: {
                    marginLeft: theme.spacing?.sm || 8,
                },
            },
        },
    }, expanded);
}

export const createSwitchStylesheet = (theme: Theme, expanded?: Partial<SwitchStylesheet>): SwitchStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        switchContainer: createSwitchContainerStyles(theme, expanded?.switchContainer || {}),
        switchTrack: createSwitchTrackStyles(theme, expanded?.switchTrack || {}),
        switchThumb: createSwitchThumbStyles(theme, expanded?.switchThumb || {}),
        thumbIcon: createThumbIconStyles(theme, expanded?.thumbIcon || {}),
        label: createLabelStyles(theme, expanded?.label || {}),
    };
}
