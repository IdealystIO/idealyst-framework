import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles } from '@idealyst/theme';
import { applyExtensions } from '../extensions/applyExtension';
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
    } as const;
}

/**
 * Create type variants for container
 */
function createContainerTypeVariants(theme: Theme) {
    return {
        standard: {},
        alert: {
            borderTopWidth: 4,
            borderTopColor: theme.colors.border.primary,
        },
        confirmation: {
            borderTopWidth: 4,
            borderTopColor: theme.colors.border.primary,
        },
    } as const;
}

// Helper functions to create static styles wrapped in dynamic functions
function createBackdropStyles() {
    return () => ({
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        zIndex: 1000,
        _web: {
            position: 'fixed',
            transition: 'opacity 150ms ease-out',
        },
    });
}

function createDialogContainerStyles(theme: Theme) {
    return () => ({
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
    });
}

function createHeaderStyles(theme: Theme) {
    return () => ({
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.primary,
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        _web: {
            borderBottomStyle: 'solid',
        },
    });
}

function createTitleStyles(theme: Theme) {
    return () => ({
        marginLeft: 24,
        fontSize: 18,
        paddingVertical: 16,
        fontWeight: '600' as const,
        color: theme.colors.text.primary,
        flex: 1,
        _web: {
            paddingVertical: 4,
        },
    });
}

function createCloseButtonStyles(theme: Theme) {
    return () => ({
        width: 32,
        height: 32,
        marginRight: 16,
        borderRadius: 16,
        backgroundColor: 'transparent' as const,
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        _web: {
            border: 'none',
            cursor: 'pointer',
            _hover: {
                backgroundColor: theme.colors.surface.secondary,
            },
        },
    });
}

function createCloseButtonTextStyles(theme: Theme) {
    return () => ({
        fontSize: 18,
        color: theme.colors.text.secondary,
        fontWeight: '500' as const,
    });
}

function createContentStyles() {
    return () => ({
        padding: 24,
        _web: {
            overflow: 'visible',
            maxHeight: 'none',
        },
    });
}

function createModalStyles() {
    return () => ({
        margin: 0,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    });
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel transform on native cannot resolve function calls to extract variant structures.
export const dialogStyles = StyleSheet.create((theme: Theme) => {
    // Apply extensions to main visual elements
    const extended = applyExtensions('Dialog', theme, {
        backdrop: createBackdropStyles(),
        container: createDialogContainerStyles(theme),
        header: createHeaderStyles(theme),
        content: createContentStyles(),
    });

    return {
        ...extended,
        // Minor utility styles (not extended)
        title: createTitleStyles(theme)(),
        closeButton: createCloseButtonStyles(theme)(),
        closeButtonText: createCloseButtonTextStyles(theme)(),
        modal: createModalStyles()(),
    };
});
