import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Size } from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';
import {
  buildGapVariants,
  buildPaddingVariants,
  buildPaddingVerticalVariants,
  buildPaddingHorizontalVariants,
  buildMarginVariants,
  buildMarginVerticalVariants,
  buildMarginHorizontalVariants,
} from '../utils/buildViewStyleVariants';
import { AccordionType } from './types';
import { applyExtensions } from '../extensions/applyExtension';

type AccordionSize = Size;

type AccordionVariants = {
    size: AccordionSize;
    type: AccordionType;
    expanded: boolean;
    disabled: boolean;
    isLast: boolean;
}

export type ExpandedAccordionStyles = StylesheetStyles<keyof AccordionVariants>;

type ItemDynamicProps = {
    type?: AccordionType;
    isLast?: boolean;
};

/**
 * Create type variants for container
 */
function createContainerTypeVariants(theme: Theme) {
    return {
        standard: {
            gap: 0,
        },
        separated: {
            gap: 8,
        },
        bordered: {
            gap: 0,
            borderWidth: 1,
            borderStyle: 'solid' as const,
            borderColor: theme.colors.border.primary,
            borderRadius: 8,
            overflow: 'hidden' as const,
        },
    } as const;
}

/**
 * Get item styles based on type and isLast
 */
function getItemTypeStyles(theme: Theme, type: AccordionType, isLast: boolean) {
    switch (type) {
        case 'standard':
            return {
                borderBottomWidth: isLast ? 0 : 1,
                borderBottomStyle: 'solid' as const,
                borderBottomColor: theme.colors.border.primary,
            };
        case 'separated':
            return {
                borderWidth: 1,
                borderStyle: 'solid' as const,
                borderColor: theme.colors.border.primary,
                borderRadius: 8,
                overflow: 'hidden' as const,
            };
        case 'bordered':
            return {
                borderBottomWidth: isLast ? 0 : 1,
                borderBottomStyle: 'solid' as const,
                borderBottomColor: theme.colors.border.primary,
            };
        default:
            return {};
    }
}

/**
 * Create dynamic item styles
 */
function createItemStyles(theme: Theme) {
    return ({ type = 'standard', isLast = false }: ItemDynamicProps) => {
        const typeStyles = getItemTypeStyles(theme, type, isLast);
        return {
            display: 'flex' as const,
            flexDirection: 'column' as const,
            ...typeStyles,
            variants: {
                size: { xs: {}, sm: {}, md: {}, lg: {}, xl: {} },
                expanded: { true: {}, false: {} },
                disabled: { true: {}, false: {} },
            },
        } as const;
    };
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

// Helper functions to create static styles wrapped in dynamic functions
function createContainerStyles(theme: Theme) {
    return () => ({
        display: 'flex' as const,
        flexDirection: 'column' as const,
        variants: {
            size: { xs: {}, sm: {}, md: {}, lg: {}, xl: {} },
            type: createContainerTypeVariants(theme),
            expanded: { true: {}, false: {} },
            disabled: { true: {}, false: {} },
            isLast: { true: {}, false: {} },
            // Spacing variants from ContainerStyleProps
            gap: buildGapVariants(theme),
            padding: buildPaddingVariants(theme),
            paddingVertical: buildPaddingVerticalVariants(theme),
            paddingHorizontal: buildPaddingHorizontalVariants(theme),
            margin: buildMarginVariants(theme),
            marginVertical: buildMarginVerticalVariants(theme),
            marginHorizontal: buildMarginHorizontalVariants(theme),
        },
    });
}

function createHeaderStyles(theme: Theme) {
    return () => ({
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        width: '100%' as const,
        backgroundColor: 'transparent' as const,
        color: theme.colors.text.primary,
        textAlign: 'left' as const,
        variants: {
            size: createHeaderSizeVariants(theme),
            type: { standard: {}, separated: {}, bordered: {} },
            expanded: {
                true: {
                    fontWeight: '600' as const,
                },
                false: {
                    fontWeight: '500' as const,
                },
            },
            disabled: {
                true: {
                    opacity: 0.5,
                    _web: {
                        cursor: 'not-allowed' as const,
                    },
                },
                false: {
                    _web: {
                        cursor: 'pointer' as const,
                        _hover: {
                            backgroundColor: theme.colors.surface.secondary,
                        },
                    },
                },
            },
            isLast: { true: {}, false: {} },
        } as const,
        _web: {
            border: 'none' as const,
            outline: 'none' as const,
            transition: 'background-color 0.2s ease' as const,
        },
    });
}

function createTitleStyles() {
    return () => ({
        flex: 1,
        variants: {
            size: { xs: {}, sm: {}, md: {}, lg: {}, xl: {} },
            type: { standard: {}, separated: {}, bordered: {} },
            expanded: { true: {}, false: {} },
            disabled: { true: {}, false: {} },
            isLast: { true: {}, false: {} },
        },
    });
}

function createIconStyles(theme: Theme) {
    return () => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        marginLeft: 8,
        color: theme.intents.primary.primary,
        variants: {
            size: createIconSizeVariants(theme),
            type: { standard: {}, separated: {}, bordered: {} },
            expanded: {
                true: {
                    _web: {
                        transform: 'rotate(180deg)' as const,
                    },
                },
                false: {
                    _web: {
                        transform: 'rotate(0deg)' as const,
                    },
                },
            },
            disabled: { true: {}, false: {} },
            isLast: { true: {}, false: {} },
        },
        _web: {
            transition: 'transform 0.2s ease' as const,
        },
    });
}

function createContentStyles() {
    return () => ({
        overflow: 'hidden' as const,
        variants: {
            size: { xs: {}, sm: {}, md: {}, lg: {}, xl: {} },
            type: { standard: {}, separated: {}, bordered: {} },
            expanded: {
                true: {
                    maxHeight: 2000,
                },
                false: {
                    maxHeight: 0,
                },
            },
            disabled: { true: {}, false: {} },
            isLast: { true: {}, false: {} },
        },
        _web: {
            transition: 'height 0.15s ease, padding 0.3s ease' as const,
        },
    });
}

function createContentInnerStyles(theme: Theme) {
    return () => ({
        color: theme.colors.text.secondary,
        variants: {
            size: createContentInnerSizeVariants(theme),
            type: { standard: {}, separated: {}, bordered: {} },
            expanded: { true: {}, false: {} },
            disabled: { true: {}, false: {} },
            isLast: { true: {}, false: {} },
        },
    });
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel transform on native cannot resolve function calls to extract variant structures.
export const accordionStyles = StyleSheet.create((theme: Theme) => {
    // Apply extensions to main visual elements

    return applyExtensions('Accordion', theme, {container: createContainerStyles(theme),
        item: createItemStyles(theme),
        header: createHeaderStyles(theme),
        content: createContentStyles(),
        icon: createIconStyles(theme),
        // Additional styles (merged from return)
        // Minor utility styles (not extended)
        title: createTitleStyles()(),
        contentInner: createContentInnerStyles(theme)()});
});
