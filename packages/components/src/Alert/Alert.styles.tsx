import { StyleSheet } from 'react-native-unistyles';
import { Theme, Intent } from '@idealyst/theme';

type AlertType = 'filled' | 'outlined' | 'soft';
type AlertIntent = Intent;

export type AlertVariants = {
    type: AlertType;
    intent: AlertIntent;
}

type AlertDynamicProps = {
    intent?: AlertIntent;
    type?: AlertType;
};

/**
 * Get the intent value, mapping 'info' to 'primary' for backwards compatibility
 */
function getIntentValue(theme: Theme, intent: AlertIntent) {
    return theme.intents[intent];
}

/**
 * Get container background color based on intent and type
 */
function getContainerBackgroundColor(theme: Theme, intent: AlertIntent, type: AlertType): string {
    const intentValue = getIntentValue(theme, intent);
    if (type === 'filled') {
        return intentValue.primary;
    }
    if (type === 'soft') {
        return intentValue.light;
    }
    return 'transparent'; // outlined
}

/**
 * Get container border color based on intent and type
 */
function getContainerBorderColor(theme: Theme, intent: AlertIntent, type: AlertType): string {
    const intentValue = getIntentValue(theme, intent);
    if (type === 'filled' || type === 'outlined') {
        return intentValue.primary;
    }
    return intentValue.light; // soft
}

/**
 * Get icon/title color based on intent and type
 */
function getIconTitleColor(theme: Theme, intent: AlertIntent, type: AlertType): string {
    const intentValue = getIntentValue(theme, intent);
    if (type === 'filled') {
        return intentValue.contrast;
    }
    return intentValue.primary; // outlined, soft
}

/**
 * Get message color based on intent and type
 */
function getMessageColor(theme: Theme, intent: AlertIntent, type: AlertType): string {
    const intentValue = getIntentValue(theme, intent);
    if (type === 'filled') {
        return intentValue.contrast;
    }
    return theme.colors.text.primary; // outlined, soft
}

/**
 * Create dynamic container styles
 */
function createContainerStyles(theme: Theme) {
    return ({ intent = 'neutral', type = 'soft' }: AlertDynamicProps) => {
        return {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 8,
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderStyle: 'solid' as const,
            backgroundColor: getContainerBackgroundColor(theme, intent, type),
            borderColor: getContainerBorderColor(theme, intent, type),
        } as const;
    };
}

/**
 * Create dynamic icon container styles
 */
function createIconContainerStyles(theme: Theme) {
    return ({ intent = 'neutral', type = 'soft' }: AlertDynamicProps) => {
        return {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: 24,
            height: 24,
            color: getIconTitleColor(theme, intent, type),
        } as const;
    };
}

/**
 * Create dynamic title styles
 */
function createTitleStyles(theme: Theme) {
    return ({ intent = 'neutral', type = 'soft' }: AlertDynamicProps) => {
        return {
            fontSize: 16,
            lineHeight: 24,
            fontWeight: '600',
            color: getIconTitleColor(theme, intent, type),
        } as const;
    };
}

/**
 * Create dynamic message styles
 */
function createMessageStyles(theme: Theme) {
    return ({ intent = 'neutral', type = 'soft' }: AlertDynamicProps) => {
        return {
            fontSize: 14,
            lineHeight: 20,
            color: getMessageColor(theme, intent, type),
        } as const;
    };
}

export const alertStyles = StyleSheet.create((theme: Theme) => {
    return {
        container: createContainerStyles(theme),
        iconContainer: createIconContainerStyles(theme),
        title: createTitleStyles(theme),
        message: createMessageStyles(theme),
        content: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
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
