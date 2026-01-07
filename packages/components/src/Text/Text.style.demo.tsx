import { ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

type Theme = ThemeStyleWrapper<BaseTheme>;

const defineStyle = {} as any
defineStyle('Text', (theme: Theme) => ({
    text: {
        margin: 0,
        padding: 0,
        color: theme.colors.text.primary,
        variants: {
            // Typography variants
            
        }}
}))