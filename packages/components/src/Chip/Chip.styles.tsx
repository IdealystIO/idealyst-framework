import { StyleSheet } from 'react-native-unistyles';
import { Theme, Intent} from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';

type ChipSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ChipType = 'filled' | 'outlined' | 'soft';
type ChipIntent = Intent;

export type ChipVariants = {
    size: ChipSize;
    type: ChipType;
    intent: ChipIntent;
    selected: boolean;
    disabled: boolean;
    selectable: boolean;
}

/**
 * Create intent variants (placeholder, colors handled by compound variants)
 */
function createIntentVariants(theme: Theme) {
    const variants: any = {};
    for (const intent in theme.intents) {
        variants[intent] = {};
    }
    return variants;
}

/**
 * Create type variants (structure only, colors handled by compound variants)
 */
function createTypeVariants() {
    return {
        filled: {
            borderWidth: 1,
            borderStyle: 'solid' as const,
        },
        outlined: {
            borderWidth: 1,
            borderStyle: 'solid' as const,
            backgroundColor: 'transparent',
        },
        soft: {
            borderWidth: 0,
        },
    } as const;
}

/**
 * Create compound variants for container (type + intent + selected combinations)
 */
function createContainerCompoundVariants(theme: Theme) {
    const compoundVariants: any[] = [];

    for (const intent in theme.intents) {
        const intentValue = theme.intents[intent as Intent];

        // Filled + intent + selected combinations
        compoundVariants.push({
            intent,
            type: 'filled',
            selected: true,
            styles: {
                backgroundColor: intentValue.contrast,
                borderColor: intentValue.primary,
            },
        });
        compoundVariants.push({
            intent,
            type: 'filled',
            selected: false,
            styles: {
                backgroundColor: intentValue.primary,
                borderColor: 'transparent',
            },
        });

        // Outlined + intent + selected combinations
        compoundVariants.push({
            intent,
            type: 'outlined',
            selected: true,
            styles: {
                backgroundColor: intentValue.primary,
                borderColor: intentValue.primary,
            },
        });
        compoundVariants.push({
            intent,
            type: 'outlined',
            selected: false,
            styles: {
                backgroundColor: 'transparent',
                borderColor: intentValue.primary,
            },
        });

        // Soft + intent + selected combinations
        compoundVariants.push({
            intent,
            type: 'soft',
            selected: true,
            styles: {
                backgroundColor: intentValue.primary,
            },
        });
        compoundVariants.push({
            intent,
            type: 'soft',
            selected: false,
            styles: {
                backgroundColor: intentValue.light,
            },
        });
    }

    return compoundVariants;
}

/**
 * Create compound variants for label/icon colors (type + intent + selected combinations)
 */
function createColorCompoundVariants(theme: Theme) {
    const compoundVariants: any[] = [];

    for (const intent in theme.intents) {
        const intentValue = theme.intents[intent as Intent];

        // Filled + intent + selected combinations
        compoundVariants.push({
            intent,
            type: 'filled',
            selected: true,
            styles: {
                color: intentValue.primary,
            },
        });
        compoundVariants.push({
            intent,
            type: 'filled',
            selected: false,
            styles: {
                color: intentValue.contrast,
            },
        });

        // Outlined + intent + selected combinations
        compoundVariants.push({
            intent,
            type: 'outlined',
            selected: true,
            styles: {
                color: theme.colors.text.inverse,
            },
        });
        compoundVariants.push({
            intent,
            type: 'outlined',
            selected: false,
            styles: {
                color: intentValue.primary,
            },
        });

        // Soft + intent + selected combinations
        compoundVariants.push({
            intent,
            type: 'soft',
            selected: true,
            styles: {
                color: theme.colors.text.inverse,
            },
        });
        compoundVariants.push({
            intent,
            type: 'soft',
            selected: false,
            styles: {
                color: intentValue.dark,
            },
        });
    }

    return compoundVariants;
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const chipStyles = StyleSheet.create((theme: Theme) => {
  return {
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0,
        gap: 4,
        variants: {
            size: buildSizeVariants(theme, 'chip', (size) => ({
                paddingHorizontal: size.paddingHorizontal,
                paddingVertical: size.paddingVertical,
                minHeight: size.minHeight,
                borderRadius: size.borderRadius,
            })),
            intent: createIntentVariants(theme),
            type: createTypeVariants(),
            selected: {
                true: {},
                false: {},
            },
            disabled: {
                true: { opacity: 0.5 },
                false: { opacity: 1 },
            },
        },
        compoundVariants: createContainerCompoundVariants(theme),
    },
    label: {
        fontFamily: 'inherit', // TODO: Add typography to theme
        fontWeight: '500',
        variants: {
            size: buildSizeVariants(theme, 'chip', (size) => ({
                fontSize: size.fontSize,
                lineHeight: size.lineHeight,
            })),
            intent: createIntentVariants(theme),
            type: createTypeVariants(),
            selected: {
                true: {},
                false: {},
            },
        },
        compoundVariants: createColorCompoundVariants(theme),
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        variants: {
            size: buildSizeVariants(theme, 'chip', (size) => ({
                width: size.iconSize,
                height: size.iconSize,
            })),
            intent: createIntentVariants(theme),
            type: createTypeVariants(),
            selected: {
                true: {},
                false: {},
            },
        },
        compoundVariants: createColorCompoundVariants(theme),
    },
    deleteButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        marginLeft: 4,
        borderRadius: 12,
        variants: {
            size: buildSizeVariants(theme, 'chip', (size) => ({
                width: size.iconSize,
                height: size.iconSize,
            })),
        },
    },
    deleteIcon: {
        variants: {
            size: buildSizeVariants(theme, 'chip', (size) => ({
                fontSize: size.iconSize,
            })),
            intent: createIntentVariants(theme),
            type: createTypeVariants(),
            selected: {
                true: {},
                false: {},
            },
        },
        compoundVariants: createColorCompoundVariants(theme),
    },
  };
});