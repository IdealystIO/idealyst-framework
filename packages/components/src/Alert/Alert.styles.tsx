import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent} from '@idealyst/theme';

type AlertType = 'filled' | 'outlined' | 'soft';
type AlertIntent = Intent | 'info'; // Alert includes 'info' which maps to primary

type AlertVariants = {
    type: AlertType;
    intent: AlertIntent;
}

export type ExpandedAlertStyles = StylesheetStyles<keyof AlertVariants>;

export type AlertStylesheet = {
    container: ExpandedAlertStyles;
    iconContainer: ExpandedAlertStyles;
    content: ExpandedAlertStyles;
    title: ExpandedAlertStyles;
    message: ExpandedAlertStyles;
    actions: ExpandedAlertStyles;
    closeButton: ExpandedAlertStyles;
    closeIcon: ExpandedAlertStyles;
}

/**
 * Helper to get intent colors, mapping 'info' to 'primary'
 */
function getIntentColors(theme: Theme, intent: AlertIntent) {
    const actualIntent = intent === 'info' ? 'primary' : intent;
    return theme.intents[actualIntent as Intent];
}

/**
 * Get container styles based on type and intent
 */
function getContainerStyles(theme: Theme, type: AlertType, intent: AlertIntent) {
    const colors = getIntentColors(theme, intent);
    const isNeutral = intent === 'neutral';

    switch (type) {
        case 'filled':
            return {
                backgroundColor: isNeutral ? theme.colors.surface.secondary : colors.primary,
                borderColor: isNeutral ? theme.colors.border.primary : colors.primary,
            };
        case 'outlined':
            return {
                backgroundColor: 'transparent',
                borderColor: isNeutral ? theme.colors.border.primary : colors.primary,
            };
        case 'soft':
            return {
                backgroundColor: isNeutral ? theme.colors.surface.secondary : colors.light,
                borderColor: isNeutral ? theme.colors.surface.secondary : colors.light,
            };
    }
}

/**
 * Get icon color based on type and intent
 */
function getIconColor(theme: Theme, type: AlertType, intent: AlertIntent) {
    const colors = getIntentColors(theme, intent);
    const isNeutral = intent === 'neutral';

    if (type === 'filled') {
        return isNeutral ? theme.colors.text.primary : colors.contrast;
    }
    // outlined and soft both use primary or text.primary for neutral
    return isNeutral ? theme.colors.text.primary : colors.primary;
}

/**
 * Get title color based on type and intent (same as icon)
 */
function getTitleColor(theme: Theme, type: AlertType, intent: AlertIntent) {
    return getIconColor(theme, type, intent);
}

/**
 * Get message color based on type and intent
 */
function getMessageColor(theme: Theme, type: AlertType, intent: AlertIntent) {
    const colors = getIntentColors(theme, intent);
    const isNeutral = intent === 'neutral';

    if (type === 'filled') {
        return isNeutral ? theme.colors.text.primary : colors.contrast;
    }
    // outlined and soft both use primary text color
    return theme.colors.text.primary;
}

/**
 * Generate alert container styles
 */
const createContainerStyles = (theme: Theme) => {
    return ({ type, intent }: { type: AlertType, intent: AlertIntent }) => {
        const containerStyles = getContainerStyles(theme, type, intent);
        return {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 8,
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderStyle: 'solid',
            ...containerStyles,
        };
    }
}

/**
 * Generate alert icon container styles
 */
const createIconContainerStyles = (theme: Theme) => {
    return ({ type, intent }: { type: AlertType, intent: AlertIntent }) => {
        return {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: 24,
            height: 24,
            color: getIconColor(theme, type, intent),
        };
    }
}

/**
 * Generate alert title styles
 */
const createTitleStyles = (theme: Theme) => {
    return ({ type, intent }: { type: AlertType, intent: AlertIntent }) => {
        return {
            fontSize: 16,
            lineHeight: 24,
            fontWeight: '600',
            color: getTitleColor(theme, type, intent),
        };
    }
}

/**
 * Generate alert message styles
 */
const createMessageStyles = (theme: Theme) => {
    return ({ type, intent }: { type: AlertType, intent: AlertIntent }) => {
        return {
            fontSize: 14,
            lineHeight: 20,
            color: getMessageColor(theme, type, intent),
        };
    }
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const alertStyles = StyleSheet.create((theme: Theme) => {
    return {
        container: createContainerStyles(theme),
        iconContainer: createIconContainerStyles(theme),
        content: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
        },
        title: createTitleStyles(theme),
        message: createMessageStyles(theme),
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

// Export individual style sheets for backwards compatibility
export const alertContainerStyles = StyleSheet.create((theme: Theme) => {
    return {
        container: createContainerStyles(theme),
    };
});

export const alertIconStyles = StyleSheet.create((theme: Theme) => {
    return {
        iconContainer: createIconContainerStyles(theme),
    };
});

export const alertContentStyles = StyleSheet.create((theme: Theme) => {
    return {
        content: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
        },
    };
});

export const alertTitleStyles = StyleSheet.create((theme: Theme) => {
    return {
        title: createTitleStyles(theme),
    };
});

export const alertMessageStyles = StyleSheet.create((theme: Theme) => {
    return {
        message: createMessageStyles(theme),
    };
});

export const alertActionsStyles = StyleSheet.create((theme: Theme) => {
    return {
        actions: {
            marginTop: 4,
            display: 'flex',
            flexDirection: 'row',
            gap: 8,
        },
    };
});

export const alertCloseButtonStyles = StyleSheet.create((theme: Theme) => {
    return {
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
