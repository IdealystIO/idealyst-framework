import { StyleSheet } from 'react-native-unistyles';
import { Theme } from '@idealyst/theme';

// Type definitions
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SelectSize = Size;
type SelectType = 'outlined' | 'filled';
type SelectIntent = 'primary' | 'success' | 'error' | 'warning' | 'neutral' | 'info';

type SelectTriggerVariants = {
    type: SelectType;
    size: SelectSize;
    intent: SelectIntent;
    disabled: boolean;
    error: boolean;
    focused: boolean;
}

type SelectOptionVariants = {
    selected: boolean;
    disabled: boolean;
}

type SelectHelperTextVariants = {
    error: boolean;
}

// Helper functions
function isPlainObject(value: unknown): value is Record<string, any> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]'
  )
}

function deepMerge<T extends Record<string, any>, S extends Record<string, any>>(
  target: T,
  source: S
): T & S {
  const result: Record<string, any> = { ...target }

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key]
      const targetValue = result[key]

      if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
        result[key] = deepMerge(targetValue, sourceValue)
      } else {
        result[key] = sourceValue
      }
    }
  }

  return result as T & S
}

function buildSizeVariants<T>(theme: Theme, component: string, builder: (value: any) => any): Record<Size, any> {
    const variants = {} as Record<Size, any>;
    for (const size in (theme.sizes as any)[component]) {
        variants[size as Size] = builder((theme.sizes as any)[component][size as Size]);
    }
    return variants;
}

function createTriggerTypeVariants(theme: Theme) {
    return {
        outlined: {
            backgroundColor: theme.colors.surface.primary,
            borderColor: theme.colors.border.primary,
            _web: {
                border: `1px solid ${theme.colors.border.primary}`,
            },
        },
        filled: {
            backgroundColor: theme.colors.surface.secondary,
            borderColor: 'transparent',
            _web: {
                border: '1px solid transparent',
            },
        },
    };
}

function createTriggerSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'select', (size) => ({
        paddingHorizontal: size.paddingHorizontal,
        minHeight: size.minHeight,
    }));
}

