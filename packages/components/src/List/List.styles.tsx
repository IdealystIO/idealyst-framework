import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, CompoundVariants, Size} from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';

type ListSize = Size;
type ListType = 'default' | 'bordered' | 'divided';

type ListVariants = {
    size: ListSize;
    type: ListType;
    scrollable: boolean;
    active: boolean;
    selected: boolean;
    disabled: boolean;
    clickable: boolean;
}

export type ExpandedListStyles = StylesheetStyles<keyof ListVariants>;

export type ListStylesheet = {
    container: ExpandedListStyles;
    item: ExpandedListStyles;
    itemContent: ExpandedListStyles;
    leading: ExpandedListStyles;
    labelContainer: ExpandedListStyles;
    label: ExpandedListStyles;
    trailing: ExpandedListStyles;
    trailingIcon: ExpandedListStyles;
    section: ExpandedListStyles;
    sectionTitle: ExpandedListStyles;
    sectionContent: ExpandedListStyles;
}

/**
 * Create type variants for container
 */
function createContainerTypeVariants(theme: Theme) {
    return {
        default: {
            backgroundColor: 'transparent',
        },
        bordered: {
            backgroundColor: theme.colors.surface.primary,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.border.primary,
            borderRadius: 8,
            overflow: 'hidden',
            _web: {
                border: `1px solid ${theme.colors.border.primary}`,
            },
        },
        divided: {
            backgroundColor: 'transparent',
        },
    };
}


/**
 * Create compound variants for item
 */
function createItemCompoundVariants(theme: Theme): CompoundVariants<keyof ListVariants> {
    return [
        {
            type: 'divided',
            styles: {
                _web: {
                    ':last-child': {
                        borderBottom: 'none',
                    },
                },
            },
        },
        {
            disabled: true,
            styles: {
                _web: {
                    _hover: {
                        backgroundColor: 'transparent',
                        borderRadius: 0,
                    },
                },
            },
        },
        {
            clickable: false,
            styles: {
                _web: {
                    _hover: {
                        backgroundColor: 'transparent',
                        borderRadius: 0,
                    },
                },
            },
        },
    ];
}


// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const listStyles = StyleSheet.create((theme: Theme) => {
    return {
        container: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            variants: {
                type: createContainerTypeVariants(theme),
                scrollable: {
                    true: {
                        overflow: 'auto',
                        _web: {
                            overflowY: 'auto',
                        },
                    },
                    false: {},
                },
            },
        },
        item: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'transparent',
            textAlign: 'left',
            variants: {
                size: buildSizeVariants(theme, 'list', (size) => ({
                    paddingVertical: size.paddingVertical,
                    paddingHorizontal: size.paddingHorizontal,
                    minHeight: size.minHeight,
                })),
                type: {
                    default: {},
                    bordered: {},
                    divided: {
                        borderBottomWidth: 1,
                        borderBottomStyle: 'solid',
                        borderBottomColor: theme.colors.border.primary,
                        _web: {
                            borderBottom: `1px solid ${theme.colors.border.primary}`,
                        },
                    },
                },
                active: {
                    true: {
                        backgroundColor: theme.colors.surface.secondary,
                    },
                    false: {},
                },
                selected: {
                    true: {
                        backgroundColor: theme.intents.primary.light + '20',
                        borderLeftWidth: 3,
                        borderLeftColor: theme.intents.primary.primary,
                        _web: {
                            borderLeft: `3px solid ${theme.intents.primary.primary}`,
                        },
                    },
                    false: {},
                },
                disabled: {
                    true: {
                        opacity: 0.5,
                        _web: {
                            cursor: 'not-allowed',
                        },
                    },
                    false: {},
                },
                clickable: {
                    true: {},
                    false: {
                        _web: {
                            cursor: 'default',
                        },
                    },
                },
            },
            compoundVariants: createItemCompoundVariants(theme),
            _web: {
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                transition: 'background-color 0.2s ease, border-color 0.2s ease',
                _hover: {
                    backgroundColor: theme.colors.surface.secondary,
                    borderRadius: 4,
                },
            },
        },
        itemContent: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            gap: 8,
        },
        leading: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
            color: theme.colors.text.secondary,
            variants: {
                size: buildSizeVariants(theme, 'list', (size) => ({
                    width: size.iconSize,
                    height: size.iconSize,
                })),
            },
        },
        labelContainer: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
        },
        label: {
        fontWeight: '500',
        color: theme.colors.text.primary,
        variants: {
            size: buildSizeVariants(theme, 'list', (size) => ({
                fontSize: size.labelFontSize,
                lineHeight: size.labelLineHeight,
            })),
            disabled: {
                true: {
                    color: theme.colors.text.secondary,
                },
                false: {},
            },
            selected: {
                true: {
                    color: theme.intents.primary.primary,
                    fontWeight: '600',
                },
                false: {},
            },
        },
    },
        trailing: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
            color: theme.colors.text.secondary,
            flexShrink: 0,
        },
        trailingIcon: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            variants: {
                size: buildSizeVariants(theme, 'list', (size) => ({
                    width: size.iconSize,
                    height: size.iconSize,
                })),
            },
        },
        section: {
            display: 'flex',
            flexDirection: 'column',
        },
        sectionTitle: {
            fontWeight: '600',
            fontSize: 12,
            lineHeight: 16,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: theme.colors.text.secondary,
            padding: 8,
            paddingBottom: 4,
        },
        sectionContent: {
            display: 'flex',
            flexDirection: 'column',
        },
    };
});
