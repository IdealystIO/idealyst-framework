import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles} from '@idealyst/theme';
type DialogSize = 'sm' | 'md' | 'lg' | 'fullscreen';
type DialogType = 'default' | 'alert' | 'confirmation';

type DialogVariants = {
    size: DialogSize;
    type: DialogType;
}

export type ExpandedDialogStyles = StylesheetStyles<keyof DialogVariants>;

export type DialogStylesheet = {
    backdrop: ExpandedDialogStyles;
    container: ExpandedDialogStyles;
    header: ExpandedDialogStyles;
    title: ExpandedDialogStyles;
    closeButton: ExpandedDialogStyles;
    closeButtonText: ExpandedDialogStyles;
    content: ExpandedDialogStyles;
    modal: ExpandedDialogStyles;
}

/**
 * Create size variants for container
 */
function createContainerSizeVariants() {
    return {
        sm: {
            width: '90%',
            maxWidth: 400,
        },
        md: {
            width: '90%',
            maxWidth: 600,
        },
        lg: {
            width: '90%',
            maxWidth: 800,
        },
        fullscreen: {
            width: '100%',
            height: '100%',
            borderRadius: 0,
            maxHeight: '100%',
        },
    };
}

/**
 * Create type variants for container
 */
function createContainerTypeVariants(theme: Theme) {
    return {
        default: {},
        alert: {
            borderTopWidth: 4,
            borderTopColor: theme.colors.border.primary,
        },
        confirmation: {
            borderTopWidth: 4,
            borderTopColor: theme.colors.border.primary,
        },
    };
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const dialogStyles = StyleSheet.create((theme: Theme) => {
    return {
        backdrop: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            _web: {
                position: 'fixed',
                transition: 'opacity 150ms ease-out',
            },
        },
        container: {
            backgroundColor: theme.colors.surface.primary,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 10,
            maxHeight: '90%',
            variants: {
                size: createContainerSizeVariants(),
                type: createContainerTypeVariants(theme),
            },
            _web: {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                transition: 'opacity 150ms ease-out, transform 150ms ease-out',
                transformOrigin: 'center center',
            },
        },
        header: {
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.primary,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            _web: {
                borderBottomStyle: 'solid',
            },
        },
        title: {
            marginLeft: 24,
            fontSize: 18,
            paddingVertical: 16,
            fontWeight: '600',
            color: theme.colors.text.primary,
            flex: 1,
            _web: {
                paddingVertical: 4,
            },
        },
        closeButton: {
            width: 32,
            height: 32,
            marginRight: 16,
            borderRadius: 16,
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            _web: {
                border: 'none',
                cursor: 'pointer',
                _hover: {
                    backgroundColor: theme.colors.surface.secondary,
                },
            },
        },
        closeButtonText: {
            fontSize: 18,
            color: theme.colors.text.secondary,
            fontWeight: '500',
        },
        content: {
            padding: 24,
            _web: {
                overflow: 'visible',
                maxHeight: 'none',
            },
        },
        modal: {
            margin: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
    };
});