function createIntentVariants(theme: Theme, type: SelectType, intent: SelectIntent) {
    if (intent === 'neutral') {
        return {};
    }

    const intentValue = (theme.intents as any)[intent];

    if (type === 'outlined') {
        return {
            borderColor: intentValue.primary,
            _web: {
                border: `1px solid ${intentValue.primary}`,
            },
        };
    }

    return {};
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const selectStyles = StyleSheet.create((theme: Theme) => {
    return {
        container: deepMerge({
            position: 'relative',
            backgroundColor: theme.colors.surface.primary,
        }, {}),
        label: deepMerge({
            fontSize: 14,
            fontWeight: '500',
            color: theme.colors.text.primary,
            marginBottom: 4,
        }, {}),
        trigger: ({ type, intent }: SelectTriggerVariants) => {
            const intentStyles = createIntentVariants(theme, type, intent);

            return deepMerge({
                position: 'relative',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 8,
                borderWidth: 1,
                borderStyle: 'solid',
                ...intentStyles,
                variants: {
                    type: createTriggerTypeVariants(theme),
                    size: createTriggerSizeVariants(theme),
                    disabled: {
                        true: {
                            opacity: 0.6,
                            _web: {
                                cursor: 'not-allowed',
                            },
                        },
                        false: {
                            _web: {
                                cursor: 'pointer',
                                _hover: {
                                    opacity: 0.9,
                                },
                                _active: {
                                    opacity: 0.8,
                                },
                            },
                        },
                    },
                    error: {
                        true: {
                            borderColor: theme.intents.error.primary,
                            _web: {
                                border: `1px solid ${theme.intents.error.primary}`,
                            },
                        },
                        false: {},
                    },
                    focused: {
                        true: {
                            borderColor: theme.intents.primary.primary,
                            _web: {
                                border: `2px solid ${theme.intents.primary.primary}`,
                                outline: 'none',
                            },
                        },
                        false: {},
                    },
                },
                _web: {
                    display: 'flex',
                    boxSizing: 'border-box',
                    _focus: {
                        outline: 'none',
                    },
                },
            }, {});
        },
        triggerContent: deepMerge({
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
        }, {}),
        triggerText: deepMerge({
            color: theme.colors.text.primary,
            flex: 1,
            variants: {
                size: buildSizeVariants(theme, 'select', (size: any) => ({
                    fontSize: size.fontSize,
                })),
            },
        }, {}),
        placeholder: deepMerge({
            color: theme.colors.text.secondary,
            variants: {
                size: buildSizeVariants(theme, 'select', (size: any) => ({
                    fontSize: size.fontSize,
                })),
            },
        }, {}),
        icon: deepMerge({
            marginLeft: 4,
            color: theme.colors.text.secondary,
        }, {}),
        chevron: deepMerge({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 4,
            color: theme.colors.text.secondary,
            variants: {
                size: buildSizeVariants(theme, 'select', (size: any) => ({
                    width: size.iconSize,
                    height: size.iconSize,
                })),
            },
            _web: {
                transition: 'transform 0.2s ease',
            },
        }, {}),
        chevronOpen: deepMerge({
            transform: 'rotate(180deg)',
        }, {}),
        dropdown: deepMerge({
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: theme.colors.surface.primary,
            borderRadius: 8,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.border.primary,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 24,
            elevation: 8,
            zIndex: 9999,
            maxHeight: 240,
            minWidth: 200,
            overflow: 'hidden',
            _web: {
                border: `1px solid ${theme.colors.border.primary}`,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06)',
                overflowY: 'auto',
            },
        }, {}),
        searchContainer: deepMerge({
            padding: 8,
            borderBottomWidth: 1,
            borderBottomStyle: 'solid',
            borderBottomColor: theme.colors.border.primary,
            _web: {
                borderBottom: `1px solid ${theme.colors.border.primary}`,
            },
        }, {}),
        searchInput: deepMerge({
            padding: 4,
            borderRadius: 4,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.border.primary,
            backgroundColor: theme.colors.surface.primary,
            variants: {
                size: buildSizeVariants(theme, 'select', (size: any) => ({
                    fontSize: size.fontSize,
                })),
            },
            _web: {
                border: `1px solid ${theme.colors.border.primary}`,
                outline: 'none',
                _focus: {
                    borderColor: theme.intents.primary.primary,
                },
            },
        }, {}),
        optionsList: deepMerge({
            paddingVertical: 4,
        }, {}),
        option: deepMerge({
            paddingHorizontal: 8,
            paddingVertical: 4,
            flexDirection: 'row',
            alignItems: 'center',
            minHeight: 36,
            variants: {
                selected: {
                    true: {
                        backgroundColor: theme.intents.primary.light,
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
                    false: {
                        _web: {
                            cursor: 'pointer',
                            _hover: {
                                backgroundColor: theme.colors.surface.secondary,
                            },
                            _active: {
                                opacity: 0.8,
                            },
                        },
                    },
                },
            },
            _web: {
                display: 'flex',
            },
        }, {}),
        optionContent: deepMerge({
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        }, {}),
        optionIcon: deepMerge({
            marginRight: 4,
        }, {}),
        optionText: deepMerge({
            color: theme.colors.text.primary,
            flex: 1,
            variants: {
                size: buildSizeVariants(theme, 'select', (size: any) => ({
                    fontSize: size.fontSize,
                })),
            },
        }, {}),
        optionTextDisabled: deepMerge({
            color: theme.colors.text.secondary,
        }, {}),
        helperText: deepMerge({
            fontSize: 12,
            marginTop: 4,
            color: theme.colors.text.secondary,
            variants: {
                error: {
                    true: {
                        color: theme.intents.error.primary,
                    },
                    false: {},
                },
            },
        }, {}),
        overlay: deepMerge({
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            _web: {
                position: 'fixed',
            },
        }, {}),
    };
});
