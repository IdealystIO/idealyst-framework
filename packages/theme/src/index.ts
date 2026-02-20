// Core types first (no dependencies)
export * from './theme';
export * from './variants';
export * from './components';

// Builder (depends on theme types)
export * from './builder';

// Themes (depend on builder)
export * from './lightTheme';
export * from './darkTheme';

// Unistyles declaration (depends on theme)
export * from './unistyles';

// Helpers and styles
export * from './styles';
export * from './helpers';
export * from './styleBuilder';
export * from './extensions';
export * from './componentStyles';

// Responsive utilities
export * from './responsive';
export * from './breakpoints';
export * from './useResponsiveStyle';

// Color scheme utilities
export * from './colorScheme';

// Font scale utilities
export { applyFontScale, contentSizeCategoryToScale, type ApplyFontScaleOptions } from './fontScale';
export { updateFontScale, getFontScale, type UpdateFontScaleOptions } from './fontScaleRuntime';

// Theme hook
export { useTheme } from './useTheme';

// Style props hook (platform-specific via .native.ts)
export { useStyleProps, type StyleProps } from './useStyleProps';

// Shadow utility (platform-specific via .native.ts)
export { shadow, type ShadowOptions, type ShadowStyle } from './shadow';

// Component defaults
export { setDefaultMaxFontSizeMultiplier, getDefaultMaxFontSizeMultiplier } from './defaults';

// Animation tokens and utilities
// Note: Use '@idealyst/theme/animation' for full animation API
export { durations, easings, presets } from './animation/tokens';