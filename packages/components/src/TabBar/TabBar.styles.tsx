import { StyleSheet } from 'react-native-unistyles';
import { Theme } from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';
import {
  buildGapVariants,
  buildPaddingVariants,
  buildPaddingVerticalVariants,
  buildPaddingHorizontalVariants,
  buildMarginVariants,
  buildMarginVerticalVariants,
  buildMarginHorizontalVariants,
} from '../utils/buildViewStyleVariants';
import { TabBarPillMode, TabBarSizeVariant, TabBarType, TabBarIconPosition, TabBarJustify } from './types';
import { applyExtensions } from '../extensions/applyExtension';

type ContainerDynamicProps = {
    type?: TabBarType;
    pillMode?: TabBarPillMode;
};

type TabDynamicProps = {
    type?: TabBarType;
    size?: TabBarSizeVariant;
    active?: boolean;
    pillMode?: TabBarPillMode;
};

type LabelDynamicProps = {
    type?: TabBarType;
    active?: boolean;
    pillMode?: TabBarPillMode;
};

type IndicatorDynamicProps = {
    type?: TabBarType;
    pillMode?: TabBarPillMode;
};

/**
 * Get container background color based on type and pillMode
 */
function getContainerBackgroundColor(theme: Theme, type: TabBarType, pillMode: TabBarPillMode): string | undefined {
    if (type === 'pills') {
        return pillMode === 'dark' ? theme.colors.surface.inverse : theme.colors.surface.secondary;
    }
    return undefined;
}

/**
 * Get tab padding based on type and size (pills have compact padding)
 */
function getTabPadding(type: TabBarType, size: TabBarSizeVariant): { paddingVertical?: number; paddingHorizontal?: number } {
    if (type !== 'pills') return {};

    const paddingMap: Record<TabBarSizeVariant, { paddingVertical: number; paddingHorizontal: number }> = {
        xs: { paddingVertical: 2, paddingHorizontal: 10 },
        sm: { paddingVertical: 4, paddingHorizontal: 12 },
        md: { paddingVertical: 6, paddingHorizontal: 16 },
        lg: { paddingVertical: 8, paddingHorizontal: 20 },
        xl: { paddingVertical: 10, paddingHorizontal: 24 },
    };
    return paddingMap[size] || paddingMap.md;
}

/**
 * Get tab text color based on type and active state
 */
function getTabColor(theme: Theme, type: TabBarType, active: boolean): string | undefined {
    if (!active) return undefined;
    if (type === 'pills') return theme.intents.primary.contrast;
    if (type === 'underline') return theme.intents.primary.primary;
    return theme.colors.text.primary;
}

/**
 * Get label color based on type, pillMode, and active state
 */
function getLabelColor(theme: Theme, type: TabBarType, pillMode: TabBarPillMode, active: boolean): string | undefined {
    if (!active) return undefined;
    if (type === 'pills') return theme.colors.text.primary;
    if (type === 'underline') return theme.intents.primary.primary;
    return theme.colors.text.primary;
}

/**
 * Get indicator background color based on type and pillMode
 */
function getIndicatorBackgroundColor(theme: Theme, type: TabBarType, pillMode: TabBarPillMode): string | undefined {
    if (type === 'pills') {
        return pillMode === 'dark' ? theme.colors.surface.secondary : theme.colors.surface.tertiary;
    }
    return undefined;
}

/**
 * Create size variants for tab
 */
function createTabSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'tabBar', (size) => ({
        fontSize: size.fontSize,
        padding: size.padding,
        lineHeight: size.lineHeight,
    }));
}

/**
 * Create size variants for label
 */
function createLabelSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'tabBar', (size) => ({
        fontSize: size.fontSize,
        lineHeight: size.lineHeight,
    }));
}

/**
 * Create size variants for icon
 */
function createIconSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'tabBar', (size) => ({
        width: size.fontSize,
        height: size.fontSize,
    }));
}

/**
 * Create dynamic container styles
 */
function createContainerStyles(theme: Theme) {
    return ({ type = 'standard', pillMode = 'light' }: ContainerDynamicProps) => {
        const bgColor = getContainerBackgroundColor(theme, type, pillMode);

        return {
            display: 'flex',
            flexDirection: 'row',
            gap: type === 'pills' ? 4 : 0,
            position: 'relative',
            borderBottomWidth: type === 'pills' ? 0 : 1,
            borderBottomStyle: 'solid' as const,
            borderBottomColor: theme.colors.border.primary,
            padding: type === 'pills' ? 4 : undefined,
            backgroundColor: bgColor || (type === 'pills' ? theme.colors.surface.secondary : undefined),
            overflow: type === 'pills' ? 'hidden' as const : undefined,
            alignSelf: type === 'pills' ? 'flex-start' as const : undefined,
            width: type === 'pills' ? undefined : '100%',
            borderRadius: type === 'pills' ? 9999 : undefined,
            variants: {
                justify: {
                    start: { justifyContent: 'flex-start' },
                    center: { justifyContent: 'center' },
                    equal: { justifyContent: 'stretch', width: '100%' },
                    'space-between': { justifyContent: 'space-between', width: '100%' },
                },
                // Spacing variants from ContainerStyleProps
                gap: buildGapVariants(theme),
                padding: buildPaddingVariants(theme),
                paddingVertical: buildPaddingVerticalVariants(theme),
                paddingHorizontal: buildPaddingHorizontalVariants(theme),
                margin: buildMarginVariants(theme),
                marginVertical: buildMarginVerticalVariants(theme),
                marginHorizontal: buildMarginHorizontalVariants(theme),
            } as const,
        } as const;
    };
}

