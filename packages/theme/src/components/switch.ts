import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { Size } from "../theme/size";
import { deepMerge } from "../util/deepMerge";
import { buildSizeVariants } from "../variants/size";

type SwitchSize = Size;
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
function createTrackSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'switch', (size) => ({
        width: size.trackWidth,
        height: size.trackHeight,
    }));
}

/**
 * Get track background color based on checked state and intent
 */
function getTrackBackgroundColor(theme: Theme, checked: boolean, intent: SwitchIntent) {
    if (checked) {
        return theme.intents[intent].primary;
    }
    return theme.colors.border.secondary;
}

/**
 * Create size variants for thumb
 */
function createThumbSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'switch', (size) => ({
        width: size.thumbSize,
        height: size.thumbSize,
        left: 2,
    }));
}

/**
 * Get thumb transform based on size and checked state
 */
function getThumbTransform(theme: Theme, size: SwitchSize, checked: boolean) {
    const sizeValue = theme.sizes.switch[size];
    const translateX = checked ? sizeValue.translateX : 0;
    return `translateY(-50%) translateX(${translateX}px)`;
}

/**
 * Create size variants for thumb icon
 */
function createThumbIconSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'switch', (size) => ({
        width: size.thumbIconSize,
        height: size.thumbIconSize,
    }));
}

/**
 * Get thumb icon color based on checked state and intent
 */
function getThumbIconColor(theme: Theme, checked: boolean, intent: SwitchIntent) {
    if (checked) {
        return theme.intents[intent].primary;
    }
    return theme.colors.border.secondary;
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedSwitchStyles>): ExpandedSwitchStyles => {
    return deepMerge({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    }, expanded);
}

const createSwitchContainerStyles = (theme: Theme, expanded: Partial<ExpandedSwitchStyles>): ExpandedSwitchStyles => {
    return deepMerge({
        justifyContent: 'center',
    }, expanded);
}

const createSwitchTrackStyles = (theme: Theme, expanded: Partial<ExpandedSwitchTrackStyles>) => {
    return ({ checked, intent, disabled }: { checked: boolean, intent: SwitchIntent, disabled: boolean }) => {
        return deepMerge({
            borderRadius: 9999,
            position: 'relative',
            backgroundColor: getTrackBackgroundColor(theme, checked, intent),
            variants: {
                size: createTrackSizeVariants(theme),
                disabled: {
                    true: {
                        opacity: 0.5,
                        _web: {
                            cursor: 'not-allowed',
                        },
                    },
                    false: {
                        opacity: 1,
                        _web: {
                            cursor: 'pointer',
                            _hover: {
                                opacity: 0.9,
                            },
                            _active: {
                                opacity: 0.8,
                            },
                        },
                    },
                },
            },
            _web: {
                transition: 'background-color 0.2s ease',
            },
        }, expanded);
    }
}

const createSwitchThumbStyles = (theme: Theme, expanded: Partial<ExpandedSwitchThumbStyles>) => {
    return ({ size, checked }: { size: SwitchSize, checked: boolean }) => {
        return deepMerge({
            position: 'absolute',
            backgroundColor: theme.colors.surface.primary,
            borderRadius: 9999,
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
                size: createThumbSizeVariants(theme),
            },
            _web: {
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s ease',
                transform: getThumbTransform(theme, size, checked),
            },
        }, expanded);
    }
}

const createThumbIconStyles = (theme: Theme, expanded: Partial<ExpandedThumbIconStyles>) => {
    return ({ checked, intent }: { checked: boolean, intent: SwitchIntent }) => {
        return deepMerge({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: getThumbIconColor(theme, checked, intent),
            variants: {
                size: createThumbIconSizeVariants(theme),
            },
        }, expanded);
    }
}

const createLabelStyles = (theme: Theme, expanded: Partial<ExpandedLabelStyles>): ExpandedLabelStyles => {
    return deepMerge({
        fontSize: 14,
        color: theme.colors.text.primary,
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
                    marginRight: 8,
                },
                right: {
                    marginLeft: 8,
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
