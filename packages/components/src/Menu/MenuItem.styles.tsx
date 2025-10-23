import { StyleSheet } from 'react-native-unistyles';
import { Theme } from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const menuItemStyles = StyleSheet.create((theme: Theme) => {
    return {
        item: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'transparent',
            borderRadius: 4,
            minHeight: 44,
            _web: {
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
                transition: 'background-color 0.2s ease',
                textAlign: 'left',
                _hover: {
                    backgroundColor: theme.colors.surface.secondary,
                },
            },
            variants: {
                size: buildSizeVariants(theme, 'menu', (size) => ({
                    paddingVertical: size.paddingVertical,
                    paddingHorizontal: size.paddingHorizontal,
                })),
                disabled: {
                    true: {
                        opacity: 0.5,
                        _web: {
                            cursor: 'not-allowed',
                        },
                    },
                    false: {},
                },
                intent: {
                    primary: {
                        _web: {
                            _hover: {
                                backgroundColor: theme.intents.primary.light,
                                color: theme.intents.primary.primary,
                            },
                        },
                    },
                    neutral: {},
                    success: {
                        _web: {
                            _hover: {
                                backgroundColor: theme.intents.success.light,
                                color: theme.intents.success.primary,
                            },
                        },
                    },
                    error: {
                        _web: {
                            _hover: {
                                backgroundColor: theme.intents.error.light,
                                color: theme.intents.error.primary,
                            },
                        },
                    },
                    warning: {
                        _web: {
                            _hover: {
                                backgroundColor: theme.intents.warning.light,
                                color: theme.intents.warning.primary,
                            },
                        },
                    },
                    info: {
                        _web: {
                            _hover: {
                                backgroundColor: theme.intents.info.light,
                                color: theme.intents.info.primary,
                            },
                        },
                    },
                },
            },
            compoundVariants: [
                {
                    disabled: true,
                    styles: {
                        _web: {
                            _hover: {
                                backgroundColor: 'transparent',
                            },
                        },
                    },
                },
            ],
        },
        icon: {
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginRight: 12,
            variants: {
                size: buildSizeVariants(theme, 'menu', (size) => ({
                    width: size.iconSize,
                    height: size.iconSize,
                    fontSize: size.iconSize,
                }))
            },
        },
        label: {
            flex: 1,
            color: theme.colors.text.primary,
            variants: {
                size: buildSizeVariants(theme, 'menu', (size) => ({
                    fontSize: size.labelFontSize,
                })),
            },
        },
    };
});
