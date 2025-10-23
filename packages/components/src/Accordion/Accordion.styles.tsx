import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, CompoundVariants, Size} from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';

type AccordionSize = Size;
type AccordionType = 'default' | 'separated' | 'bordered';

type AccordionVariants = {
    size: AccordionSize;
    type: AccordionType;
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
const createContainerStyles = (theme: Theme): ExpandedAccordionStyles => {
    return {
        display: 'flex',
        flexDirection: 'column',
        variants: {
            type: createContainerTypeVariants(theme),
        },
    };
}

/**
 * Generate accordion item styles
 */
const createItemStyles = (theme: Theme): ExpandedAccordionStyles => {
    return {
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
    };
}

/**
 * Generate accordion header styles
 */
const createHeaderStyles = (theme: Theme): ExpandedAccordionStyles => {
    return {
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
    };
}

/**
 * Generate accordion title styles
 */
const createTitleStyles = (theme: Theme): ExpandedAccordionStyles => {
    return {
        flex: 1,
    };
}

/**
 * Generate accordion icon styles
 */
const createIconStyles = (theme: Theme) => {
    return {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
        color: theme.intents.primary.primary,
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
    };
}

/**
 * Generate accordion content styles
 */
const createContentStyles = (theme: Theme): ExpandedAccordionStyles => {
    return {
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
    };
}

/**
 * Generate accordion content inner styles
 */
const createContentInnerStyles = (theme: Theme): ExpandedAccordionStyles => {
    return {
        color: theme.colors.text.secondary,
        variants: {
            size: createContentInnerSizeVariants(theme),
        },
    };
}

/**
 * Generate accordion stylesheet
 */
export const createAccordionStylesheet = (theme: Theme): AccordionStylesheet => {
    return {
        container: createContainerStyles(theme),
        item: createItemStyles(theme),
        header: createHeaderStyles(theme),
        title: createTitleStyles(theme),
        icon: createIconStyles(theme),
        content: createContentStyles(theme),
        contentInner: createContentInnerStyles(theme),
    };
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const accordionStyles = StyleSheet.create((theme: Theme) => {
    return {
        container: createContainerStyles(theme),
        item: createItemStyles(theme),
        header: createHeaderStyles(theme),
        title: createTitleStyles(theme),
        icon: createIconStyles(theme),
        content: createContentStyles(theme),
        contentInner: createContentInnerStyles(theme),
    };
});
