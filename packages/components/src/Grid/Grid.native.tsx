import React, { forwardRef, useMemo, Children } from 'react';
import { View } from 'react-native';
import { useResponsiveStyle, isResponsiveValue, Responsive } from '@idealyst/theme';
import { UnistylesRuntime } from 'react-native-unistyles';
import { GridProps } from './types';
import { gridStyles } from './Grid.styles';
import type { IdealystElement } from '../utils/refTypes';

/**
 * Resolve a responsive number value to a concrete number for the current breakpoint.
 */
function useResolvedColumns(columns: Responsive<number>): number {
    const resolved = useResponsiveStyle(
        isResponsiveValue(columns)
            ? { zIndex: columns as any }
            : {}
    );

    if (isResponsiveValue(columns)) {
        return (resolved.zIndex as number) ?? 1;
    }

    return columns;
}

/**
 * Get the gap value in pixels from the theme for a given size key.
 */
function getGapPixels(size: string): number {
    const theme = UnistylesRuntime.getTheme();
    const sizes = (theme as any).sizes?.view;
    return sizes?.[size]?.spacing ?? 16;
}

/**
 * Grid component for React Native.
 *
 * Uses flexbox wrapping with calculated percentage widths to simulate
 * a grid layout. Each child is wrapped in a cell view that handles sizing.
 */
const Grid = forwardRef<IdealystElement, GridProps>(({
    children,
    columns = 1,
    gap = 'md',
    padding,
    paddingVertical,
    paddingHorizontal,
    margin,
    marginVertical,
    marginHorizontal,
    style,
    testID,
    id,
    onLayout,
}, ref) => {
    const resolvedColumns = useResolvedColumns(columns);
    const gapPx = getGapPixels(gap);

    gridStyles.useVariants({
        gap,
        padding,
        paddingVertical,
        paddingHorizontal,
        margin,
        marginVertical,
        marginHorizontal,
    });

    // Calculate cell width accounting for gaps between columns.
    // Total gap space = gapPx * (columns - 1), divided equally among all columns.
    const cellStyle = useMemo(() => {
        const totalGapSpace = gapPx * (resolvedColumns - 1);
        return {
            flexBasis: `${((1 / resolvedColumns) * 100).toFixed(4)}%` as any,
            maxWidth: `${((1 / resolvedColumns) * 100).toFixed(4)}%` as any,
            // Subtract proportional gap from each cell using negative margin + padding trick
            // is fragile, so we use the gap property on the container which RN supports.
        };
    }, [resolvedColumns, gapPx]);

    const items = Children.toArray(children);

    return (
        <View
            ref={ref as any}
            style={[gridStyles.grid as any, style]}
            testID={testID}
            nativeID={id}
            onLayout={onLayout}
        >
            {items.map((child, index) => (
                <View key={(child as any).key ?? index} style={cellStyle}>
                    {child}
                </View>
            ))}
        </View>
    );
});

Grid.displayName = 'Grid';

export default Grid;
