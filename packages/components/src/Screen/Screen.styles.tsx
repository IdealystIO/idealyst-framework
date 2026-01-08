/**
 * Screen styles using defineStyle with $iterator expansion.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type ScreenBackground = 'screen' | 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'inverse-secondary' | 'inverse-tertiary' | 'transparent';

export type ScreenDynamicProps = {
    background?: ScreenBackground;
    safeArea?: boolean;
    gap?: ViewStyleSize;
    padding?: ViewStyleSize;
    paddingVertical?: ViewStyleSize;
    paddingHorizontal?: ViewStyleSize;
    margin?: ViewStyleSize;
    marginVertical?: ViewStyleSize;
    marginHorizontal?: ViewStyleSize;
};

/**
 * Screen styles with $iterator expansion for spacing variants.
 *
 * NOTE: Top-level theme access required for Unistyles reactivity.
 */
export const screenStyles = defineStyle('Screen', (theme: Theme) => ({
    screen: (_props: ScreenDynamicProps) => ({
        flex: 1,
        variants: {
            background: {
                screen: { backgroundColor: theme.colors.surface.screen },
                primary: { backgroundColor: theme.colors.surface.primary },
                secondary: { backgroundColor: theme.colors.surface.secondary },
                tertiary: { backgroundColor: theme.colors.surface.tertiary },
                inverse: { backgroundColor: theme.colors.surface.inverse },
                'inverse-secondary': { backgroundColor: theme.colors.surface['inverse-secondary'] },
                'inverse-tertiary': { backgroundColor: theme.colors.surface['inverse-tertiary'] },
                transparent: { backgroundColor: 'transparent' },
            },
            safeArea: {
                true: {},
                false: {},
            },
            // $iterator expands for each view size
            gap: {
                gap: theme.sizes.$view.spacing,
            },
            padding: {
                padding: theme.sizes.$view.padding,
            },
            paddingVertical: {
                paddingVertical: theme.sizes.$view.padding,
            },
            paddingHorizontal: {
                paddingHorizontal: theme.sizes.$view.padding,
            },
            margin: {
                margin: theme.sizes.$view.padding,
            },
            marginVertical: {
                marginVertical: theme.sizes.$view.padding,
            },
            marginHorizontal: {
                marginHorizontal: theme.sizes.$view.padding,
            },
        },
        _web: {
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100%',
            boxSizing: 'border-box',
        },
    }),

    screenContent: (_props: ScreenDynamicProps) => ({
        variants: {
            background: {
                screen: { backgroundColor: theme.colors.surface.screen },
                primary: { backgroundColor: theme.colors.surface.primary },
                secondary: { backgroundColor: theme.colors.surface.secondary },
                tertiary: { backgroundColor: theme.colors.surface.tertiary },
                inverse: { backgroundColor: theme.colors.surface.inverse },
                'inverse-secondary': { backgroundColor: theme.colors.surface['inverse-secondary'] },
                'inverse-tertiary': { backgroundColor: theme.colors.surface['inverse-tertiary'] },
                transparent: { backgroundColor: 'transparent' },
            },
            safeArea: {
                true: {},
                false: {},
            },
            gap: {
                gap: theme.sizes.$view.spacing,
            },
            padding: {
                padding: theme.sizes.$view.padding,
            },
            paddingVertical: {
                paddingVertical: theme.sizes.$view.padding,
            },
            paddingHorizontal: {
                paddingHorizontal: theme.sizes.$view.padding,
            },
            margin: {
                margin: theme.sizes.$view.padding,
            },
            marginVertical: {
                marginVertical: theme.sizes.$view.padding,
            },
            marginHorizontal: {
                marginHorizontal: theme.sizes.$view.padding,
            },
        },
    }),
}));
