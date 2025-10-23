import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";

type AccordionSize = 'sm' | 'md' | 'lg';
type AccordionType = 'default' | 'separated' | 'bordered';
type AccordionIntent = Intent;

type AccordionVariants = {
    size: AccordionSize;
    type: AccordionType;
    intent: AccordionIntent;
    expanded: boolean;
    disabled: boolean;
    isLast: boolean;
}

export type ExpandedAccordionStyles = StylesheetStyles<keyof AccordionVariants>;

export type AccordionStylesheet = {
    container: ExpandedAccordionStyles;
    item: ExpandedAccordionStyles;
    header: ExpandedAccordionStyles;
    title: ExpandedAccordionStyles;
    icon: ExpandedAccordionStyles;
    content: ExpandedAccordionStyles;
    contentInner: ExpandedAccordionStyles;
}

/**
 * Create type variants for container
 */
function createContainerTypeVariants(theme: Theme) {
    return {
        default: {
            gap: 0,
        },
        separated: {
            gap: theme.spacing?.sm || 8,
        },
        bordered: {
            gap: 0,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors?.border?.primary || '#e0e0e0',
            borderRadius: theme.borderRadius?.md || 8,
            overflow: 'hidden',
        },
    };
}

/**
 * Create type variants for items
 */
function createItemTypeVariants(theme: Theme) {
    return {
        default: {
            borderBottomWidth: 1,
            borderBottomStyle: 'solid',
            borderBottomColor: theme.colors?.border?.primary || '#e0e0e0',
        },
        separated: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors?.border?.primary || '#e0e0e0',
            borderRadius: theme.borderRadius?.md || 8,
            overflow: 'hidden',
        },
        bordered: {
            borderBottomWidth: 1,
            borderBottomStyle: 'solid',
            borderBottomColor: theme.colors?.border?.primary || '#e0e0e0',
        },
    };
}

/**
 * Create compound variants for item (type + isLast)
 */
function createItemCompoundVariants(): CompoundVariants<keyof AccordionVariants> {
    return [
        {
            type: 'default',
            isLast: true,
            styles: {
                borderBottomWidth: 0,
            },
        },
        {
            type: 'bordered',
            isLast: true,
            styles: {
                borderBottomWidth: 0,
            },
        },
    ];
}

/**
 * Create size variants for header
 */
function createHeaderSizeVariants() {
    return {
        sm: {
            fontSize: 14,
            padding: 10,
        },
        md: {
            fontSize: 16,
            padding: 14,
        },
        lg: {
            fontSize: 18,
            padding: 18,
        },
    };
}

/**
 * Create intent variants for icon
 */
function createIconIntentVariants(theme: Theme) {
    const variants: Record<AccordionIntent, any> = {} as any;

    for (const intent in theme.intents) {
        variants[intent as AccordionIntent] = {
            color: theme.intents[intent as keyof typeof theme.intents].primary,
        };
    }

    return variants;
}

/**
 * Create size variants for content inner
 */
function createContentInnerSizeVariants() {
    return {
        sm: {
            fontSize: 14,
            padding: 10,
            paddingTop: 0,
        },
        md: {
            fontSize: 16,
            padding: 14,
            paddingTop: 0,
        },
        lg: {
            fontSize: 18,
            padding: 18,
            paddingTop: 0,
        },
    };
}

/**
 * Generate accordion container styles
 */
const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedAccordionStyles>): ExpandedAccordionStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'column',
        variants: {
            type: createContainerTypeVariants(theme),
        },
    }, expanded);
}

/**
 * Generate accordion item styles
 */
const createItemStyles = (theme: Theme, expanded: Partial<ExpandedAccordionStyles>): ExpandedAccordionStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'column',
        variants: {
            type: createItemTypeVariants(theme),
            isLast: {
                true: {},
                false: {},
            },
        },
        compoundVariants: createItemCompoundVariants(),
    }, expanded);
}

/**
 * Generate accordion header styles
 */
const createHeaderStyles = (theme: Theme, expanded: Partial<ExpandedAccordionStyles>): ExpandedAccordionStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: 'transparent',
        fontFamily: theme.typography?.fontFamily?.sans,
        color: theme.colors?.text?.primary || '#000000',
        textAlign: 'left',
        variants: {
            size: createHeaderSizeVariants(),
            expanded: {
                true: {
                    fontWeight: theme.typography?.fontWeight?.semibold || '600',
                },
                false: {
                    fontWeight: theme.typography?.fontWeight?.medium || '500',
                },
            },
            disabled: {
                true: {
                    opacity: 0.5,
                    _web: {
                        cursor: 'not-allowed',
                    },
                },
                false: {
                    _web: {
                        ':hover': {
                            backgroundColor: theme.colors?.surface?.secondary || '#f5f5f5',
                        },
                    },
                },
            },
        },
        _web: {
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background-color 0.2s ease',
        },
    }, expanded);
}

/**
 * Generate accordion title styles
 */
const createTitleStyles = (theme: Theme, expanded: Partial<ExpandedAccordionStyles>): ExpandedAccordionStyles => {
    return deepMerge({
        flex: 1,
    }, expanded);
}

/**
 * Generate accordion icon styles
 */
const createIconStyles = (theme: Theme, expanded: Partial<ExpandedAccordionStyles>): ExpandedAccordionStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: theme.spacing?.sm || 8,
        variants: {
            expanded: {
                true: {
                    _web: {
                        transform: 'rotate(180deg)',
                    },
                },
                false: {
                    _web: {
                        transform: 'rotate(0deg)',
                    },
                },
            },
            intent: createIconIntentVariants(theme),
        },
        _web: {
            transition: 'transform 0.2s ease',
        },
    }, expanded);
}

/**
 * Generate accordion content styles
 */
const createContentStyles = (theme: Theme, expanded: Partial<ExpandedAccordionStyles>): ExpandedAccordionStyles => {
    return deepMerge({
        overflow: 'hidden',
        variants: {
            expanded: {
                true: {
                    maxHeight: 2000,
                },
                false: {
                    maxHeight: 0,
                },
            },
        },
        _web: {
            transition: 'height 0.15s ease, padding 0.3s ease',
        },
    }, expanded);
}

/**
 * Generate accordion content inner styles
 */
const createContentInnerStyles = (theme: Theme, expanded: Partial<ExpandedAccordionStyles>): ExpandedAccordionStyles => {
    return deepMerge({
        color: theme.colors?.text?.secondary || '#666666',
        variants: {
            size: createContentInnerSizeVariants(),
        },
    }, expanded);
}

/**
 * Generate accordion stylesheet
 */
export const createAccordionStylesheet = (theme: Theme, expanded?: Partial<AccordionStylesheet>): AccordionStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        item: createItemStyles(theme, expanded?.item || {}),
        header: createHeaderStyles(theme, expanded?.header || {}),
        title: createTitleStyles(theme, expanded?.title || {}),
        icon: createIconStyles(theme, expanded?.icon || {}),
        content: createContentStyles(theme, expanded?.content || {}),
        contentInner: createContentInnerStyles(theme, expanded?.contentInner || {}),
    };
}
