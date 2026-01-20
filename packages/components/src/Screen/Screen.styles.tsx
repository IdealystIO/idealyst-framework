/**
 * Screen styles using defineStyle with $iterator expansion.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';
import type { Surface } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

// Background type is derived from Surface color keys plus 'transparent'
type ScreenBackground = Surface | 'transparent';

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
 * Screen styles with $iterator expansion for spacing and background variants.
 *
 * NOTE: Top-level theme access required for Unistyles reactivity.
 * The background variant uses $surface iterator to expand to all surface color keys.
 */
export const screenStyles = defineStyle('Screen', (theme: Theme) => ({
    screen: (_props: ScreenDynamicProps) => ({
        flex: 1,
        variants: {
            // $iterator expands for each surface color key
            background: {
                backgroundColor: theme.colors.$surface,
                // 'transparent' is handled separately via compound variant or default
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
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
        },
    }),

    screenContent: (_props: ScreenDynamicProps) => ({
        variants: {
            // $iterator expands for each surface color key
            background: {
                backgroundColor: theme.colors.$surface,
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
