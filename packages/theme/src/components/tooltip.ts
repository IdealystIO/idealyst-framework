import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme, Size } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";
import { buildSizeVariants } from "../variants/size";

type TooltipSize = Size;
type TooltipIntent = Intent;
type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

type TooltipTooltipVariants = {
    size: TooltipSize;
    intent: TooltipIntent;
    visible: boolean;
    placement: TooltipPlacement;
}

type TooltipArrowVariants = {
    placement: TooltipPlacement;
    intent: TooltipIntent;
}

export type ExpandedTooltipTooltipStyles = StylesheetStyles<keyof TooltipTooltipVariants>;
export type ExpandedTooltipArrowStyles = StylesheetStyles<keyof TooltipArrowVariants>;
export type ExpandedTooltipStyles = StylesheetStyles<never>;

export type TooltipStylesheet = {
    container: ExpandedTooltipStyles;
    tooltip: ExpandedTooltipTooltipStyles;
    arrow: ExpandedTooltipArrowStyles;
}

/**
 * Create size variants for tooltip
 */
function createTooltipSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'tooltip', (size) => ({
        fontSize: size.fontSize,
        padding: size.padding,
    }));
}

/**
 * Get background and text colors for a tooltip intent
 */
function getTooltipColors(theme: Theme, intent: TooltipIntent) {
    const intentValue = theme.intents[intent];
    return {
        backgroundColor: intentValue.primary,
        color: intentValue.contrast,
    };
}

/**
 * Create placement variants for arrow
 */
function createArrowPlacementVariants() {
    return {
        top: {
            bottom: -4,
            left: '50%',
            borderWidth: '4px 4px 0 4px',
            borderColor: 'transparent',
            _web: {
                transform: 'translateX(-50%)',
            },
        },
        bottom: {
            top: -4,
            left: '50%',
            borderWidth: '0 4px 4px 4px',
            borderColor: 'transparent',
            _web: {
                transform: 'translateX(-50%)',
            },
        },
        left: {
            right: -4,
            top: '50%',
            borderWidth: '4px 0 4px 4px',
            borderColor: 'transparent',
            _web: {
                transform: 'translateY(-50%)',
            },
        },
        right: {
            left: -4,
            top: '50%',
            borderWidth: '4px 4px 4px 0',
            borderColor: 'transparent',
            _web: {
                transform: 'translateY(-50%)',
            },
        },
    };
}

/**
 * Get arrow border color based on placement and intent
 */
function getArrowBorderColor(theme: Theme, placement: TooltipPlacement, intent: TooltipIntent) {
    const color = theme.intents[intent].primary;

    switch (placement) {
        case 'top':
            return { borderTopColor: color };
        case 'bottom':
            return { borderBottomColor: color };
        case 'left':
            return { borderLeftColor: color };
        case 'right':
            return { borderRightColor: color };
        default:
            return {};
    }
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedTooltipStyles>): ExpandedTooltipStyles => {
    return deepMerge({
        position: 'relative',
        _web: {
            display: 'inline-flex',
        },
    }, expanded);
}

const createTooltipStyles = (theme: Theme, expanded: Partial<ExpandedTooltipTooltipStyles>) => {
    return ({ intent }: TooltipTooltipVariants) => {
        const colors = getTooltipColors(theme, intent);
        return deepMerge({
            borderRadius: 8,
            maxWidth: 300,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
            ...colors,
            variants: {
                size: createTooltipSizeVariants(theme),
                visible: {
                    true: {
                        opacity: 1,
                    },
                    false: {
                        opacity: 0,
                    },
                },
                placement: {
                    top: {},
                    bottom: {},
                    left: {},
                    right: {},
                },
            },
            _web: {
                position: 'absolute',
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                pointerEvents: 'none',
                opacity: 0,
                transition: 'opacity 0.2s ease',
                whiteSpace: 'nowrap',
                variants: {
                    placement: {
                        top: {
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            marginBottom: 8,
                        },
                        bottom: {
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            marginTop: 8,
                        },
                        left: {
                            right: '100%',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            marginRight: 8,
                        },
                        right: {
                            left: '100%',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            marginLeft: 8,
                        },
                    },
                },
            },
        }, expanded);
    }
}

const createArrowStyles = (theme: Theme, expanded: Partial<ExpandedTooltipArrowStyles>) => {
    return ({ placement, intent }: TooltipArrowVariants) => {
        const borderColor = getArrowBorderColor(theme, placement, intent);
        return deepMerge({
            position: 'absolute',
            width: 0,
            height: 0,
            borderStyle: 'solid',
            ...borderColor,
            variants: {
                placement: createArrowPlacementVariants(),
            },
        }, expanded);
    }
}

export const createTooltipStylesheet = (theme: Theme, expanded?: Partial<TooltipStylesheet>): TooltipStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        tooltip: createTooltipStyles(theme, expanded?.tooltip || {}),
        arrow: createArrowStyles(theme, expanded?.arrow || {}),
    };
}
