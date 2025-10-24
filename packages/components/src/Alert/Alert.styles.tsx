import { StyleSheet } from 'react-native-unistyles';
import { Theme, Intent} from '@idealyst/theme';

type AlertType = 'filled' | 'outlined' | 'soft';
type AlertIntent = Intent | 'info'; // Alert includes 'info' which maps to primary

export type AlertVariants = {
    type: AlertType;
    intent: AlertIntent;
}

/**
 * Create intent variants (placeholder, colors handled by compound variants)
 */
function createIntentVariants(theme: Theme) {
    const variants: any = {
        info: {},
    };
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
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderStyle: 'solid' as const,
        },
        soft: {
            borderWidth: 1,
            borderStyle: 'solid' as const,
        },
    } as const;
}

/**
 * Create compound variants for container (type + intent combinations)
 */
function createContainerCompoundVariants(theme: Theme) {
    const compoundVariants: any[] = [];

    // Process standard intents from theme
    for (const intent in theme.intents) {
        const intentValue = theme.intents[intent as Intent];

        // Filled + intent
        compoundVariants.push({
            intent,
            type: 'filled',
            styles: {
                backgroundColor: intentValue.primary,
                borderColor: intentValue.primary,
            },
        });

        // Outlined + intent
        compoundVariants.push({
            intent,
            type: 'outlined',
            styles: {
                borderColor: intentValue.primary,
            },
        });

        // Soft + intent
        compoundVariants.push({
            intent,
            type: 'soft',
            styles: {
                backgroundColor: intentValue.light,
                borderColor: intentValue.light,
            },
        });
    }

    // Add 'info' intent (maps to primary)
    const primaryIntent = theme.intents.primary;
    compoundVariants.push({
        intent: 'info',
        type: 'filled',
        styles: {
            backgroundColor: primaryIntent.primary,
            borderColor: primaryIntent.primary,
        },
    });
    compoundVariants.push({
        intent: 'info',
        type: 'outlined',
        styles: {
            borderColor: primaryIntent.primary,
        },
    });
    compoundVariants.push({
        intent: 'info',
        type: 'soft',
        styles: {
            backgroundColor: primaryIntent.light,
            borderColor: primaryIntent.light,
        },
    });

    return compoundVariants;
}

/**
 * Create compound variants for icon/title colors (type + intent combinations)
 */
function createIconTitleCompoundVariants(theme: Theme) {
    const compoundVariants: any[] = [];

    // Process standard intents from theme
    for (const intent in theme.intents) {
        const intentValue = theme.intents[intent as Intent];

        // Filled type: use contrast color
        compoundVariants.push({
            intent,
            type: 'filled',
            styles: {
                color: intentValue.contrast,
            },
        });

        // Outlined type: use primary color
        compoundVariants.push({
            intent,
            type: 'outlined',
            styles: {
                color: intentValue.primary,
            },
        });

        // Soft type: use primary color
        compoundVariants.push({
            intent,
            type: 'soft',
            styles: {
                color: intentValue.primary,
            },
        });
    }

    // Add 'info' intent (maps to primary)
    const primaryIntent = theme.intents.primary;
    compoundVariants.push({
        intent: 'info',
        type: 'filled',
        styles: {
            color: primaryIntent.contrast,
        },
    });
    compoundVariants.push({
        intent: 'info',
        type: 'outlined',
        styles: {
            color: primaryIntent.primary,
        },
    });
    compoundVariants.push({
        intent: 'info',
        type: 'soft',
        styles: {
            color: primaryIntent.primary,
        },
    });

    return compoundVariants;
}

/**
 * Create compound variants for message colors (type + intent combinations)
 */
function createMessageCompoundVariants(theme: Theme) {
    const compoundVariants: any[] = [];

    // Process standard intents from theme
    for (const intent in theme.intents) {
        const intentValue = theme.intents[intent as Intent];

        // Filled type: use contrast color
        compoundVariants.push({
            intent,
            type: 'filled',
            styles: {
                color: intentValue.contrast,
            },
        });

        // Outlined type: use primary text color
        compoundVariants.push({
            intent,
            type: 'outlined',
            styles: {
                color: theme.colors.text.primary,
            },
        });

        // Soft type: use primary text color
        compoundVariants.push({
            intent,
            type: 'soft',
            styles: {
                color: theme.colors.text.primary,
            },
        });
    }

    // Add 'info' intent (maps to primary)
    const primaryIntent = theme.intents.primary;
    compoundVariants.push({
        intent: 'info',
        type: 'filled',
        styles: {
            color: primaryIntent.contrast,
        },
    });
    compoundVariants.push({
        intent: 'info',
        type: 'outlined',
        styles: {
            color: theme.colors.text.primary,
        },
    });
    compoundVariants.push({
        intent: 'info',
        type: 'soft',
        styles: {
            color: theme.colors.text.primary,
        },
    });

    return compoundVariants;
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel transform on native cannot resolve function calls to extract variant structures.
export const alertStyles = StyleSheet.create((theme: Theme) => {
    return {
        container: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 8,
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderStyle: 'solid' as const,
            variants: {
                intent: createIntentVariants(theme),
                type: createTypeVariants(),
            },
            compoundVariants: createContainerCompoundVariants(theme),
        },
        iconContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: 24,
            height: 24,
            variants: {
                intent: createIntentVariants(theme),
                type: createTypeVariants(),
            },
            compoundVariants: createIconTitleCompoundVariants(theme),
        },
        content: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
        },
        title: {
            fontSize: 16,
            lineHeight: 24,
            fontWeight: '600',
            variants: {
                intent: createIntentVariants(theme),
                type: createTypeVariants(),
            },
            compoundVariants: createIconTitleCompoundVariants(theme),
        },
        message: {
            fontSize: 14,
            lineHeight: 20,
            variants: {
                intent: createIntentVariants(theme),
                type: createTypeVariants(),
            },
            compoundVariants: createMessageCompoundVariants(theme),
        },
        actions: {
            marginTop: 4,
            display: 'flex',
            flexDirection: 'row',
            gap: 8,
        },
        closeButton: {
            padding: 4,
            backgroundColor: 'transparent',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            _web: {
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                _hover: {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                },
            },
        },
        closeIcon: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 16,
            height: 16,
        },
    };
});
