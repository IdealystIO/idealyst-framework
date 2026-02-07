/**
 * Pressable styles using defineStyle with $iterator expansion.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type PressableDynamicProps = {
    padding?: ViewStyleSize;
    paddingVertical?: ViewStyleSize;
    paddingHorizontal?: ViewStyleSize;
};

/**
 * Pressable styles with spacing variants.
 */
export const pressableStyles = defineStyle('Pressable', (theme: Theme) => ({
    pressable: (props: PressableDynamicProps & { disabled?: boolean }) => ({
        cursor: props.disabled ? 'default' : 'pointer',
        outline: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        opacity: props.disabled ? 0.5 : 1,
        variants: {
            // $iterator expands for each view size
            padding: {
                padding: theme.sizes.$view.padding,
            },
            paddingVertical: {
                paddingVertical: theme.sizes.$view.padding,
            },
            paddingHorizontal: {
                paddingHorizontal: theme.sizes.$view.padding,
            },
        },
    }),
}));
