import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";

type TooltipSize = 'sm' | 'md' | 'lg';
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
function createTooltipSizeVariants() {
    return {
        sm: {
            fontSize: 12,
            padding: 6,
        },
        md: {
            fontSize: 14,
            padding: 8,
        },
        lg: {
            fontSize: 16,
            padding: 10,
        },
    };
}

/**
 * Create intent variants for tooltip
 */
function createTooltipIntentVariants(theme: Theme) {
    const variants: Record<TooltipIntent, any> = {} as any;
    for (const intent in theme.intents) {
        const intentKey = intent as TooltipIntent;
        variants[intentKey] = {
            backgroundColor: theme.intents[intentKey].primary,
            color: theme.intents[intentKey].contrast,
        };
    }
    return variants;
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
 * Create compound variants for arrow (placement + intent combinations for border colors)
 */
function createArrowCompoundVariants(theme: Theme): CompoundVariants<keyof TooltipArrowVariants> {
    const variants: CompoundVariants<keyof TooltipArrowVariants> = [];

    // Top placement - set borderTopColor for each intent
    for (const intent in theme.intents) {
        variants.push({
            placement: 'top',
            intent: intent as TooltipIntent,
            styles: {
                borderTopColor: theme.intents[intent as TooltipIntent].primary,
            },
        });
    }

    // Bottom placement - set borderBottomColor for each intent
    for (const intent in theme.intents) {
        variants.push({
            placement: 'bottom',
            intent: intent as TooltipIntent,
            styles: {
                borderBottomColor: theme.intents[intent as TooltipIntent].primary,
            },
        });
    }

    // Left placement - set borderLeftColor for each intent
    for (const intent in theme.intents) {
        variants.push({
            placement: 'left',
            intent: intent as TooltipIntent,
            styles: {
                borderLeftColor: theme.intents[intent as TooltipIntent].primary,
            },
        });
    }

    // Right placement - set borderRightColor for each intent
    for (const intent in theme.intents) {
        variants.push({
            placement: 'right',
            intent: intent as TooltipIntent,
            styles: {
                borderRightColor: theme.intents[intent as TooltipIntent].primary,
            },
        });
    }

    return variants;
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedTooltipStyles>): ExpandedTooltipStyles => {
    return deepMerge({
        position: 'relative',
        _web: {
            display: 'inline-flex',
        },
    }, expanded);
}

const createTooltipStyles = (theme: Theme, expanded: Partial<ExpandedTooltipTooltipStyles>): ExpandedTooltipTooltipStyles => {
    return deepMerge({
        borderRadius: 8,
        maxWidth: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        variants: {
            size: createTooltipSizeVariants(),
            intent: createTooltipIntentVariants(theme),
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

const createArrowStyles = (theme: Theme, expanded: Partial<ExpandedTooltipArrowStyles>): ExpandedTooltipArrowStyles => {
    return deepMerge({
        position: 'absolute',
        width: 0,
        height: 0,
        borderStyle: 'solid',
        variants: {
            placement: createArrowPlacementVariants(),
            intent: {
                primary: {},
                neutral: {},
                success: {},
                error: {},
                warning: {},
            },
        },
        compoundVariants: createArrowCompoundVariants(theme),
    }, expanded);
}

export const createTooltipStylesheet = (theme: Theme, expanded?: Partial<TooltipStylesheet>): TooltipStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        tooltip: createTooltipStyles(theme, expanded?.tooltip || {}),
        arrow: createArrowStyles(theme, expanded?.arrow || {}),
    };
}