/**
 * Create dynamic tab styles
 */
function createTabStyles(theme: Theme) {
    return ({ type = 'standard', size = 'md', active = false, pillMode = 'light', justify = 'start' }: TabDynamicProps) => {
        const tabPadding = getTabPadding(type, size);
        const color = getTabColor(theme, type, active);

        return {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '500',
            flex: justify === 'equal' ? 1 : undefined,
            color: color || (active ? theme.colors.text.primary : theme.colors.text.secondary),
            position: 'relative',
            zIndex: 2,
            backgroundColor: 'transparent',
            gap: 6,
            borderRadius: type === 'pills' ? 9999 : undefined,
            ...tabPadding,
            variants: {
                size: createTabSizeVariants(theme),
                disabled: {
                    true: {
                        opacity: 0.5,
                        _web: { cursor: 'not-allowed' },
                    },
                    false: {
                        _web: { _hover: { color: theme.colors.text.primary } },
                    },
                },
                iconPosition: {
                    left: { flexDirection: 'row' },
                    top: { flexDirection: 'column' },
                },
                justify: {
                    start: {},
                    center: {},
                    equal: { flex: 1 },
                    'space-between': {},
                },
            } as const,
            _web: {
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                transition: 'color 0.2s ease',
            },
        } as const;
    };
}

/**
 * Create dynamic tab label styles
 */
function createTabLabelStyles(theme: Theme) {
    return ({ type = 'standard', active = false, pillMode = 'light' }: LabelDynamicProps) => {
        const color = getLabelColor(theme, type, pillMode, active);

        return {
            position: 'relative',
            zIndex: 3,
            fontWeight: '500',
            color: color || (active ? theme.colors.text.primary : theme.colors.text.secondary),
            variants: {
                size: createLabelSizeVariants(theme),
                disabled: {
                    true: { opacity: 0.5 },
                    false: {},
                },
            },
        } as const;
    };
}

/**
 * Create dynamic indicator styles
 */
function createIndicatorStyles(theme: Theme) {
    return ({ type = 'standard', pillMode = 'light' }: IndicatorDynamicProps) => {
        const bgColor = getIndicatorBackgroundColor(theme, type, pillMode);

        const typeStyles = type === 'pills' ? {
            borderRadius: 9999,
            bottom: 4,
            top: 4,
            left: 0,
            backgroundColor: bgColor,
        } : {
            bottom: -1,
            height: 2,
            backgroundColor: theme.intents.primary.primary,
        };

        return {
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: 1,
            ...typeStyles,
            _web: {
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            },
        } as const;
    };
}

/**
 * Create icon styles (static, no compound variants)
 */
function createIconStyles(theme: Theme) {
    return {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        variants: {
            size: createIconSizeVariants(theme),
            active: {
                true: {},
                false: {},
            },
            disabled: {
                true: { opacity: 0.5 },
                false: {},
            },
            iconPosition: {
                left: {},
                top: { marginBottom: 2 },
            },
        } as const,
    } as const;
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel transform on native cannot resolve function calls to extract variant structures.
export const tabBarStyles = StyleSheet.create((theme: Theme) => {
    // Apply extensions to main visual elements
    const extended = applyExtensions('TabBar', theme, {
        container: createContainerStyles(theme),
        tab: createTabStyles(theme),
        indicator: createIndicatorStyles(theme),
    });

    return {
        ...extended,
        // Minor utility styles (not extended)
        tabLabel: createTabLabelStyles(theme),
        tabIcon: createIconStyles(theme),
    };
});

// Export individual style sheets for backwards compatibility
export const tabBarContainerStyles = StyleSheet.create((theme: Theme) => {
    return {
        container: createContainerStyles(theme),
    } as const;
});

export const tabBarTabStyles = StyleSheet.create((theme: Theme) => {
    return {
        tab: createTabStyles(theme),
    } as const;
});

export const tabBarLabelStyles = StyleSheet.create((theme: Theme) => {
    return {
        tabLabel: createTabLabelStyles(theme),
    } as const;
});

export const tabBarIndicatorStyles = StyleSheet.create((theme: Theme) => {
    return {
        indicator: createIndicatorStyles(theme),
    } as const;
});

export const tabBarIconStyles = StyleSheet.create((theme: Theme) => {
    return {
        tabIcon: createIconStyles(theme),
    } as const;
});
