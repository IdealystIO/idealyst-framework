import { StyleSheet } from 'react-native-unistyles';
import { Theme } from '@idealyst/theme';
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
import { applyExtensions } from '../extensions/applyExtension';

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


type ItemDynamicProps = {
    type?: ListType;
    disabled?: boolean;
    clickable?: boolean;
};

/**
 * Get item hover styles based on disabled and clickable state
 */
function getItemHoverStyles(theme: Theme, disabled: boolean, clickable: boolean) {
    if (disabled || !clickable) {
        return {
            backgroundColor: 'transparent',
            borderRadius: 0,
        };
    }
    return {
        backgroundColor: theme.colors.surface.secondary,
        borderRadius: 4,
    };
}


// Container style creator for extension support
function createContainerStyles(theme: Theme) {
    return () => ({
        display: 'flex' as const,
        flexDirection: 'column' as const,
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
    });
}

// Item style creator for extension support
function createItemStyles(theme: Theme) {
    return ({ type = 'default', disabled = false, clickable = true }: ItemDynamicProps) => {
        const hoverStyles = getItemHoverStyles(theme, disabled, clickable);
        return {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'transparent',
            textAlign: 'left',
            borderBottomWidth: type === 'divided' ? 1 : 0,
            borderBottomStyle: type === 'divided' ? 'solid' as const : undefined,
            borderBottomColor: type === 'divided' ? theme.colors.border.primary : undefined,
            variants: {
                size: buildSizeVariants(theme, 'list', (size) => ({
                    paddingVertical: size.paddingVertical,
                    paddingHorizontal: size.paddingHorizontal,
                    minHeight: size.minHeight,
                })),
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
            } as const,
            opacity: disabled ? 0.5 : 1,
            _web: {
                border: 'none',
                cursor: disabled ? 'not-allowed' : (clickable ? 'pointer' : 'default'),
                outline: 'none',
                transition: 'background-color 0.2s ease, border-color 0.2s ease',
                borderBottom: type === 'divided' ? `1px solid ${theme.colors.border.primary}` : undefined,
                _hover: hoverStyles,
            },
        } as const;
    };
}

export const listStyles = StyleSheet.create((theme: Theme) => {
    // Apply extensions to main visual elements
    const extended = applyExtensions('List', theme, {
        container: createContainerStyles(theme),
        item: createItemStyles(theme),
    });

    return {
        ...extended,
        // Minor utility styles (not extended)
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
