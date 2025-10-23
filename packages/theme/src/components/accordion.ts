import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { Size } from "../theme/size";
import { deepMerge } from "../util/deepMerge";
import { buildSizeVariants } from "../variants/size";

type AccordionSize = Size;
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
            gap: 8,
        },
        bordered: {
            gap: 0,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.border.primary,
            borderRadius: 8,
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
            borderBottomColor: theme.colors.border.primary,
        },
        separated: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.border.primary,
            borderRadius: 8,
            overflow: 'hidden',
        },
        bordered: {
            borderBottomWidth: 1,
            borderBottomStyle: 'solid',
            borderBottomColor: theme.colors.border.primary,
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
function createHeaderSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'accordion', (size) => ({
        fontSize: size.headerFontSize,
        padding: size.headerPadding,
    }));
}

/**
 * Get icon color based on intent
 */
function getIconColor(theme: Theme, intent: AccordionIntent) {
    return theme.intents[intent].primary;
}

/**
 * Create size variants for icon
 */
function createIconSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'accordion', (size) => ({
        width: size.iconSize,
        height: size.iconSize,
    }));
}

/**
 * Create size variants for content inner
 */
function createContentInnerSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'accordion', (size) => ({
        fontSize: size.headerFontSize,
        padding: size.contentPadding,
        paddingTop: 0,
    }));
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
        color: theme.colors.text.primary,
        textAlign: 'left',
        variants: {
            size: createHeaderSizeVariants(theme),
            expanded: {
                true: {
                    fontWeight: '600',
                },
                false: {
                    fontWeight: '500',
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
                        cursor: 'pointer',
                        _hover: {
                            backgroundColor: theme.colors.surface.secondary,
                        },
                    },
                },
            },
        },
        _web: {
            border: 'none',
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
const createIconStyles = (theme: Theme, expanded: Partial<ExpandedAccordionStyles>) => {
    return ({ intent }: { intent: AccordionIntent }) => {
        return deepMerge({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
            color: getIconColor(theme, intent),
            variants: {
                size: createIconSizeVariants(theme),
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
            },
            _web: {
                transition: 'transform 0.2s ease',
            },
        }, expanded);
    }
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
        color: theme.colors.text.secondary,
        variants: {
            size: createContentInnerSizeVariants(theme),
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
