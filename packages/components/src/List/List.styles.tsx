import { StyleSheet } from 'react-native-unistyles';
import { Theme, CompoundVariants } from '@idealyst/theme';
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
import { ListSizeVariant, ListType } from './types';

type ListVariants = {
    type: ListType;
    size: ListSizeVariant;
    scrollable: boolean;
    active: boolean;
    selected: boolean;
    disabled: boolean;
    clickable: boolean;
};

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
            borderColor: theme.colors.border.primary,
            borderRadius: 8,
            _web: {
                overflow: 'hidden',
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
                        _web: {
                            overflow: 'auto',
                        },
                    },
                    false: {},
                },
                // Spacing variants from ContainerStyleProps
                gap: buildGapVariants(theme),
                padding: buildPaddingVariants(theme),
                paddingVertical: buildPaddingVerticalVariants(theme),
                paddingHorizontal: buildPaddingHorizontalVariants(theme),
                margin: buildMarginVariants(theme),
                marginVertical: buildMarginVerticalVariants(theme),
                marginHorizontal: buildMarginHorizontalVariants(theme),
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
            } as const,
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
        } as const,
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
            } as const,
        } as const,
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
