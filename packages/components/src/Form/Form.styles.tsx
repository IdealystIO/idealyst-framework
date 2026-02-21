import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

void StyleSheet;
type Theme = ThemeStyleWrapper<BaseTheme>;

export const formStyles = defineStyle('Form', (_theme: Theme) => ({
    container: {
        display: 'flex' as const,
        flexDirection: 'column' as const,
        width: '100%',
    },
}));
