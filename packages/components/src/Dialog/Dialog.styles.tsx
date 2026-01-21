/**
 * Dialog styles using defineStyle with dynamic props.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type DialogSize = 'sm' | 'md' | 'lg' | 'fullscreen';
type DialogType = 'default' | 'alert' | 'confirmation';

export type DialogDynamicProps = {
    size?: DialogSize;
    type?: DialogType;
};

/**
 * Dialog styles with size/type handling.
 */
export const dialogStyles = defineStyle('Dialog', (theme: Theme) => ({
    backdrop: (_props: DialogDynamicProps) => ({
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
    }),

    container: ({ size = 'md', type = 'default' }: DialogDynamicProps) => {
        // Size dimensions
        const sizeStyles = {
            sm: { width: '90%', maxWidth: 400 },
            md: { width: '90%', maxWidth: 600 },
            lg: { width: '90%', maxWidth: 800 },
            fullscreen: { width: '100%', height: '100%', borderRadius: 0, maxHeight: '100%' },
        }[size];

        // Type-specific styles
        const typeStyles = type !== 'default' ? {
            borderTopWidth: 4,
            borderTopColor: theme.colors.border.primary,
        } : {};

        return {
            backgroundColor: theme.colors.surface.primary,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 10,
            maxHeight: '90%',
            ...sizeStyles,
            ...typeStyles,
            _web: {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                transition: 'opacity 150ms ease-out, transform 150ms ease-out',
                transformOrigin: 'center center',
            },
        } as const;
    },

    header: (_props: DialogDynamicProps) => ({
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.primary,
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        _web: {
            borderBottomStyle: 'solid',
        },
    }),

    title: (_props: DialogDynamicProps) => ({
        marginLeft: 24,
        fontSize: 18,
        paddingVertical: 16,
        fontWeight: '600' as const,
        color: theme.colors.text.primary,
        flex: 1,
        _web: {
            paddingVertical: 4,
        },
    }),

    closeButton: (_props: DialogDynamicProps) => ({
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
    }),

    closeButtonText: (_props: DialogDynamicProps) => ({
        fontSize: 18,
        color: theme.colors.text.secondary,
        fontWeight: '500' as const,
    }),

    content: (_props: DialogDynamicProps) => ({
        _web: {
            overflow: 'visible',
            maxHeight: 'none',
        },
    }),

    modal: (_props: DialogDynamicProps) => ({
        margin: 0,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    }),
}));
